var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

var compiler = webpack(config);

compiler.plugin("compile", function() {
  console.log("webpack building...");
});
compiler.plugin("done", function(stats) {
  stats = stats.toJson();
  console.log("webpack built %s in %dms", stats.hash, stats.time);
});

var server = new WebpackDevServer(compiler, {
  publicPath: config.output.publicPath,
  hot: true,
  noInfo: true,
  historyApiFallback: true
});

server.listen(3000, 'localhost', function(err) {
  if (err) throw err;

  var addr = server.listeningApp.address();

  console.log('Listening at http://%s:%d', addr.address, addr.port);
});
