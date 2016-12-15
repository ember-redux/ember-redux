define('dummy/middleware/index', ['exports', 'ember', 'redux-saga', 'dummy/sagas/counter'], function (exports, _ember, _npmReduxSaga, _dummySagasCounter) {

  var createSaga = _npmReduxSaga['default']['default'] ? _npmReduxSaga['default']['default'] : _npmReduxSaga['default'];

  var sagaMiddleware = createSaga();

  const setup = (...args) => {
    window.middlewareArgs = args;
    sagaMiddleware.run(_dummySagasCounter['default']);
  };

  exports['default'] = {
    middleware: [ sagaMiddleware ],
    setup: setup
  };
});

export default function() {}
