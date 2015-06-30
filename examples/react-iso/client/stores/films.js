var flux = require('fluctuations');
var merge = require('deep-extend');

var swapi = require('../swapi');

var handlers = exports.handlers = {};

handlers.films = (query, emit, callback) => {
  if (query === 'all') {
    swapi({ pathname: 'films/' }, (err, res, body) => {
      if (err) {
        emit("FILMS_ERROR", err);
        return callback();
      }
      emit("FILMS_DATA", body);
      return callback();
    });
  } else {
    return callback();
  }
};
handlers.film = (id, emit, callback) => {
  swapi({ pathname: 'films/' + id + '/' }, (err, res, body) => {
    if (err) {
      emit("FILM_ERROR", {id, err});
      return callback();
    }
    emit("FILM_DATA", {id, film: body});
    return callback();
  });
};

exports.store = flux.createStore(
  () => ({
    films: [],
    film: {}
  }),
  {
    FILMS_DATA(state, films) {
      state.films = films.results.map(formatFilm);
      return state;
    },
    FILM_DATA(state, {id, film}) {
      state.film[id] = formatFilm(film);
      return state;
    }
  },
  merge
);

function formatFilm(rawFilm) {
  return {
    id: rawFilm.url.match(/(\d+)\/$/)[1],
    episode: rawFilm.episode_id,
    title: rawFilm.title,
    intro: rawFilm.opening_crawl
  };
}
