/*global define:true*/

define('dummy/middleware/index', ['exports', 'ember', 'redux-saga', 'dummy/sagas/counter'], function (exports, _ember, createSaga, addAsync) {
  while ('default' in addAsync) {
    addAsync = addAsync.default;
  }

  while ('default' in createSaga) {
    createSaga = createSaga.default;
  }

  var sagaMiddleware = createSaga();

  const setup = (...args) => {
    window.middlewareArgs = args;
    sagaMiddleware.run(addAsync);
  };

  exports['default'] = {
    middleware: [ sagaMiddleware ],
    setup: setup
  };
});

export default function() {}
