# flux-redux

Yet another flux implementation

## Goals

 * Simple Implementation
 * Small API
 * Flexible
 * Functional rather than OO
 * Reducer-style stores
 * Actions as simple data
 * Action interceptors for async stuff
 * No singletons
 * Easy to use with Immutable.js
 * Easy to run isomorphically
 * Easy to use with hot reloading

## Install

```sh
npm install flux-redux
```

## Usage

```js
var redux = require('flux-redux');

var store = redux.createStore(
    function() {
        return { initial: 'data', number: 0 };
    },
    {
        CHANGE_MESSAGE: function(state, payload) {
            state.initial = payload.value;
            return state;
        },
        INC_NUMBER: function(state) {
            state.number += 1;
            return state;
        }
    }
);

var interceptor = redux.createInterceptor({
    FETCH_MESSAGE: function(dispatch, payload) {
        dispatch("FETCH_MESSAGE_BEGIN");
        setTimeout(function() {
            dispatch("CHANGE_MESSAGE", { value: "whatever" });
        }, 2000);
    }
});

var flux = redux.createDispatcher();
flux.addInterceptor('stuff', interceptor);
flux.addStore('stuff', store);

flux.listen("logging", function() {
    console.log(flux.get());
});

// useful for hot reloading
flux.replace({
  stuff: {
    initial: 'data',
    number: 5
  }
});
```

# TODO

* High level tests
* Low level tests
* Cycle detection?
* HMR example
* Merge current state and new initial generically when doing HMR?
* Isomorphic example - done-ness?
* Isomorphic HMR example
* Benchmarking / profiling
* Granular subscriptions
