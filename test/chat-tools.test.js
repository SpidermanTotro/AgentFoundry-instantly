'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const http = require('node:http');
const { Readable } = require('node:stream');

const {
  DOCUMENT_TEXT_LIMIT,
  analyzeDocument,
  createPinnedLookup,
  fetchPublicHtml,
  isPrivateAddress,
  readResponseText,
  requestPinned,
  validatePublicUrl
} = require('../server/chat-tools');

const publicLookup = async () => [{ address: '93.184.216.34', family: 4 }];
const noTimeout = () => undefined;

test('analyzeDocument processes text locally and reports metadata', () => {
  const result = analyzeDocument({
    name: 'notes.txt',
    type: 'text/plain',
    size: 12,
    content: 'hello world'
  });

  assert.equal(result.analysis, 'hello world');
  assert.deepEqual(result.metadata, {
    name: 'notes.txt',
    type: 'text/plain',
    size: 12,
    truncated: false
  });
  assert.equal(result.mode, 'offline');
});

test('analyzeDocument rejects missing or non-string content', () => {
  assert.throws(() => analyzeDocument({}), /Document content is required/);
  assert.throws(() => analyzeDocument({ content: Buffer.from('secret') }), /Document content is required/);
});

test('analyzeDocument caps large text without retaining the tail', () => {
  const marker = 'PRIVATE_TAIL';
  const result = analyzeDocument({ content: `${'a'.repeat(DOCUMENT_TEXT_LIMIT)}${marker}` });

  assert.equal(result.analysis.length, DOCUMENT_TEXT_LIMIT);
  assert.equal(result.analysis.includes(marker), false);
  assert.equal(result.metadata.truncated, true);
});

test('analyzeDocument describes images without echoing their data URL', () => {
  const result = analyzeDocument({
    name: 'photo.png',
    type: 'image/png',
    size: 42,
    content: 'data:image/png;base64,PRIVATE_IMAGE_BYTES'
  });

  assert.match(result.analysis, /OCR is not configured/);
  assert.equal(result.analysis.includes('PRIVATE_IMAGE_BYTES'), false);
  assert.equal(result.metadata.truncated, false);
});

test('isPrivateAddress rejects local, mapped, carrier-grade, and link-local ranges', () => {
  for (const address of [
    '127.0.0.1',
    '10.0.0.1',
    '100.64.0.1',
    '169.254.1.1',
    '172.31.255.255',
    '192.168.1.1',
    '::1',
    'fe80::1',
    'fd00::1',
    '::ffff:127.0.0.1'
  ]) {
    assert.equal(isPrivateAddress(address), true, address);
  }

  assert.equal(isPrivateAddress('8.8.8.8'), false);
  assert.equal(isPrivateAddress('2606:4700:4700::1111'), false);
});

test('validatePublicUrl accepts public HTTP URLs and blocks unsafe forms', async () => {
  const url = await validatePublicUrl('https://example.com/page', { lookup: publicLookup });
  assert.equal(url.toString(), 'https://example.com/page');

  await assert.rejects(
    validatePublicUrl('file:///etc/passwd', { lookup: publicLookup }),
    /Only HTTP and HTTPS/
  );
  await assert.rejects(
    validatePublicUrl('https://user:password@example.com', { lookup: publicLookup }),
    /credentials/
  );
  await assert.rejects(
    validatePublicUrl('http://localhost:3001'),
    /Private and local/
  );
});

test('validatePublicUrl blocks hosts with any private DNS answer', async () => {
  const mixedLookup = async () => [
    { address: '93.184.216.34', family: 4 },
    { address: '10.0.0.7', family: 4 }
  ];

  await assert.rejects(
    validatePublicUrl('https://mixed.example', { lookup: mixedLookup }),
    /Private and local/
  );
});

test('fetchPublicHtml revalidates redirect destinations before following them', async () => {
  let fetchCalls = 0;
  const lookup = async (hostname) => [{
    address: hostname === 'safe.example' ? '93.184.216.34' : '127.0.0.1',
    family: 4
  }];
  const fetchImpl = async () => {
    fetchCalls += 1;
    return new Response(null, {
      status: 302,
      headers: { location: 'http://127.0.0.1/private' }
    });
  };

  await assert.rejects(
    fetchPublicHtml('https://safe.example', { lookup, fetchImpl, makeSignal: noTimeout }),
    /Private and local/
  );
  assert.equal(fetchCalls, 1);
});

