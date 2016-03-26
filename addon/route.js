import Ember from 'ember';

var route = function(funcs) {
    return function wrapWithRoute(WrappedRoute) {
        return WrappedRoute.extend({
            redux: Ember.inject.service('redux'),
            init() {
                var redux = this.get('redux');
                var route = this;
                Object.keys(funcs).forEach(function(func) {
                    route[func] = function(args) {
                        return funcs[func](redux.dispatch, args);
                    };
                });
                this._super(...arguments);
            }
        });
    };
};

export default route;
