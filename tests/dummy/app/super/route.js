import Route from '@ember/routing/route';
import { route } from 'ember-redux';

var model = () => {
  return [];
};

var SuperRoute = Route.extend({
  invoked: null,
  init: function() {
    this.set('invoked', true);
  }
});

export default route({model})(SuperRoute);
