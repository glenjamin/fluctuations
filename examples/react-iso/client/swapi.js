var request = require('request');

var swapiBaseUrl = 'http://swapi.co/api/';
var swapiRequest = request.defaults({ json: true });
function swapi(options, ...args) {
  if (options.pathname) {
    options.uri = swapiBaseUrl + options.pathname;
  }
  return swapiRequest(options, ...args);
}

module.exports = swapi;
