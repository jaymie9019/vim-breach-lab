import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const rootDir = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)));
const port = Number(process.env.PORT || 4173);
const host = "127.0.0.1";

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8"
};

function resolvePath(requestUrl) {
  const parsed = new URL(requestUrl, "http://localhost");
  const rawPath = parsed.pathname === "/" ? "/index.html" : parsed.pathname;
  const fullPath = path.resolve(rootDir, `.${rawPath}`);

  if (!fullPath.startsWith(rootDir)) {
    return null;
  }

  return fullPath;
}

http
  .createServer((request, response) => {
    const filePath = resolvePath(request.url || "/");

    if (!filePath) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    fs.readFile(filePath, (error, buffer) => {
      if (error) {
        response.writeHead(error.code === "ENOENT" ? 404 : 500);
        response.end(error.code === "ENOENT" ? "Not found" : "Server error");
        return;
      }

      const extension = path.extname(filePath);
      response.writeHead(200, {
        "Content-Type": mimeTypes[extension] || "application/octet-stream"
      });
      response.end(buffer);
    });
  })
  .listen(port, host, () => {
    console.log(`vim-game running at http://${host}:${port}`);
  });
