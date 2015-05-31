var flux = require('flux-redux');

/**
 * Hot reloading stores!
 *
 * The trick is to always re-use the `dispatcher` instance
 *
 * dispatcher.addStore will use the stores' merge functions
 * when re-adding another store with the same key
 */
var dispatcher;
if (module.hot) {
  if (module.hot.data) {
    dispatcher = module.hot.data.dispatcher;
  } else {
    dispatcher = flux.createDispatcher();
  }
  module.hot.accept();
  module.hot.dispose(hot => hot.dispatcher = dispatcher);
}

var data = require('./data');

var routing = require('./routing');

dispatcher.addInterceptor('routing', routing.interceptor);
dispatcher.addStore('routing', routing.store);

var swapi = require('./swapi');

data.addHandlers(swapi.handlers);
dispatcher.addStore('swapi', swapi.store);

module.exports = dispatcher;
