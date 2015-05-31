var flux = require('flux-redux');
var merge = require('deep-extend');

var swapi = require('../swapi');

var handlers = exports.handlers = {};

handlers.planets = (query, dispatch, callback) => {
  if (query === 'all') {
    swapi({ pathname: 'planets/' }, (err, res, body) => {
      if (err) {
        dispatch("PLANETS_ERROR", err);
        return callback();
      }
      dispatch("PLANETS_DATA", body);
      return callback();
    });
  } else {
    return callback();
  }
};
handlers.planet = (id, dispatch, callback) => {
  swapi({ pathname: 'planets/' + id + '/' }, (err, res, body) => {
    if (err) {
      dispatch("PLANET_ERROR", {id, err});
      return callback();
    }
    dispatch("PLANET_DATA", {id, planet: body});
    return callback();
  });
};

exports.store = flux.createStore(
  () => ({
    planets: [],
    planet: {}
  }),
  {
    PLANETS_DATA(state, planets) {
      state.planets = planets.results.map(formatPlanet);
      return state;
    },
    PLANET_DATA(state, {id, planet}) {
      state.planet[id] = formatPlanet(planet);
      return state;
    }
  },
  merge
);

function formatPlanet(rawPlanet) {
  return {
    id: rawPlanet.url.match(/(\d+)\/$/)[1],
    name: rawPlanet.name,
    diameter: rawPlanet.diameter,
    climate: rawPlanet.climate,
    gravity: rawPlanet.gravity,
    terrain: rawPlanet.terrain,
    population: rawPlanet.population
  };
}
