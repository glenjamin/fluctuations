var React = require('react');

var Planets = React.createClass({
  propTypes: {
    planets: React.PropTypes.object
  },
  statics: {
    fetchData() {
      return { planets: 'all' };
    }
  },
  render() {
    var {planets} = this.props;
    return (
      <div>
        <h1>Planets</h1>
        <ul>
          {planets.planets.map(this.renderPlanet)}
        </ul>
      </div>
    );
  },
  renderPlanet(planet) {
    return (
      <li key={planet.id}>
        <a href={"/planets/" + planet.id}>
          {planet.name}
        </a>
      </li>
    );
  }
});

module.exports = Planets;
