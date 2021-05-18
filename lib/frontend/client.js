/* eslint-disable prefer-template */
(function() {
  "use strict";

  window.liveStyle = {
    reload: function() {
      window.location.reload();
    }
  };

  var Sockette = window.sockette;
  const ws = new Sockette("ws://" + window.location.host + "/__dev-server", {
    timeout: 500,
    onmessage: function(msg) {
      if (msg.data === "reload") {
        ws.close();
        window.liveStyle.reload();
      }
    }
  });
})();
