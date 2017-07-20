import $ from 'jquery';
import { route } from 'ember-redux';

var beforeModel = (dispatch) => {
  let roles = $('[preload-roles]').data('configuration');
  dispatch({type: 'ADD_ROLES', roles: roles});
};

export default route({beforeModel})();
