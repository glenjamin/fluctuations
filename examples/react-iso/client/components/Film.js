var React = require('react');

var Film = React.createClass({
  propTypes: {
    films: React.PropTypes.object,
    routing: React.PropTypes.object
  },
  statics: {
    fetchData(params) {
      return { film: params.id };
    }
  },
  render() {
    var {films, routing} = this.props;
    var id = routing.params.id;
    var film = films.film[id] || {};
    return (
      <div>
        <h1>{film.title}</h1>
        <p>{film.intro}</p>
      </div>
    );
  }
});

module.exports = Film;
