import ajax from 'dummy/utilities/ajax';
import route from 'ember-redux/route';

var model = (dispatch) => {
  return ajax('/api/users', 'GET').then(response => dispatch({type: 'DESERIALIZE_USERS', response: response}));
};

export default route({model})();
