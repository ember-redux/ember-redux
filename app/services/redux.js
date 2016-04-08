import Ember from 'ember';
import redux from 'npm:redux';
import reducers from '../reducers/index';
import enhancers from '../enhancers/index';
import optional from '../reducers/optional';
import middleware from '../middleware/index';

var { createStore, applyMiddleware, combineReducers, compose } = redux;
var createStoreWithMiddleware = compose(applyMiddleware(...middleware), enhancers)(createStore);

export default Ember.Service.extend({
    init() {
        this.store = createStoreWithMiddleware(optional(combineReducers(reducers)));
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
