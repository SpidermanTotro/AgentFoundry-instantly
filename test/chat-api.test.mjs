import test from 'node:test';
import assert from 'node:assert/strict';

import {
  crawlUrl,
  executeCodeRequest,
  processDocumentRequest,
  requestJson
} from '../src/utils/chatApi.mjs';

function jsonResponse(data, { ok = true, status = 200 } = {}) {
  return {
    ok,
    status,
    json: async () => data
  };
}

test('processDocumentRequest sends only the expected JSON document fields', async () => {
  let captured;
  const fetchImpl = async (path, options) => {
    captured = { path, options };
    return jsonResponse({ success: true, analysis: 'offline result' });
  };

  const result = await processDocumentRequest({
    name: 'notes.txt',
    type: 'text/plain',
    size: 7,
    ignored: 'not serialized'
  }, 'content', fetchImpl);

  assert.equal(captured.path, '/api/process-document');
  assert.equal(captured.options.method, 'POST');
  assert.equal(captured.options.headers['Content-Type'], 'application/json');
  assert.deepEqual(JSON.parse(captured.options.body), {
    name: 'notes.txt',
    type: 'text/plain',
    size: 7,
    content: 'content'
  });
  assert.equal(result.analysis, 'offline result');
});

test('crawlUrl surfaces the server rejection message', async () => {
  const fetchImpl = async () => jsonResponse({
    success: false,
    error: 'Private and local network addresses are not allowed'
  }, { ok: false, status: 400 });

  await assert.rejects(
    crawlUrl('http://127.0.0.1', fetchImpl),
    /Private and local network addresses are not allowed/
  );
});

test('executeCodeRequest surfaces the secure-sandbox explanation', async () => {
  const fetchImpl = async () => jsonResponse({
    success: false,
    error: 'Code execution is disabled because no secure sandbox is configured'
  }, { ok: false, status: 501 });

  await assert.rejects(
    executeCodeRequest('process.exit()', fetchImpl),
    /no secure sandbox is configured/
  );
});

test('requestJson uses its safe fallback for non-JSON errors', async () => {
  const fetchImpl = async () => ({
    ok: false,
    status: 502,
    json: async () => { throw new SyntaxError('invalid JSON'); }
  });

  await assert.rejects(
    requestJson('/api/test', {}, 'Request failed safely', fetchImpl),
    /Request failed safely/
  );
});
