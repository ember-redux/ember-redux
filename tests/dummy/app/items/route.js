import ajax from 'dummy/utilities/ajax';
import { isPresent } from '@ember/utils';
import { route } from 'ember-redux';

var model = (dispatch) => {
  return ajax('/api/items', 'GET').then(response => dispatch({type: 'DESERIALIZE_ITEMS', response: response}));
};

function afterModel(dispatch, model, transition) {
  if (isPresent(transition)) {
    dispatch({type: 'AFTER_MODEL', transition: 'ok'});
  }
}

export default route({model, afterModel})();
