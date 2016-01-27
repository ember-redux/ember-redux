import Ember from 'ember';
import ajax from 'dummy/utilities/ajax';
import route from 'ember-redux/route';

var model = (dispatch) => {
    return ajax('/api/users', 'GET').then(response => dispatch({type: 'DESERIALIZE_USERS', response: response}));
};

var UsersRoute = Ember.Route.extend({
    setupController: function(controller) {
        controller.set('extended', 'yes');
    }
});

export default route({model})(UsersRoute);
