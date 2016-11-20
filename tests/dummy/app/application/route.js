import Ember from 'ember';
import route from 'ember-redux/route';

var beforeModel = (dispatch) => {
  let roles = Ember.$('[preload-roles]').data('configuration');
  dispatch({type: 'ADD_ROLES', roles: roles});
};

var ApplicationRoute = Ember.Route.extend();

export default route({beforeModel})(ApplicationRoute);
