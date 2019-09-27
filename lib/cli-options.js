const path = require("path");

module.exports = function optionsFromArgs(cwd, args) {
  const config = {
    rootPath: null,
    port: 5000
  };

  let nextIsPort = false;

  for (const arg of args) {
    if (nextIsPort) {
      config.port = arg;
      nextIsPort = false;
      continue;
    } else if (arg === "--port") {
      nextIsPort = true;
      continue;
    } else {
      config.rootPath = arg;
    }
  }

  if (typeof config.port !== "number" && /^\d+$/.test(config.port)) {
    config.port = parseInt(config.port, 10);
  }

  if (typeof config.rootPath === "string") {
    config.rootPath = path.resolve(cwd, config.rootPath);
  }

  return config;
};
