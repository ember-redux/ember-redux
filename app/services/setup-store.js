import Ember from 'ember';
import Redux from 'npm:redux';
import reducers from '../reducers/index';
import enhancers from '../enhancers/index';
import optional from '../reducers/optional';
import middlewareConfig from '../middleware/index';

const { assert, isArray, K } = Ember;

// Handle "classic" middleware exports (i.e. an array), as well as the hash option
const extractMiddlewareConfig = (mc) => {
  assert(
    'Middleware must either be an array, or a hash containing a `middleware` property',
    isArray(mc) || mc.middleware
  );
  return isArray(mc) ? { middleware: mc } : mc;
}

// Destructure the middleware array and the setup thunk into two different variables
const { middleware, setup = K } = extractMiddlewareConfig(middlewareConfig);

var { createStore, applyMiddleware, combineReducers, compose } = Redux;
var createStoreWithMiddleware = compose(applyMiddleware(...middleware), enhancers)(createStore);

export { createStoreWithMiddleware, optional, combineReducers, reducers, setup };
