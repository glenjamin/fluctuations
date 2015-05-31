/*eslint-env browser*/

var React = require('react');

var Application = require('./components/Application');

var dispatcher = require('./dispatcher');
window.dev = {dispatcher, debug: require('debug')};

dispatcher.listen('react', render);
function render() {
  React.render(
    <Application
      stores={dispatcher.get()}
      dispatch={dispatcher.dispatch}
    />,
    document.getElementById('root')
  );
}

window.addEventListener('popstate', setUrlFromLocation);
function setUrlFromLocation() {
  dispatcher.dispatch("SET_URL", window.location.pathname);
}

dispatcher.dispatch("INIT_URL", window.location.pathname);


if (module.hot) {
  module.hot.accept();
}
