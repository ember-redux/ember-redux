import Ember from 'ember';

var route = function(model) {
    var finalModel = model || function() {return {};};
    return function wrapWithRoute(WrappedRoute) {
        return WrappedRoute.extend({
            store: Ember.inject.service('redux'),
            model(...args) {
                var store = this.get('store');
                return finalModel.apply(this, [store.dispatch].concat(args));
            }
        });
    };
};

export default route;
