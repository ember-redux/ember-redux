import Ember from 'ember';

var route = function(funcs) {
  return function wrapWithRoute(IncomingRoute) {
    var WrappedRoute = IncomingRoute || Ember.Route;
    return WrappedRoute.extend({
      redux: Ember.inject.service('redux'),
      init() {
        var redux = this.get('redux');
        var route = this;
        Object.keys(funcs).forEach(function(func) {
          route[func] = function(...args) {
            args.unshift(redux.dispatch.bind(redux));
            return funcs[func].apply(route, args);
          };
        });
        this._super(...arguments);
      }
    });
  };
};

export default route;
