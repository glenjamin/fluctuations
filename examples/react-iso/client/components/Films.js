var React = require('react');

var Films = React.createClass({
  propTypes: {
    films: React.PropTypes.object
  },
  statics: {
    fetchData() {
      return { films: 'all' };
    }
  },
  render() {
    var {films} = this.props;
    return (
      <div>
        <h1>Films</h1>
        <ul>
          {films.films.map(this.renderFilm)}
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
