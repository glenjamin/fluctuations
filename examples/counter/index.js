var redux = require('../..');

function copy(a, b) {
  var ret = {};
  function add(k, v) { ret[k] = v; }
  Object.keys(a).forEach(add);
  Object.keys(b).forEach(add);
  return ret;
}

var store = redux.createStore(
  function() {
    return { number: 0, pending: 0 };
  },
  {
    INC_WAIT: function(state) {
      return copy(state, { pending: state.pending + 1 });
    },
    INC_DONE: function(state) {
      return copy(state, {
        number: state.number + 1,
        pending: state.pending - 1
      });
    },
    INC: function(state) {
      return copy(state, { number: state.number + 1 });
    }
  }
);

var interceptor = redux.createInterceptor({
  SLOW_INC: function(dispatch, payload) {
    dispatch("INC_WAIT");
    setTimeout(function() {
      dispatch("INC_DONE");
    }, payload.delay || 1000);
  }
});

var flux = redux.dispatcher();

flux.intercept(interceptor);
flux.register('n', store);

flux.listen(function(stores) {
  console.log("%d%s", stores.n.number, stores.n.pending ? ' (pending)' : '');
});

module.exports = flux.dispatch;
