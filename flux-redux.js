var debug = require('debug')('flux-redux');
var verbose = require('debug')('flux-redux:verbose');

exports.createDispatcher = createDispatcher;

exports.createStore = createStore;
exports.createInterceptor = createInterceptor;

function createDispatcher() {

  var state = {};
  var stores = {};
  var interceptors = {};
  var listeners = {};

  return {
    addInterceptor: addInterceptor,
    addStore: addStore,

    dispatch: dispatch,

    listen: listen
  };

  function addInterceptor(key, interceptor) {
    interceptors[key] = interceptor;
  }
  function addStore(key, store) {
    stores[key] = store;
    state[key] = store.initial();
  }

  function listen(key, listener) {
    listeners[key] = listener;
  }

  function dispatch(action, payload) {
    payload = typeof payload !== 'undefined' ? payload : {};
    if (!dispatchToInterceptors(action, payload)) {
      dispatchToStores(action, payload);
    }
  }

  function dispatchToInterceptors(action, payload) {
    debug("Dispatching %s to interceptors", action);
    var intercepted = false;
    each(interceptors, function(interceptor, key) {
      if (interceptor.handlers[action]) {
        debug("Intercepted %s with interceptor %s", action, key);
        interceptor.handlers[action](dispatchToStores, payload);
        intercepted = true;
        return 'break';
      }
    });
    return intercepted;
  }

  function dispatchToStores(action, payload) {
    debug("Dispatching %s to stores", action);

    var handled = false;
    each(stores, function(store, key) {
      if (store.handlers[action]) {
        debug("Dispatching %s to store %s", action, key);
        verbose("State in: %j", state[key]);
        state[key] = store.handlers[action](state[key], payload);
        verbose("State out: %j", state[key]);
        handled = true;
      }
    });

    if (handled) {
      notify();
    } else {
      console.warn("Unknown action: %s", action);
    }
  }

  function notify() {
    debug('Notifying all listeners');
    each(listeners, function(listener) {
      listener(state);
    });
  }

}

function createStore(initial, handlers) {
  return {
    initial: initial,
    handlers: handlers
  };
}

function createInterceptor(handlers) {
  return {
    handlers: handlers
  };
}


/**
 * Call fn for each item in obj.
 * Stops iterating if fn returns the string "break"
 *
 * @param  {object}   obj
 * @param  {Function} fn(value, key)
 * @return void
 */
function each(obj, fn) {
  Object.keys(obj).some(function(k) {
    if (fn(obj[k], k) === 'break') {
      return true;
    }
  });
}
