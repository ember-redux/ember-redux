import Ember from 'ember';
import route from 'ember-redux/route';

var beforeModel = (dispatch) => {
    let roles = Ember.$('[preload-roles]').data('configuration');
    roles.forEach((model) => {
        dispatch({type: 'ADD_ROLE', response: model});
    });
};

var ApplicationRoute = Ember.Route.extend();

export default route({beforeModel})(ApplicationRoute);
