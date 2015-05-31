var handlers = {};

exports.addHandlers = addHandlers;
function addHandlers(obj) {
  Object.keys(obj || {}).forEach(k => handlers[k] = obj[k]);
}

/**
 * Turn a data description into bunch of store dispatches
 * @param {object} descriptor description of requested data
 * @param {function} dispatch dispatch data to stores
 * @param {function} callback to be called when complete
 */
exports.fetch = fetch;
function fetch(descriptor, dispatch, callback) {
  var entities = Object.keys(descriptor);
  asyncEach(entities, (entity, next) => {
    if (handlers[entity]) {
      return handlers[entity](descriptor[entity], dispatch, next);
    }
    console.warn("Unknown handler %s - ", entity, descriptor[entity]);
    return next();
  }, callback);
}

function asyncEach(arr, iterator, callback) {
  var i = arr.length;
  arr.forEach(x => iterator(x, next));
  function next() {
    if (--i == 0) return callback();
  }
}
