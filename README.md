# fluctuations

Yet another flux implementation

Formerly known as `flux-redux`.

[![npm version](https://img.shields.io/npm/v/fluctuations.svg)](https://www.npmjs.com/package/fluctuations) [![Build Status](https://img.shields.io/travis/glenjamin/fluctuations/master.svg)](https://travis-ci.org/glenjamin/fluctuations) [![Coverage Status](https://coveralls.io/repos/glenjamin/fluctuations/badge.svg?branch=master)](https://coveralls.io/r/glenjamin/fluctuations?branch=master) ![MIT Licensed](https://img.shields.io/npm/l/fluctuations.svg)

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
npm install fluctuations
```

## Usage

```js
var fluctuations = require('fluctuations');

var store = fluctuations.createStore(
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

var interceptor = fluctuations.createInterceptor({
    FETCH_MESSAGE: function(dispatch, payload) {
        dispatch("FETCH_MESSAGE_BEGIN");
        setTimeout(function() {
            dispatch("CHANGE_MESSAGE", { value: "whatever" });
        }, 2000);
    }
});

var flux = fluctuations.createDispatcher();
flux.addInterceptor('stuff', interceptor);
flux.addStore('stuff', store);

flux.listen("logging", function() {
    console.log(flux.get());
});
```

# Docs

None yet, for now you'll have to rely on examples:

* [Counter](examples/counter/) - Basic data handling
* [React Hot](examples/react-hot/) - React w/ hot module reloading and async data fetching
* [React Isomorphic](examples/react-iso) - React w/ hot module reloading, routing, route-aware async data fetching & server rendering

# TODO

* High level tests
* Low level tests
* Cycle detection?
* Benchmarking / profiling
* Granular subscriptions
* Docs docs docs docs docs
