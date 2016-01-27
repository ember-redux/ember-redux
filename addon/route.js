import Ember from 'ember';

var route = function(funcs) {
    return function wrapWithRoute(WrappedRoute) {
        return WrappedRoute.extend({
            store: Ember.inject.service('redux'),
            init() {
                var store = this.get('store');
                var route = this;
                Object.keys(funcs).forEach(function(func) {
                    route[func] = function(args) {
                        return funcs[func](store.dispatch, args);
                    };
                });
            }
        });
    };
};

export default route;
