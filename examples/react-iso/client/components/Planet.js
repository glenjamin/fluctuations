var React = require('react');

var Planet = React.createClass({
  propTypes: {
    planets: React.PropTypes.object,
    routing: React.PropTypes.object
  },
  statics: {
    fetchData(params) {
      return { planet: params.id };
    }
  },
  render() {
    var {planets, routing} = this.props;
    var id = routing.params.id;
    var planet = planets.planet[id] || {};
    return (
      <div>
        <h1>{planet.name}</h1>
        <dl>
          <dt>Diameter</dt>
          <dd>{planet.diameter}</dd>
          <dt>Climate</dt>
          <dd>{planet.climate}</dd>
          <dt>Gravity</dt>
          <dd>{planet.gravity}</dd>
          <dt>Terrain</dt>
          <dd>{planet.terrain}</dd>
          <dt>Population</dt>
          <dd>{planet.population}</dd>
        </dl>
      </div>
    );
  }
});

module.exports = Planet;
