const http = require("http");
const express = require("express");
const devServer = require("./dev-server");
const optionsFromArgs = require("./cli-options");

module.exports = async function(cwd, args) {
  const { rootPath, port } = optionsFromArgs(cwd, args);

  if (typeof port !== "number") {
    throw new Error("Port must be a number.");
  }

  const httpServer = http.createServer();
  const middleware = devServer(rootPath, { httpServer });

  const app = express();
  app.use(middleware);
  httpServer.on("request", app);

  httpServer.listen(port);
};
