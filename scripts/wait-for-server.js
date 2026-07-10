const http = require("node:http");
const https = require("node:https");

const target = new URL(process.argv[2] || "http://localhost:3001");
const timeoutMs = Number(process.env.WAIT_FOR_SERVER_TIMEOUT_MS || 60_000);
const intervalMs = 500;
const startedAt = Date.now();
const client = target.protocol === "https:" ? https : http;

function check() {
  const request = client.get(target, (response) => {
    response.resume();
    if (response.statusCode && response.statusCode < 500) {
      process.stdout.write(`Server ready at ${target}\n`);
      process.exit(0);
    }
    retry();
  });

  request.setTimeout(2_000, () => request.destroy());
  request.on("error", retry);
}

function retry() {
  if (Date.now() - startedAt >= timeoutMs) {
    process.stderr.write(`Timed out waiting for ${target}\n`);
    process.exit(1);
  }
  setTimeout(check, intervalMs);
}

check();
