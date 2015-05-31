/*global history*/

var flux = require('flux-redux');
var merge = require('deep-extend');

var data = require('../data');

var routes = require('../routes');

function route(dispatch, path, {skipFetch} = {}) {
  var match = routes.match(path);
  if (!match) {
    return dispatch("404");
  }
  var {params, fn: component} = match;
  if (!component.fetchData || skipFetch) {
    dispatchRoute();
  } else {
    dispatch("ROUTE_LOADING", path);
    data.fetch(
      component.fetchData(params),
      dispatch,
      dispatchRoute
    );
  }
  function dispatchRoute() {
    dispatch("ROUTE", { path, params, component});
  }
}

exports.interceptor = flux.createInterceptor({
  OPEN_URL(dispatch, path) {
    route(dispatch, path);
    history.pushState({}, '', path);
  },
  SET_URL(dispatch, path) {
    route(dispatch, path);
  },
  INIT_URL(dispatch, path) {
    route(dispatch, path, {skipFetch: true});
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
