import Ember from 'ember';
import redux from 'npm:redux';
import reducers from '../reducers/index';
import middleware from '../middleware/index';

var store;
var { createStore, applyMiddleware, combineReducers } = redux;
var createStoreWithMiddleware = applyMiddleware(...middleware)(createStore);

export default Ember.Service.extend({
    init() {
        store = createStoreWithMiddleware(combineReducers(reducers));
        this._super(...arguments);
    },
    getState() {
        return store.getState();
    },
    dispatch(action) {
        store.dispatch(action);
    },
    subscribe(func) {
        return store.subscribe(func);
    }
});
