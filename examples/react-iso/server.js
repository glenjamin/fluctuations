require('babel/register');

var express = require('express');

var app = express();

var webpack = require('webpack');
var config = require('./webpack.config');
var compiler = webpack(config);
app.use(require("webpack-dev-middleware")(compiler, {
  noInfo: true, publicPath: config.output.publicPath
}));
app.use(require("webpack-hot-middleware")(compiler));

var serverRender = require('./server-render');
app.get('*', function(req, res, next) {
  serverRender(req.path, function(err, page) {
    if (err) return next(err);
    res.send(page);
  });
});

var http = require('http');
var server = http.createServer(app);
server.listen(3000, 'localhost', function(err) {
  if (err) throw err;

  var addr = server.address();

  console.log('Listening at http://%s:%d', addr.address, addr.port);
});
