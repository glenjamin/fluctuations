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
    FETCH_MESSAGE: function(emit, payload) {
        emit("FETCH_MESSAGE_BEGIN");
        setTimeout(function() {
            emit("CHANGE_MESSAGE", { value: "whatever" });
        }, 2000);
    }
});

var flux = fluctuations.createDispatcher();
flux.addInterceptor('stuff', interceptor);
flux.addStore('stuff', store);

flux.listen("logging", function() {
    console.log(flux.get());
});

flux.dispatch("INC_NUMBER");
```

## Concepts

**Fluctuations** is based around the Flux architecture as laid out by facebook. See the [flux documentation](https://facebook.github.io/flux/docs/overview.html#structure-and-data-flow) for more information. We keep the concepts defined by facebook, but make a few tweaks. Most notably **Action Creators** are removed, and **Action Interceptors** are introduced to perform a similar role.

### Action Interceptors

In early explanations of flux, the role of actions was a bit blurred. They seem to behave like commands and like events. As implementations were further clarified, Action Creators were explained as representing the command portion, while the data representation they sent to the dispatcher is referred to as the action. For many simple actions, this results in boilerplate code which translates a function call into a data payload. More complicated actions can use this layer of indirection to perform multiple actions, do asynchronous lookups etc.

The goal of action interceptors is to retain this capability, but remove the boilerplate code required in the common case. The **dispatcher** remains the central point for all communication. Stores and interceptors are attached to a dispatcher instance. Subscriptions are managed via the dispatcher, and the UI is expected to be able to call `dispatch()` directly.

Unlike creators, Interceptors sit behind the dispatcher. The actions which are dispatched into the dispatcher are intended to be treated like commands. If no interceptor exists then the action is treated like an event, and forwarded to all stores. If an interceptor chooses to handle the command, it is then freeto translate it into whatever event-like actions it wants to. Interceptors are also able to re-dispatch new commands and read the state of stores. This allows them full flexibility when deciding what events they must produce.

To summarise the key points here:

* **Stores** receive actions which should be treated like *events*
* The **Dispatcher** receives actions which should be treated like *commands*
* **Action Interceptors** capture a *command* and produce *events*
* If no interceptor exists, a *command* becomes an *event*

### Hot Reloading

The practice of hot reloading is making a system which can receive new code at runtime, and incorporate it into itself - ideally behaving the same as if it had been started afresh. The goal being to reduce the feedback cycle between changes.

The simplest way to make code hot reloadable is to make it pure (stateless), as soon as state is introduced, we have to decide what to do with it when reloading.

To make hot reloading easier, fluctuations minimises the number of places state is held - everything is kept in the dispatcher. In addition, every time something is attached to the dispatcher it is required to pass a `key` which names it uniquely. This is used to ensure the same item is never duplicated.

# Docs

In addition to these API docs, there are a few examples you can look at.

* [Counter](examples/counter/) - Basic data handling
* [React Hot](examples/react-hot/) - React w/ hot module reloading and async data fetching
* [React Isomorphic](examples/react-iso) - React w/ hot module reloading, routing, route-aware async data fetching & server rendering

## API

### `fluctuations`

```js
var fluctuations = require('fluctuations');
```

#### `.createDispatcher(options)`

Create yourself a shiny new dispatcher instance.

* `options` *object* - additional creation options
* `options.state` *object* - pass this to reuse state from a previous dispatcher

Returns *Dispatcher*

#### `.createStore(initial, handlers, merge)`

Create yourself a shiny new store representation.

Store representations by themselves don't do anything, they should be attached to your friendly neighbourhood dispatcher instance to make things work.

* `initial` *function() => state* - will be called when attaching a store to a dispatcher. The return value will become the initial state.
* `handlers` *object* - mapping of action-name to handler function, where handler functions are `function(state, payload) => newState`. See examples below.
* `merge` (optional) *function(state, newState) => state* - will be called when a store is being replaced, and can be used to combine the old and new states. The return value will become the new store state.

Returns *StoreSpec*

##### Store Handlers

Store handlers map incoming actions to state changes that should be made. The handler function will receive the current state of the store and any action payload, and should return a new state for the store.

For example, this set of handlers will increment and decrement the a number in the store as actions are passed in.
```js
{
    INC: function(state, n) {
        return { n: state.n + n };
    },
    DEC: function(state, n) {
        return { n: state.n - n };
    }
}
```
In general you are likely to want to use a merge function to ensure you don't replace properties you're not interested in, or look into using something like [Immutable](http://facebook.github.io/immutable-js/) here instead.

#### `.createInterceptor(handlers)`

Create yourself a shiny new interceptor representation.

Interceptor representations by themselves don't do anything, they should be attached to your friendly neighbourhood dispatcher instance to make things work.

* `handlers` *object* - mapping of action-name to handler function, where handler functions are `function(state, payload) => newState`. See examples below.

Returns *InterceptorSpec*

### dispatcher

# TODO

* High level tests
* Low level tests
* Cycle detection?
* Benchmarking / profiling
* Granular subscriptions
* Docs docs docs docs docs
