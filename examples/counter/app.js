var dispatch = require('./flux');

dispatch('INC');
dispatch('INC');
dispatch('INC');

dispatch('SLOW_INC');
dispatch('SLOW_INC', { delay: 5000 });
