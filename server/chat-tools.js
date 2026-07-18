'use strict';

const dns = require('node:dns').promises;
const http = require('node:http');
const https = require('node:https');
const net = require('node:net');

const DOCUMENT_TEXT_LIMIT = 100_000;
const WEB_RESPONSE_LIMIT = 2_000_000;
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

/** Create a client-safe HTTP 400 error. */
function badRequest(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

/** Analyze a local document payload without sending its contents elsewhere. */
function analyzeDocument(payload = {}) {
  if (!payload || typeof payload !== 'object') {
    throw badRequest('Document payload is required');
  }

  const {
    name = 'document',
    type = 'text/plain',
    size = 0,
    content = ''
  } = payload;

  if (typeof content !== 'string' || content.length === 0) {
    throw badRequest('Document content is required');
  }

  const safeName = typeof name === 'string' && name ? name : 'document';
  const safeType = typeof type === 'string' && type ? type : 'text/plain';
  const safeSize = Number.isFinite(size) && size >= 0 ? size : 0;
  const isImage = safeType.startsWith('image/');
  const analysis = isImage
    ? `Image received: ${safeName} (${safeType}, ${safeSize} bytes). OCR is not configured.`
    : content.slice(0, DOCUMENT_TEXT_LIMIT);

  return {
    analysis,
    metadata: {
      name: safeName,
      type: safeType,
      size: safeSize,
      truncated: !isImage && content.length > DOCUMENT_TEXT_LIMIT
    },
    mode: 'offline'
  };
}

/** Return true when an address is invalid, private, local, or reserved. */
function isPrivateAddress(address) {
  if (typeof address !== 'string') return true;

  const normalized = address.toLowerCase().split('%')[0];
  const mappedIpv4 = normalized.match(/^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/);
  if (mappedIpv4) return isPrivateAddress(mappedIpv4[1]);

  const version = net.isIP(normalized);
  if (version === 4) {
    const [a, b] = normalized.split('.').map(Number);
    return a === 0
      || a === 10
      || a === 127
      || (a === 100 && b >= 64 && b <= 127)
      || (a === 169 && b === 254)
      || (a === 172 && b >= 16 && b <= 31)
      || (a === 192 && b === 0)
      || (a === 192 && b === 168)
      || (a === 198 && (b === 18 || b === 19))
      || a >= 224;
  }

  if (version === 6) {
    return normalized === '::'
      || normalized === '::1'
      || normalized.startsWith('fc')
      || normalized.startsWith('fd')
      || /^fe[89ab]/.test(normalized)
      || normalized.startsWith('ff')
      || normalized.startsWith('2001:db8:');
  }

  return true;
}

/** Normalize a URL hostname for local-host and IP checks. */
function normalizeHostname(hostname) {
  const normalized = hostname.toLowerCase();
  if (normalized.startsWith('[') && normalized.endsWith(']')) {
    return normalized.slice(1, -1);
  }
  return normalized.replace(/\.$/, '');
}

/** Validate a public URL and select one already-vetted DNS address. */
async function resolvePublicUrl(value, options = {}) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw badRequest('A valid URL is required');
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw badRequest('Only HTTP and HTTPS URLs are supported');
  }
  if (url.username || url.password) {
    throw badRequest('URLs containing credentials are not allowed');
  }

  const hostname = normalizeHostname(url.hostname);
  if (hostname === 'localhost' || hostname.endsWith('.localhost')) {
    throw badRequest('Private and local network addresses are not allowed');
  }

  const lookup = options.lookup || dns.lookup;
  const addresses = await lookup(hostname, { all: true, verbatim: true });
  if (!Array.isArray(addresses)
      || addresses.length === 0
      || addresses.some((entry) => !entry || isPrivateAddress(entry.address))) {
    throw badRequest('Private and local network addresses are not allowed');
  }

  const selected = addresses[0];
  return {
    url,
    hostname,
    address: selected.address,
    family: Number(selected.family) || net.isIP(selected.address)
  };
}

/** Validate a URL while preserving the original URL-returning API. */
async function validatePublicUrl(value, options = {}) {
  const { url } = await resolvePublicUrl(value, options);
  return url;
}

/** Build a Node lookup callback that can return only one vetted address. */
function createPinnedLookup(address, family) {
  return (_hostname, options, callback) => {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    if (options && options.all) {
      callback(null, [{ address, family }]);
      return;
    }
    callback(null, address, family);
  };
}

