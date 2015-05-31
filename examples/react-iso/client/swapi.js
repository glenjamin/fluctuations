var request = require('browser-request');

var swapiBaseUrl = 'http://swapi.co/api/';
var swapiRequest = request.defaults({ json: true });
function swapi(options, ...args) {
  options.uri = swapiBaseUrl + options.pathname;
  return swapiRequest(options, ...args);
}

module.exports = swapi;
