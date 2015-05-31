var React = require('react');

var Application = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func,
    stores: React.PropTypes.object
  },
  captureLinks(event) {
    var a = findAnchor(event.target);
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href) return;
    event.preventDefault();
    this.props.dispatch("OPEN_URL", href);
  },
  render() {
    var {dispatch, stores} = this.props;
    var Component = stores.routing.component || 'hr';
    return (
      <div onClick={this.captureLinks}>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/films">Films</a></li>
          <li><a href="/planets">Planets</a></li>
        </ul>
        {stores.routing.loading && "L O A D I N G"}
        <Component
          dispatch={dispatch}
          {...stores} />
      </div>
    );
  },
});

function findAnchor(node) {
  while (node.nodeName.toLowerCase() != 'a') {
    if (!node.parentNode) return false;
    node = node.parentNode;
  }
  return node;
}

module.exports = Application;
