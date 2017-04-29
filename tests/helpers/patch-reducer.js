/* global require, define */

import originalReducer from 'dummy/reducers/index';

const { unsee } = require;

export function applyPatch() {
  unsee('ember-redux/reducers/index');
  unsee('ember-redux/services/redux');
  unsee('dummy/reducers/index');
  unsee('dummy/services/redux');

  define('ember-redux/reducers/index', ['exports', 'dummy/reducers/low', 'dummy/reducers/high', 'redux'], function (exports, _low, _high, _redux) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
      value: true
    });


    var combined = function combined(state, action) {
      if (action.type === 'COMBINE') {
        return Object.assign({}, state, { done: true });
      }
      return state || { done: false };
    };

    exports.default = (0, _redux.combineReducers)({
      low: _low.default,
      high: _high.default,
      combined: combined
    });
  });
}

export function revertPatch() {
  unsee('ember-redux/reducers/index');
  unsee('ember-redux/services/redux');
  unsee('dummy/reducers/index');
  unsee('dummy/services/redux');

  define('ember-redux/reducers/index', ['exports'], function (exports) {
    exports['default'] = originalReducer;
  });
}
