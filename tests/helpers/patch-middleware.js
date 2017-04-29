/* global require, define */

import originalMiddleware from 'dummy/middleware/index';
import createSaga from 'redux-saga';
import addAsync from 'dummy/sagas/counter';

const { unsee } = require;

export function applyPatch() {
  unsee('ember-redux/middleware/index');
  unsee('ember-redux/services/redux');
  unsee('dummy/middleware/index');
  unsee('dummy/services/redux');

  define('ember-redux/middleware/index', ['exports'], function (exports) {
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

  unsee('ember-redux/middleware/index');
  unsee('ember-redux/services/redux');
  unsee('dummy/middleware/index');
  unsee('dummy/services/redux');

  define('ember-redux/middleware/index', ['exports'], function (exports) {
    exports['default'] = originalMiddleware;
  });
}
