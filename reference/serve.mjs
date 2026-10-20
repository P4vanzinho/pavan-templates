// Servidor estático mínimo para as réplicas: `node serve.mjs <pasta> [porta]`.
// Imita a hospedagem original: rotas sem barra final redirecionam (307) para `/rota/`,
// diretórios servem `index.html` e caminhos inexistentes respondem 404 com `404.html`.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(process.argv[2] ?? ".");
const port = Number(process.argv[3] ?? 4321);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
};

async function isFile(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

async function send(res, status, path) {
  res.writeHead(status, { "content-type": types[extname(path)] ?? "application/octet-stream" });
  res.end(await readFile(path));
}

createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  const pathname = decodeURIComponent(url.pathname);
  const target = normalize(join(root, pathname));
  if (!target.startsWith(root)) return send(res, 404, join(root, "404.html"));

  if (pathname.endsWith("/")) {
    const index = join(target, "index.html");
    if (await isFile(index)) return send(res, 200, index);
  } else if (await isFile(target)) {
    return send(res, 200, target);
  } else if (await isFile(join(target, "index.html"))) {
    res.writeHead(307, { location: `${url.pathname}/${url.search}` });
    return res.end();
  }

  const notFound = join(root, "404.html");
  if (await isFile(notFound)) return send(res, 404, notFound);
  res.writeHead(404, { "content-type": "text/plain" });
  res.end("Not found");
}).listen(port, () => console.log(`${root} → http://localhost:${port}`));
