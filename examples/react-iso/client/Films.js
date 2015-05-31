var React = require('react');

var Films = React.createClass({
  propTypes: {
    swapi: React.PropTypes.object
  },
  statics: {
    fetchData() {
      return { films: 'all' };
    }
  },
  render() {
    var {swapi} = this.props;
    return (
      <div>
        <h1>Films</h1>
        <ul>
          {swapi.films.map(this.renderFilm)}
        </ul>
      </div>
    );
  },
  renderFilm(film) {
    return (
      <li key={film.id}>
        <a href={"/films/" + film.id}>
          {film.title}
        </a>
      </li>
    );
  }
});

module.exports = Films;
