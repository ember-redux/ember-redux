import Ember from 'ember';
import { createStoreWithMiddleware, optional, combineReducers, reducers, setup } from './setup-store';

export default Ember.Service.extend({
    init() {
        this.store = createStoreWithMiddleware(optional(combineReducers(reducers)));
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
