const expect = require("unexpected");
const devServer = require("../lib/dev-server");

describe("dev-server", () => {
  it("should be a function", () => {
    expect(devServer, "to be a function");
  });
});
