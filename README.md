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
 * Easy to run isomorphically
 * Easy to use with hot reloading

## Install

```sh
npm install flux-redux
```

## Usage

> This is currently speculative.

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

var flux = redux.dispatcher();
flux.intercept(interceptor);
flux.register('stuff', store);

flux.listen(function(stores) {
    console.log(stores);
});
```
