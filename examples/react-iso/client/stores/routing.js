/*global history*/

var flux = require('fluctuations');
var merge = require('deep-extend');

var data = require('../data');

var routes = require('../routes');

function route(emit, path, {skipFetch} = {}) {
  var match = routes.match(path);
  if (!match) {
    return emit("404");
  }
  var {params, fn: component} = match;
  if (!component.fetchData || skipFetch) {
    emitRoute();
  } else {
    emit("ROUTE_LOADING", path);
    data.fetch(
      component.fetchData(params),
      emit,
      emitRoute
    );
  }
  function emitRoute() {
    emit("ROUTE", { path, params, component});
  }
}

exports.interceptor = flux.createInterceptor({
  OPEN_URL(emit, path) {
    route(emit, path);
    history.pushState({}, '', path);
  },
  SET_URL(emit, path) {
    route(emit, path);
  },
  INIT_URL(emit, path) {
    route(emit, path, {skipFetch: true});
  }
});

exports.store = flux.createStore(
  () => ({
    loading: false,
    path: null,
    params: null,
    component: null
  }),
  {
    ROUTE_LOADING(state, path) {
      state.loading = path;
      return state;
    },
    ROUTE(state, {path, params, component}) {
      state.loading = false;
      state.path = path;
      state.params = params;
      state.component = component;
      return state;
    }
  },
  merge
);
