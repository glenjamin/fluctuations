var flux = require('flux-redux');

/**
 * To take over from server rendering, we must re-use the data that the
 * server used, by passing it into the dispatcher init
 */
/*global initialStoreData*/
var state = typeof initialStoreData == 'object' ? initialStoreData : {};

var dispatcher = flux.createDispatcher({state});

/**
 * Hot reloading stores!
 *
 * The trick is to always re-use the `dispatcher` instance
 *
 * dispatcher.addStore will use the stores' merge functions
 * when re-adding another store with the same key
 */
if (module.hot) {
  if (module.hot.data) {
    dispatcher = module.hot.data.dispatcher;
  }
  module.hot.accept();
  module.hot.dispose(hot => hot.dispatcher = dispatcher);
}


var data = require('./data');

var routing = require('./stores/routing');
dispatcher.addInterceptor('routing', routing.interceptor);
dispatcher.addStore('routing', routing.store);

var films = require('./stores/films');
data.addHandlers(films.handlers);
dispatcher.addStore('films', films.store);

var planets = require('./stores/planets');
data.addHandlers(planets.handlers);
dispatcher.addStore('planets', planets.store);

module.exports = dispatcher;
