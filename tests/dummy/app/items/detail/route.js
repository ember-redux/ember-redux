import ajax from 'dummy/utilities/ajax';
import { route } from 'ember-redux';

var model = (dispatch, params) => {
  var { item_id } = params;
  return ajax(`/api/items/${item_id}`, 'GET').then(response => dispatch({type: 'DESERIALIZE_ITEM', response: response}));
};

export default route({model})();
