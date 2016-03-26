import Ember from 'ember';
import route from 'ember-redux/route';

var model = () => {
    return [];
};

var SuperRoute = Ember.Route.extend({
    invoked: null,
    init: function() {
        this.set('invoked', true);
    }
});

export default route({model})(SuperRoute);
