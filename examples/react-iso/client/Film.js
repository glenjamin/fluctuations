var React = require('react');

var Films = React.createClass({
  propTypes: {
    swapi: React.PropTypes.object,
    routing: React.PropTypes.object
  },
  statics: {
    fetchData(params) {
      return { film: params.id };
    }
  },
  render() {
    var {swapi, routing} = this.props;
    var id = routing.params.id;
    var film = swapi.film[id] || {};
    return (
      <div>
        <h1>{film.title}</h1>
        <p>{film.intro}</p>
      </div>
    );
  }
});

module.exports = Films;
