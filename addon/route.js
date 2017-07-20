import { inject } from '@ember/service';
import Route from '@ember/routing/route';

var route = function(funcs) {
  return function wrapWithRoute(IncomingRoute) {
    var WrappedRoute = IncomingRoute || Route;
    return WrappedRoute.extend({
      redux: inject('redux'),
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
