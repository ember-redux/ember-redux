import Ember from 'ember';
import ajax from 'dummy/utilities/ajax';
import route from 'ember-redux/route';

var model = (dispatch) => {
  return ajax('/api/items', 'GET').then(response => dispatch({type: 'DESERIALIZE_ITEMS', response: response}));
};

function afterModel(dispatch, model, transition) {
  if (Ember.isPresent(transition)) {
    dispatch({type: 'AFTER_MODEL', transition: 'ok'});
  }
}

export default route({model, afterModel})();
