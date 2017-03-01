import Ember from 'ember';
import redux from 'redux';
import reducers from '../reducers/index';
import enhancers from '../enhancers/index';
import middlewareConfig from '../middleware/index';

const { assert, isArray } = Ember;

// Handle "classic" middleware exports (i.e. an array), as well as the hash option
const extractMiddlewareConfig = (mc) => {
  assert(
    'Middleware must either be an array, or a hash containing a `middleware` property',
    isArray(mc) || mc.middleware
  );
  return isArray(mc) ? { middleware: mc } : mc;
}

// Destructure the middleware array and the setup thunk into two different variables
const { middleware, setup = () => {} } = extractMiddlewareConfig(middlewareConfig);

var { createStore, applyMiddleware, combineReducers, compose } = redux;
var createStoreWithMiddleware = compose(applyMiddleware(...middleware), enhancers)(createStore);

export default Ember.Service.extend({
  init() {
    this.store = createStoreWithMiddleware(combineReducers(reducers));
    setup(this.store);
    this._super(...arguments);
  },
  getState() {
    return this.store.getState();
  },
  dispatch(action) {
    return this.store.dispatch(action);
  },
  subscribe(func) {
    return this.store.subscribe(func);
  }
});
