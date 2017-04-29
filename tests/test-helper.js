/* global define */

import resolver from './helpers/resolver';
import {
  setResolver
} from 'ember-qunit';
import { start } from 'ember-cli-qunit';

import dummyReducer from 'dummy/reducers/index';
import dummyEnhancer from 'dummy/enhancers/index';

setResolver(resolver);

define('ember-redux/reducers/index', ['exports'], function (exports) {
  exports['default'] = dummyReducer;
});

define('ember-redux/enhancers/index', ['exports'], function (exports) {
  exports['default'] = dummyEnhancer;
});

start();
