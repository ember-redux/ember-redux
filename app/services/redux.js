import Ember from 'ember';
import redux from 'npm:redux';
import reducers from '../reducers/index';
import middleware from '../middleware/index';

var { createStore, applyMiddleware, combineReducers } = redux;
var createStoreWithMiddleware = applyMiddleware(...middleware)(createStore);

export default Ember.Service.extend({
    init() {
        this.store = createStoreWithMiddleware(combineReducers(reducers));
        this._super(...arguments);
    },
    getState() {
        return this.store.getState();
    },
    dispatch(action) {
        this.store.dispatch(action);
    },
    subscribe(func) {
        return this.store.subscribe(func);
    }
});
