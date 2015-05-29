# flux-redux

Yet another flux implementation

[![npm version](https://img.shields.io/npm/v/flux-redux.svg)](https://www.npmjs.com/package/flux-redux) [![Build Status](https://img.shields.io/travis/glenjamin/flux-redux/master.svg)](https://travis-ci.org/glenjamin/flux-redux) [![Coverage Status](https://coveralls.io/repos/glenjamin/flux-redux/badge.svg?branch=master)](https://coveralls.io/r/glenjamin/flux-redux?branch=master) ![MIT Licensed](https://img.shields.io/npm/l/flux-redux.svg)

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
```

# TODO

* High level tests
* Low level tests
* Cycle detection?
* Isomorphic example - done-ness?
* Isomorphic HMR example
* Benchmarking / profiling
* Granular subscriptions
* Docs docs docs docs docs
