import Ember from 'ember';
import redux from 'npm:redux';
import thunk from 'npm:redux-thunk';
import reducers from '../reducers/combined';

var { createStore, applyMiddleware, combineReducers } = redux;

var createStoreWithMiddleware = applyMiddleware(
    thunk
)(createStore);

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
