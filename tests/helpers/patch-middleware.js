/* global require, define */

import originalMiddleware from 'dummy/middleware/index';
import createSaga from 'redux-saga';
import addAsync from 'dummy/sagas/counter';

const { unsee } = require;

export function applyPatch() {
  unsee('dummy/services/redux');
  unsee('dummy/middleware/index');

  define('dummy/middleware/index', ['exports'], function (exports) {
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
}

export function revertPatch() {
  window.middlewareArgs = undefined;

  unsee('dummy/services/redux');
  unsee('dummy/middleware/index');

  define('dummy/middleware/index', ['exports'], function (exports) {
    exports['default'] = originalMiddleware;
  });
}
