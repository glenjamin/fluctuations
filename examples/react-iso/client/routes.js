var routes = require('routes')();
routes.addRoute("/", require('./components/Home'));
routes.addRoute("/films", require('./components/Films'));
routes.addRoute("/films/:id", require('./components/Film'));
routes.addRoute("/planets", require('./components/Planets'));
routes.addRoute("/planets/:id", require('./components/Planet'));
routes.addRoute("*", require('./components/Error404'));

module.exports = routes;
