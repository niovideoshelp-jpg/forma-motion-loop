const http = require("http"),
  fs = require("fs"),
  path = require("path");
const root = path.resolve("public");
const port = Number(process.argv[2]) || 4173;
http
  .createServer((req, res) => {
    const p = path.resolve(
      root,
      "." +
        decodeURIComponent(
          req.url.split("?")[0] === "/"
            ? "/preview.html"
            : req.url.split("?")[0],
        ),
    );
    if (!p.startsWith(root + path.sep)) {
      res.writeHead(403).end();
      return;
    }
    fs.readFile(p, (e, data) => {
      if (e) {
        res.writeHead(404).end();
        return;
      }
      res.setHeader(
        "Content-Type",
        {
          ".html": "text/html",
          ".js": "text/javascript",
          ".png": "image/png",
          ".svg": "image/svg+xml",
          ".woff2": "font/woff2",
          ".wav": "audio/wav",
        }[path.extname(p)] || "application/octet-stream",
      );
      res.end(data);
    });
  })
  .listen(port, "127.0.0.1", () =>
    console.log(`http://127.0.0.1:${port}/preview.html`),
  );
