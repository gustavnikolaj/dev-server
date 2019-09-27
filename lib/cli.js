// const devServer = require("./dev-server");
const optionsFromArgs = require("./cli-options");

module.exports = async function(cwd, args) {
  const { rootPath, port } = optionsFromArgs(cwd, args);

  if (typeof port !== "number") {
    throw new Error("Port must be a number.");
  }

  console.log("starting dev-server", { port, rootPath });

  // const middleware = devServer(rootPath, { httpServer });
};
