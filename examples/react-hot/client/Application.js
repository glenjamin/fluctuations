var React = require('react');

var Application = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func,
    stores: React.PropTypes.object
  },
  render() {
    var {swapi} = this.props.stores;
    var {films = []} = swapi;
    return (
      <div>
        <button onClick={() =>
          this.props.dispatch("FETCH", "films")
        }>
          Load
        </button>
        {swapi.loading && "Loading..."}
        <div>
          {films.map(this.renderFilm)}
        </div>
      </div>
    );
  },
  renderFilm({id, name}) {
    return <h3 key={id}>{name}</h3>;
  }
});

module.exports = Application;
