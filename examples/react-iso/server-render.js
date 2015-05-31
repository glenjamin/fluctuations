var fs = require('fs');

var React = require('react');

var Application = require('./client/components/Application');
var dispatcher = require('./client/dispatcher');

var template = new Promise(function(resolve, reject) {
  fs.readFile(__dirname + '/index.html', 'utf8', function(err, data) {
    if (err) return reject(err);
    return resolve(data);
  });
});

function renderReact(path) {
  return new Promise(function(resolve) {
    dispatcher.listen('routed', function() {
      var stores = dispatcher.get();
      // Wait until app is no longer loading
      if (stores.routing.loading) {
        return false;
      }
      var rendered = React.renderToString(
        React.createElement(Application, {
          stores: dispatcher.get(),
          dispatch: function(){}
        })
      );
      return resolve({rendered, stores});
    });

    dispatcher.dispatch("SET_URL", path);
  });
}

module.exports = function(path, callback) {
  var render = renderReact(path);
  Promise.all([template, render])
    .then(function([tpl, {rendered, stores}]) {
      var page = tpl
        .replace('<!-- CONTENT -->', rendered)
        .replace('"-- STORES --"', JSON.stringify(stores));
      callback(null, page);
    });
};
