'use strict';

const dns = require('node:dns').promises;
const net = require('node:net');

const DOCUMENT_TEXT_LIMIT = 100_000;
const WEB_RESPONSE_LIMIT = 2_000_000;
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

function badRequest(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

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

async function validatePublicUrl(value, options = {}) {
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

  const hostname = url.hostname.toLowerCase();
  if (hostname === 'localhost' || hostname.endsWith('.localhost')) {
    throw badRequest('Private and local network addresses are not allowed');
  }

  const lookup = options.lookup || dns.lookup;
  const addresses = await lookup(hostname, { all: true });
  if (!Array.isArray(addresses)
      || addresses.length === 0
      || addresses.some(({ address }) => isPrivateAddress(address))) {
    throw badRequest('Private and local network addresses are not allowed');
  }

  return url;
}

async function readResponseText(response, maxBytes) {
  const declaredLength = Number(response.headers.get('content-length') || 0);
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw badRequest('Remote response is too large');
  }

  if (!response.body || typeof response.body.getReader !== 'function') {
    const buffer = Buffer.from(await response.text());
    return {
      text: buffer.subarray(0, maxBytes).toString('utf8'),
      truncated: buffer.length > maxBytes
    };
  }

  const reader = response.body.getReader();
  const chunks = [];
  let bytesRead = 0;
  let truncated = false;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = Buffer.from(value);
    const remaining = maxBytes - bytesRead;
    if (chunk.length > remaining) {
      if (remaining > 0) chunks.push(chunk.subarray(0, remaining));
      truncated = true;
      try {
        await reader.cancel();
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

async function fetchPublicHtml(value, options = {}) {
  const lookup = options.lookup || dns.lookup;
  const fetchImpl = options.fetchImpl || globalThis.fetch;
  const timeoutMs = options.timeoutMs || 10_000;
  const maxBytes = options.maxBytes || WEB_RESPONSE_LIMIT;
  const maxRedirects = options.maxRedirects ?? 3;
  const makeSignal = options.makeSignal || ((milliseconds) => AbortSignal.timeout(milliseconds));

  if (typeof fetchImpl !== 'function') {
    throw new Error('Fetch is not available');
  }

  let url = await validatePublicUrl(value, { lookup });
  let response;

  for (let redirects = 0; ; redirects += 1) {
    response = await fetchImpl(url, {
      redirect: 'manual',
      signal: makeSignal(timeoutMs),
      headers: { 'User-Agent': 'AgentFoundry/1.0' }
    });

    if (!REDIRECT_STATUSES.has(response.status)) break;
    const location = response.headers.get('location');
    if (!location || redirects >= maxRedirects) {
      throw badRequest('Too many redirects');
    }
    url = await validatePublicUrl(new URL(location, url).toString(), { lookup });
  }

  if (!response.ok) {
    throw badRequest(`Remote server returned HTTP ${response.status}`);
  }

  const { text: html, truncated } = await readResponseText(response, maxBytes);
  return { url: url.toString(), html, truncated };
}

module.exports = {
  DOCUMENT_TEXT_LIMIT,
  WEB_RESPONSE_LIMIT,
  analyzeDocument,
  fetchPublicHtml,
  isPrivateAddress,
  readResponseText,
  validatePublicUrl
};
