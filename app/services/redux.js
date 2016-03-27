import Ember from 'ember';
import redux from 'npm:redux';
import reducers from '../reducers/index';
import middleware from '../middleware/index';

var { createStore, applyMiddleware, combineReducers } = redux;

var createStoreWithMiddleware = applyMiddleware(...middleware)(createStore);

var store = createStoreWithMiddleware(combineReducers(reducers));

export default Ember.Service.extend({
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
