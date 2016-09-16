import Ember from 'ember';
import redux from 'npm:redux';
import reducers from '../reducers/index';
import enhancers from '../enhancers/index';
import optional from '../reducers/optional';
import { defaultFunction } from '../reducers/optional';
import initialState from '../state-initializers/index';
import middleware from '../middleware/index';

var { createStore, applyMiddleware, combineReducers, compose } = redux;
var createStoreWithMiddleware = compose(applyMiddleware(...middleware), enhancers)(createStore);

export default Ember.Service.extend({
    init() {
      this._super(...arguments);
      if(!defaultFunction) {
        Ember.debug('Please note that the "optional.js" file is a deprecated feature of ember-redux. Please use either middleware or the state-initializer functionality');
      }
      this.store = createStoreWithMiddleware(optional(reducers), initialState);
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
