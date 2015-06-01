/* eslint-env mocha */

var sinon = require('sinon');
var chai = require('chai');
chai.use(require('sinon-chai'));
var expect = chai.expect;

var fluctuations = require('../');

describe("fluctuations", function() {
  var flux, listener, s;
  beforeEach(function() {
    s = sinon.sandbox.create();
    listener = s.spy();
    flux = fluctuations.createDispatcher();
    flux.listen('listener', listener);
  });
  afterEach(function() {
    s.restore();
  });

  describe("1 store", function() {
    beforeEach(function() {
      var store = fluctuations.createStore(
        function() { return 0; },
        {
          INC: function(n) { return n + 1; },
          DEC: function(n) { return n - 1; },
          ADD: function(n, i) { return n + i; }
        }
      );
      flux.addStore('store', store);
      s.stub(console, 'warn');
    });

    it("should begin on initial value", function() {
      expect(flux.get().store).to.eql(0);
    });

    it("should merge state from the previous store", function() {
      flux.dispatch("INC");
      var store2 = fluctuations.createStore(
        function() {
          return 0;
        }, {});
      flux.addStore('store', store2);
      expect(flux.get().store).to.eq(1);
    });

    it("should use the merge strategy", function() {
      flux.dispatch("ADD", 4);
      var store2 = fluctuations.createStore(
        function() {
          return 3;
        }, {}, function(x, y){
          return x + y;
        });
      flux.addStore('store', store2);
      expect(flux.get().store).to.eq(7);
    });

    it("should call listener after dispatch", function() {
      flux.dispatch("INC");
      expect(listener).to.have.callCount(1);
    });

    it("should call listener after every dispatch", function() {
      flux.dispatch("INC");
      flux.dispatch("INC");
      expect(listener).to.have.callCount(2);
      flux.dispatch("INC");
      expect(listener).to.have.callCount(3);
    });

    it("should have updated state when calling listener", function(done) {
      flux.listen('listener', function() {
        expect(flux.get().store).to.eql(1);
        done();
      });
      flux.dispatch("INC");
    });

    it("should update store's state after each dispatch", function() {
      flux.dispatch("INC");
      expect(flux.get().store).to.eql(1);
      flux.dispatch("INC");
      expect(flux.get().store).to.eql(2);
      flux.dispatch("DEC");
      expect(flux.get().store).to.eql(1);
      flux.dispatch("INC");
      expect(flux.get().store).to.eql(2);
    });

    it("should pass action payload along to handler", function() {
      flux.dispatch("ADD", 3);
      expect(flux.get().store).to.eql(3);
    });

    it("should not warn on a matching action", function() {
      flux.dispatch("INC");
      expect(console.warn).to.have.callCount(0);
    });

    it("should warn if dispatching an unknown action", function() {
      flux.dispatch("NOTHING");
      expect(console.warn).to.have.callCount(1);
    });

    it("should not call listener if unknown action", function() {
      flux.dispatch("NOTHING");
      expect(listener).to.have.callCount(0);
    });

    it("should retain state when added again");
    it("should use optional merge strategy on state when added again");
  });

  describe("multiple overlapping stores", function() {
    beforeEach(function() {
      flux.addStore('a', fluctuations.createStore(
        function() { return -10; },
        {
          BUMP: function(n) { return n + 1; },
          JUMP: function(n) { return n + 10; }
        }
      ));
      flux.addStore('b', fluctuations.createStore(
        function() { return 10; },
        {
          BUMP: function(n) { return n - 1; },
          LUMP: function(n) { return n - 10; }
        }
      ));
      s.stub(console, 'warn');
    });

    it("should begin on initial values", function() {
      expect(flux.get().a).to.eql(-10);
      expect(flux.get().b).to.eql(10);
    });

    it("should call listener if one matches", function() {
      flux.dispatch("JUMP");
      expect(listener).to.have.callCount(1);
    });
    it("should call listener if another matches", function() {
      flux.dispatch("LUMP");
      expect(listener).to.have.callCount(1);
    });
    it("should call listener once if both match", function() {
      flux.dispatch("BUMP");
      expect(listener).to.have.callCount(1);
    });
    it("should update state of one if matching", function() {
      flux.dispatch("JUMP");
      expect(flux.get().a).to.eql(0);
      expect(flux.get().b).to.eql(10);
      flux.dispatch("LUMP");
      expect(flux.get().a).to.eql(0);
      expect(flux.get().b).to.eql(0);
    });
    it("should update state of all matching", function() {
      flux.dispatch("BUMP");
      expect(flux.get().a).to.eql(-9);
      expect(flux.get().b).to.eql(9);
    });

    it("should not warn on a single matching action", function() {
      flux.dispatch("LUMP");
      expect(console.warn).to.have.callCount(0);
    });

    it("should not warn on a multiple matching action", function() {
      flux.dispatch("BUMP");
      expect(console.warn).to.have.callCount(0);
    });

    it("should warn if dispatching an unknown action", function() {
      flux.dispatch("NOTHING");
      expect(console.warn).to.have.callCount(1);
    });

    it("should not call listener if unknown action", function() {
      flux.dispatch("NOTHING");
      expect(listener).to.have.callCount(0);
    });
  });

  describe("1 store with interceptor", function() {
    var storeInc, interceptions;
    beforeEach(function() {
      interceptions = [];
      storeInc = s.spy(function(n) { return n + 1; });
      flux.addStore('n', fluctuations.createStore(
        function() { return 0; },
        {
          QUICK_INC: function(n) { return n + 1; },
          INC: storeInc,
          START_INC: function(n) { return n + 0.1; },
          END_INC: function(n) { return n + 0.9; }
        }
      ));
      flux.addInterceptor('slow', fluctuations.createInterceptor({
        INC: function(dispatch) {
          dispatch("START_INC");
        },
        HIJACK: function(dispatch) {
          interceptions.push(dispatch);
        }
      }));
      s.stub(console, 'warn');
    });

    it("should send non-intercepted actions to store", function() {
      flux.dispatch("QUICK_INC");
      expect(listener).to.have.callCount(1);
      expect(flux.get().n).to.eql(1);
    });

    it("should not send intercepted actions to store", function() {
      flux.dispatch("HIJACK");
      expect(storeInc).to.have.callCount(0);
    });

    it("should dispatch from interceptor to store", function() {
      flux.dispatch("INC");
      expect(listener).to.have.callCount(1);
      expect(flux.get().n).to.eql(0.1);
    });

    it("should not dispatch from interceptor to interceptor", function() {
      flux.dispatch("HIJACK");
      expect(interceptions).to.have.length(1); // captured interception
      interceptions[0]("HIJACK");
      expect(console.warn).to.have.callCount(1);
    });

    it("should allow async stuff via interceptors", function(done) {
      flux.dispatch("HIJACK");
      expect(interceptions).to.have.length(1); // captured interception
      setTimeout(function() {
        interceptions[0]("END_INC");
      }, 0);

      flux.listen('listener', function() {
        expect(flux.get().n).to.eql(0.9);
        done();
      });
    });

    it("should receive payloads in interceptors");
    it("should allow interceptors to dispatch payloads to stores");
  });

  describe("multiple overlapping interceptors", function() {
    it("should only call first matching interceptor");
    it("should do everything else the same");
  });

  describe("rehydration", function() {
    var store;
    beforeEach(function() {
      store = fluctuations.createStore(
        function() { return 0; },
        { INC: function(n) { return n + 1; } }
      );
      flux.addStore('store', store);
      s.stub(console, 'warn');
    });

    it("should begin with state if told to", function() {
      flux.dispatch("INC");
      var newFlux = fluctuations.createDispatcher({ state: flux.get() });
      newFlux.addStore('store', store);
      expect(newFlux.get()).to.deep.eql(flux.get());
    });
  });
});
