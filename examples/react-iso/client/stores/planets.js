var flux = require('fluctuations');
var merge = require('deep-extend');

var swapi = require('../swapi');

var handlers = exports.handlers = {};

handlers.planets = (query, emit, callback) => {
  if (query !== 'all') {
    return callback();
  }
  var planets = [];
  swapi({ pathname: 'planets/' }, appendResults);
  function appendResults(err, res, body) {
    if (err) {
      emit("PLANETS_ERROR", err);
      return callback();
    }
    planets = planets.concat(body.results);
    emit("PLANETS_DATA", {planets, more: body.next});
    if (body.next) {
      swapi({ uri: body.next }, appendResults);
    }
    callback();
    callback = () => 0;
  }
};
handlers.planet = (id, emit, callback) => {
  swapi({ pathname: 'planets/' + id + '/' }, (err, res, body) => {
    if (err) {
      emit("PLANET_ERROR", {id, err});
      return callback();
    }
    emit("PLANET_DATA", {id, planet: body});
    return callback();
  });
};

exports.store = flux.createStore(
  () => ({
    planets: [],
    morePlanets: false,
    planet: {}
  }),
  {
    PLANETS_DATA(state, {planets, more}) {
      state.planets = planets.map(formatPlanet);
      state.morePlanets = more;
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