/** Perform one HTTP request with DNS pinned to a previously vetted address. */
function requestPinned(url, options = {}) {
  if (typeof options.lookup !== 'function') {
    return Promise.reject(new Error('A pinned DNS lookup is required'));
  }

  const client = url.protocol === 'https:' ? https : http;
  const headers = { ...options.headers };
  const hasHostHeader = Object.keys(headers).some((name) => name.toLowerCase() === 'host');
  if (!hasHostHeader) headers.Host = url.host;

  return new Promise((resolve, reject) => {
    const request = client.request(url, {
      method: 'GET',
      headers,
      lookup: options.lookup,
      servername: options.servername,
      signal: options.signal
    }, (response) => {
      resolve({
        status: response.statusCode || 0,
        ok: response.statusCode >= 200 && response.statusCode < 300,
        headers: {
          get(name) {
            const value = response.headers[name.toLowerCase()];
            if (Array.isArray(value)) return value.join(', ');
            return value === undefined ? null : String(value);
          }
        },
        body: response
      });
    });

    request.once('error', reject);
    request.end();
  });
}

/** Read a Web or Node response stream without exceeding the byte limit. */
async function readResponseText(response, maxBytes) {
  const declaredLength = Number(response.headers.get('content-length') || 0);
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw badRequest('Remote response is too large');
  }

  let iterator;
  let cancel;
  if (response.body && typeof response.body.getReader === 'function') {
    const reader = response.body.getReader();
    iterator = { next: () => reader.read() };
    cancel = () => reader.cancel();
  } else if (response.body && typeof response.body[Symbol.asyncIterator] === 'function') {
    iterator = response.body[Symbol.asyncIterator]();
    cancel = () => {
      if (typeof response.body.destroy === 'function') {
        response.body.destroy();
        return undefined;
      }
      return typeof iterator.return === 'function' ? iterator.return() : undefined;
    };
  } else {
    throw badRequest('Remote response cannot be safely streamed');
  }

  const chunks = [];
  let bytesRead = 0;
  let truncated = false;

  while (true) {
    const { done, value } = await iterator.next();
    if (done) break;

    const chunk = Buffer.from(value);
    const remaining = maxBytes - bytesRead;
    if (chunk.length > remaining) {
      if (remaining > 0) chunks.push(chunk.subarray(0, remaining));
      truncated = true;
      try {
        await cancel();
      } catch {
        // The size cap has already been enforced; cancellation is best effort.
      }
      break;
    }

    chunks.push(chunk);
    bytesRead += chunk.length;
  }

  return { text: Buffer.concat(chunks).toString('utf8'), truncated };
}

/** Fetch bounded public HTML while revalidating and pinning every redirect. */
async function fetchPublicHtml(value, options = {}) {
  const lookup = options.lookup || dns.lookup;
  const requestImpl = options.fetchImpl || requestPinned;
  const timeoutMs = options.timeoutMs || 10_000;
  const maxBytes = options.maxBytes || WEB_RESPONSE_LIMIT;
  const maxRedirects = options.maxRedirects ?? 3;
  const makeSignal = options.makeSignal || ((milliseconds) => AbortSignal.timeout(milliseconds));

  if (typeof requestImpl !== 'function') {
    throw new Error('HTTP transport is not available');
  }

  let target = await resolvePublicUrl(value, { lookup });
  let response;

  for (let redirects = 0; ; redirects += 1) {
    response = await requestImpl(target.url, {
      redirect: 'manual',
      signal: makeSignal(timeoutMs),
      headers: { 'User-Agent': 'AgentFoundry/1.0' },
      lookup: createPinnedLookup(target.address, target.family),
      address: target.address,
      family: target.family,
      servername: net.isIP(target.hostname) ? undefined : target.hostname
    });

    if (!REDIRECT_STATUSES.has(response.status)) break;
    const location = response.headers.get('location');
    if (!location || redirects >= maxRedirects) {
      throw badRequest('Too many redirects');
    }
    target = await resolvePublicUrl(new URL(location, target.url).toString(), { lookup });
  }

  if (!response.ok) {
    throw badRequest(`Remote server returned HTTP ${response.status}`);
  }

  const { text: html, truncated } = await readResponseText(response, maxBytes);
  return { url: target.url.toString(), html, truncated };
}

module.exports = {
  DOCUMENT_TEXT_LIMIT,
  WEB_RESPONSE_LIMIT,
  analyzeDocument,
  createPinnedLookup,
  fetchPublicHtml,
  isPrivateAddress,
  readResponseText,
  requestPinned,
  resolvePublicUrl,
  validatePublicUrl
};
