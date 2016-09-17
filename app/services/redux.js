import Ember from 'ember';
import redux from 'npm:redux';
import reducers from '../reducers/index';
import enhancers from '../enhancers/index';
import optional from '../reducers/optional';
import { defaultFunction } from '../reducers/optional';
import initialState from '../state-initializers/index';
import middleware from '../middleware/index';
import config from '../config/environment';

const { createStore, applyMiddleware, combineReducers, compose } = redux;
const createStoreWithMiddleware = compose(applyMiddleware(...middleware), enhancers)(createStore);

export default Ember.Service.extend({
    init() {
      this._super(...arguments);
      this.store = createStoreWithMiddleware(reducers, initialState(config));
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
