async function requestJson(path, payload, fallbackMessage, fetchImpl = globalThis.fetch) {
  const response = await fetchImpl(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    if (response.ok) throw new Error('The server returned an invalid response');
  }

  if (!response.ok) {
    throw new Error(data.error || fallbackMessage);
  }
  return data;
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