test('fetchPublicHtml pins the validated DNS answer for the transport', async () => {
  let resolverCalls = 0;
  let connectedAddress;
  const lookup = async () => {
    resolverCalls += 1;
    return resolverCalls === 1
      ? [{ address: '93.184.216.34', family: 4 }]
      : [{ address: '127.0.0.1', family: 4 }];
  };
  const fetchImpl = async (url, options) => {
    connectedAddress = await new Promise((resolve, reject) => {
      options.lookup(url.hostname, {}, (error, address, family) => {
        if (error) reject(error);
        else resolve({ address, family });
      });
    });
    return new Response('<html><body>safe</body></html>', { status: 200 });
  };

  await fetchPublicHtml('https://example.com', {
    lookup,
    fetchImpl,
    makeSignal: noTimeout
  });

  assert.equal(resolverCalls, 1);
  assert.deepEqual(connectedAddress, { address: '93.184.216.34', family: 4 });
});

test('requestPinned gives the transport only the pinned lookup and original Host', async (t) => {
  const originalRequest = http.request;
  let requestUrl;
  let requestOptions;
  http.request = (url, options, onResponse) => {
    requestUrl = url;
    requestOptions = options;
    const request = new EventEmitter();
    request.end = () => {
      const response = Readable.from([Buffer.from('pinned response')]);
      response.statusCode = 200;
      response.headers = { 'content-length': '15' };
      queueMicrotask(() => onResponse(response));
    };
    return request;
  };
  t.after(() => {
    http.request = originalRequest;
  });

  const response = await requestPinned(new URL('http://safe.example:8080/path'), {
    lookup: createPinnedLookup('93.184.216.34', 4)
  });
  const result = await readResponseText(response, 100);
  const pinned = await new Promise((resolve, reject) => {
    requestOptions.lookup('safe.example', {}, (error, address, family) => {
      if (error) reject(error);
      else resolve({ address, family });
    });
  });

  assert.equal(requestUrl.hostname, 'safe.example');
  assert.equal(requestOptions.headers.Host, 'safe.example:8080');
  assert.deepEqual(pinned, { address: '93.184.216.34', family: 4 });
  assert.equal(result.text, 'pinned response');
  assert.equal(result.truncated, false);
});

test('fetchPublicHtml enforces the redirect limit', async () => {
  let fetchCalls = 0;
  const fetchImpl = async () => {
    fetchCalls += 1;
    return new Response(null, { status: 302, headers: { location: '/again' } });
  };

  await assert.rejects(
    fetchPublicHtml('https://example.com', {
      lookup: publicLookup,
      fetchImpl,
      maxRedirects: 3,
      makeSignal: noTimeout
    }),
    /Too many redirects/
  );
  assert.equal(fetchCalls, 4);
});

test('fetchPublicHtml rejects declared oversized responses', async () => {
  const fetchImpl = async () => new Response('small body', {
    status: 200,
    headers: { 'content-length': '2000001' }
  });

  await assert.rejects(
    fetchPublicHtml('https://example.com', { lookup: publicLookup, fetchImpl, makeSignal: noTimeout }),
    /too large/
  );
});

test('fetchPublicHtml caps streamed responses when content-length is absent', async () => {
  const fetchImpl = async () => new Response('abcdef', { status: 200 });
  const result = await fetchPublicHtml('https://example.com', {
    lookup: publicLookup,
    fetchImpl,
    maxBytes: 5,
    makeSignal: noTimeout
  });

  assert.equal(result.html, 'abcde');
  assert.equal(result.truncated, true);
});

test('fetchPublicHtml caps Node streams without buffering the whole body', async () => {
  const fetchImpl = async () => ({
    status: 200,
    ok: true,
    headers: { get: () => null },
    body: Readable.from([Buffer.from('abc'), Buffer.from('def')])
  });
  const result = await fetchPublicHtml('https://example.com', {
    lookup: publicLookup,
    fetchImpl,
    maxBytes: 5,
    makeSignal: noTimeout
  });

  assert.equal(result.html, 'abcde');
  assert.equal(result.truncated, true);
});

test('fetchPublicHtml fails closed when a response cannot be streamed safely', async () => {
  let textCalled = false;
  const fetchImpl = async () => ({
    status: 200,
    ok: true,
    headers: { get: () => null },
    body: null,
    text: async () => {
      textCalled = true;
      return 'unbounded';
    }
  });

  await assert.rejects(
    fetchPublicHtml('https://example.com', {
      lookup: publicLookup,
      fetchImpl,
      makeSignal: noTimeout
    }),
    /cannot be safely streamed/
  );
  assert.equal(textCalled, false);
});

test('fetchPublicHtml preserves timeout errors for the HTTP route', async () => {
  const timeout = new Error('The operation timed out');
  timeout.name = 'TimeoutError';

  await assert.rejects(
    fetchPublicHtml('https://example.com', {
      lookup: publicLookup,
      fetchImpl: async () => { throw timeout; },
      makeSignal: noTimeout
    }),
    (error) => error.name === 'TimeoutError'
  );
});
