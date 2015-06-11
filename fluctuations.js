var debug = require('debug')('fluctuations');
var verbose = require('debug')('fluctuations:verbose');

exports.createDispatcher = createDispatcher;

exports.createStore = createStore;
exports.createInterceptor = createInterceptor;

function createDispatcher(options) {

  options = options || {};

  var state = options.state || {};
  var stores = {};
  var interceptors = {};
  var listeners = {};

  function addInterceptor(key, interceptor) {
    interceptors[key] = interceptor;
  }
  function addStore(key, store) {
    stores[key] = store;
    state[key] = key in state ?
      store.merge(store.initial(), state[key]) : store.initial();
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
    dispatchToStores.state = get();
    each(interceptors, function(interceptor, key) {
      if (interceptor.handlers[action]) {
        debug("Intercepted %s with interceptor '%s'", action, key);
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
        debug("Dispatching %s to store '%s'", action, key);
        verbose("State in: %j", state[key]);
        state[key] = store.handlers[action](state[key], payload);
        verbose("State out: %j", state[key]);
        handled = true;
      }
    });

    if (handled) {
      notify();
    } else {
      console.warn("Unknown action: %s", action, payload);
    }
  }
  // Alternative interceptor API
  dispatchToStores.redispatch = dispatch;
  dispatchToStores.dispatch = dispatchToStores;
  dispatchToStores.state = get();

  function notify() {
    debug('Notifying all listeners');
    each(listeners, function(listener) {
      listener();
    });
  }

  function get() {
    return state;
  }

  return {
    addInterceptor: addInterceptor,
    addStore: addStore,

    dispatch: dispatch,

    listen: listen,
    get: get
  };

}

function createStore(initial, handlers, merge) {
  return {
    initial: initial,
    handlers: handlers,
    merge: merge || overwrite
  };
}

function createInterceptor(handlers) {
  return {
    handlers: handlers
  };
}

function overwrite(state, newState) {
  return newState;
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
