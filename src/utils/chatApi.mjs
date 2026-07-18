/** Send a JSON request and preserve the chat API's safe response contract. */
async function requestJson(path, payload, fallbackMessage, fetchImpl = globalThis.fetch) {
  let response;
  try {
    response = await fetchImpl(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch {
    throw new Error(fallbackMessage);
  }

  let data = {};
  try {
    data = await response.json();
  } catch {
    if (response.ok) throw new Error('The server returned an invalid response');
  }

  if (!response.ok || data.success === false) {
    throw new Error(data.error || fallbackMessage);
  }
  return data.success === true && Object.hasOwn(data, 'data') ? data.data : data;
}

export function processDocumentRequest(file, content, fetchImpl) {
  return requestJson('/api/process-document', {
    name: file.name,
    type: file.type,
    size: file.size,
    content
  }, 'Document processing failed', fetchImpl);
}

export function crawlUrl(url, fetchImpl) {
  return requestJson('/api/crawl', { url }, 'Web crawl failed', fetchImpl);
}

export function executeCodeRequest(code, fetchImpl) {
  return requestJson('/api/chatgpt2/execute', { code }, 'Code execution is unavailable', fetchImpl);
}

export { requestJson };
