import Ember from 'ember';

var route = function(props) {
  return function wrapWithRoute(IncomingRoute) {
    var WrappedRoute = IncomingRoute || Ember.Route;
    return WrappedRoute.extend({
      redux: Ember.inject.service('redux'),
      init() {
        var redux = this.get('redux');
        var route = this;
        Object.keys(props).forEach(function(key) {
          if (typeof props[key] !== 'function') {
            route[key] = props[key]
            return
          }
          route[key] = function(...args) {
            args.unshift(redux.dispatch.bind(redux));
            return props[key].apply(route, args);
          };
        });
        this._super(...arguments);
      }
    });
  };
};

export default route;
