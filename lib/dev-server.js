const fs = require("fs");
const path = require("path");
const watchStreamAndInjectClient = require("./inject-client");
const serveStatic = require("serve-static");

const WebSocketServer = require("ws").Server;
const Watcher = require("./Watcher");

const socketteClientCode = fs.readFileSync(
  require.resolve("sockette").replace("sockette.js", "sockette.min.js"),
  "utf-8"
);
const clientCode = fs.readFileSync(
  path.resolve(__dirname, "./frontend/client.js"),
  "utf-8"
);

const clientCodeMd5Hex = require("crypto")
  .createHash("md5")
  .update(clientCode, "utf-8")
  .digest("hex");

function isFile(filePath) {
  try {
    const stat = fs.statSync(filePath);
    if (!stat.isFile) {
      throw new Error("invalid");
    }
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = function devServer(rootPath, { httpServer } = {}) {
  const serveMiddleware = serveStatic(rootPath);
  const watcher = new Watcher({ rootPath });
  const webSocketServer = new WebSocketServer({
    server: httpServer,
    path: "/__dev-server"
  });

  webSocketServer.on("connection", connection => {
    const onReload = () => connection.send("reload");
    watcher.on("change", onReload);

    connection.on("close", () => {
      watcher.removeListener("change", onReload);
    });
  });

  watcher.startWatching();

  return function(req, res, next) {
    if (req.url === "/__dev-server/sockette.js") {
      res.set({ "Content-Type": "text/javascript" });
      return res.send(socketteClientCode);
    } else if (req.url === "/__dev-server/client.js") {
      res.set({
        "Content-Type": "text/javascript",
        ETag: `"${clientCodeMd5Hex}"`
      });

      if (req.stale) {
        return res.send(clientCode);
      } else {
        return res.sendStatus(304);
      }
    }

    let assetPath = req.url;

    // handle a root level index.html file
    if (assetPath === "/" && isFile(path.join(rootPath, "index.html"))) {
      assetPath = "/index.html";
    } else if (
      /\/$/.test(assetPath) &&
      isFile(path.join(rootPath, assetPath, "index.html"))
    ) {
      assetPath = path.resolve(assetPath, "index.html");
    }

    if (/\.html$/.test(assetPath)) {
      const fileStream = fs.createReadStream(path.join(rootPath, assetPath));
      watchStreamAndInjectClient(fileStream, res);
    } else {
      serveMiddleware(req, res, next);
    }

    watcher.watch(assetPath);
  };
};
