var fluctuations = require('../..');

function copy(a, b) {
  var ret = {};
  function add(k) { ret[k] = this[k]; }
  Object.keys(a).forEach(add, a);
  Object.keys(b).forEach(add, b);
  return ret;
}

var store = fluctuations.createStore(
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

var interceptor = fluctuations.createInterceptor({
  SLOW_INC: function(emit, payload) {
    emit("INC_WAIT");
    setTimeout(function() {
      emit("INC_DONE");
    }, payload.delay || 1000);
  }
});

var flux = fluctuations.createDispatcher();

flux.addInterceptor('n', interceptor);
flux.addStore('n', store);

flux.listen("logging", function() {
  var stores = flux.get();
  console.log("%d%s",
    stores.n.number,
    stores.n.pending > 0 ? ' (pending)' : '');
});

module.exports = flux.dispatch;
