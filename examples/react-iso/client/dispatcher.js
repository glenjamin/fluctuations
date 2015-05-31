var flux = require('flux-redux');

/**
 * Hot reloading stores!
 *
 * The trick is to always re-use the `dispatcher` instance
 *
 * dispatcher.addStore will use the stores' merge functions
 * when re-adding another store with the same key
 */
var dispatcher = flux.createDispatcher();
if (module.hot) {
  if (module.hot.data) {
    dispatcher = module.hot.data.dispatcher;
  }
  module.hot.accept();
  module.hot.dispose(hot => hot.dispatcher = dispatcher);
}
// Server data hydration - this should be in the core lib
/*global initialStoreData*/
if (typeof initialStoreData == 'object') {
  Object.keys(initialStoreData).forEach(k => {
    dispatcher.addStore(k, {initial: () => initialStoreData[k]});
    delete initialStoreData[k];
  });
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
