define('dummy/middleware/index', ['exports', 'ember', 'npm:redux-saga', 'dummy/sagas/counter'], function (exports, _ember, _npmReduxSaga, _dummySagasCounter) {
  var createSaga = _npmReduxSaga['default']['default'] ? _npmReduxSaga['default']['default'] : _npmReduxSaga['default'];

  var sagaMiddleware = createSaga();

  const setup = () => {
    sagaMiddleware.run(_dummySagasCounter['default']);
  };

  exports['default'] = {
    middleware: [ sagaMiddleware ],
    setup: setup
  };
});

export default function() {}
