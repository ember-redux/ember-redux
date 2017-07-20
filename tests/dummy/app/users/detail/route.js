import Route from '@ember/routing/route';
import ajax from 'dummy/utilities/ajax';
import { route } from 'ember-redux';

var model = (dispatch, params) => {
  var { user_id } = params;
  return ajax(`/api/users/${user_id}`, 'GET').then(response => dispatch({type: 'DESERIALIZE_USER', response: response}));
};

var UsersDetailRoute = Route.extend();

export default route({model})(UsersDetailRoute);
