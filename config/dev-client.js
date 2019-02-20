/* eslint-disable */
require("eventsource-polyfill");
var hotClient = require("webpack-hot-middleware/client?overlay=false&noInfo=true&reload=true");

hotClient.subscribe(function(event) {
  if (event.action === "reload") {
    window.location.reload();
  }
});
