var React = require('react');

var Planets = React.createClass({
  statics: {
    fetchData() {
      return { planets: 'all' };
    }
  },
  render() {
    return <h1>Planets</h1>;
  },
});

module.exports = Planets;
