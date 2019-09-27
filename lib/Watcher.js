const chokidar = require("chokidar");
const { EventEmitter } = require("events");
const path = require("path");

class Watcher extends EventEmitter {
  constructor({ rootPath } = {}) {
    super();
    this.watcher = null;
    this.rootPath = rootPath;

    this.watchedPaths = new Set();
  }

  watch(assetWebPath) {
    const filePath = path.resolve(
      this.rootPath,
      assetWebPath.replace(/^\//, "")
    );

    this.watchedPaths.add(filePath);
  }

  startWatching() {
    if (this.watcher !== null) {
      return;
    }

    return new Promise(resolve => {
      const watcher = chokidar.watch(this.rootPath, {
        ignored: /(^|[/\\])\../,
        persistent: true
      });

      watcher
        .on("ready", () => resolve())
        .on("change", fsPath => this.notifyClientForFsPath(fsPath))
        .on("unlink", fsPath => {
          this.watchedPaths.delete(fsPath);
          this.notifyClientForFsPath(fsPath);
        });

      this.watcher = watcher;
    });
  }

  stopWatching() {
    if (this.watcher === null) {
      return;
    }

    this.watcher.close();
    this.watcher = null;
  }

  notifyClientForFsPath(filePath) {
    if (this.watchedPaths.has(filePath)) {
      this.emit("change");
    }
  }
}

module.exports = Watcher;
