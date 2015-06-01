var flux = require('fluctuations');

var merge = require('deep-extend');
var request = require('browser-request');

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
  module.hot.dispose((data) => data.dispatcher = dispatcher);
}

dispatcher.addInterceptor('swapi', flux.createInterceptor({
  FETCH(dispatch, type) {
    dispatch("LOADING");
    var options = {
      uri: "http://swapi.co/api/" + encodeURIComponent(type),
      json: true
    };
    request(options, (err, res, body) => {
      if (err) {
        return dispatch("ERROR", err);
      }
      dispatch("DATA_" + type.toUpperCase(), { data: body });
    });
  }
}));

var initial = () => ({ loading: false });
dispatcher.addStore('swapi', flux.createStore(
  initial,
  {
    LOADING() {
      var state = initial();
      state.loading = true;
      return state;
    },
    DATA_FILMS(state, { data }) {
      state.loading = false;
      state.films = data.results.map(x => (
        { id: x.episode_id, name: x.title }
      ));
      return state;
    }
  },
  merge
));

module.exports = dispatcher;
