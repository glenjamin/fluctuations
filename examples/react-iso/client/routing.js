/*global history*/

var flux = require('flux-redux');
var merge = require('deep-extend');

var data = require('./data');

var routes = require('routes/index')();
routes.addRoute("/", require('./Home'));
routes.addRoute("/films", require('./Films'));
routes.addRoute("/films/:id", require('./Film'));
routes.addRoute("/planets", require('./Planets'));
routes.addRoute("*", require('./Error404'));

function route(dispatch, path) {
  var match = routes.match(path);
  if (!match) {
    return dispatch("404");
  }
  dispatch("ROUTE_LOADING", path);
  var {params, fn: component} = match;
  if (!component.fetchData) {
    dispatchRoute();
  } else {
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
      if (path != state.loading) {
        return state;
      }
      state.loading = false;
      state.path = path;
      state.params = params;
      state.component = component;
      return state;
    }
  },
  merge
);
