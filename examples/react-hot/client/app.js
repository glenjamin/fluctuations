/*eslint-env browser*/

var React = require('react');

var Application = require('./Application');

var dispatcher = require('./dispatcher');

dispatcher.listen('react', render);

render();

function render() {
  React.render(
    <Application
      stores={dispatcher.get()}
      dispatch={dispatcher.dispatch}
    />,
    document.getElementById('root')
  );
}

if (module.hot) {
  module.hot.accept();
}
