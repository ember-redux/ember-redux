import Ember from 'ember';
import route from 'ember-redux/route';

var queryParams = {
  foo: {
    refreshModel: false
  }
};

function afterModel(dispatch, model, transition) {
  if (Ember.isPresent(transition)) {
    dispatch({
      queryParams: Object.keys(this.get('queryParams')),
      type: 'SET_QUERY_PARAMS'
    });
  }
}

var QueryParamsRoute = Ember.Route.extend();

export default route({queryParams, afterModel})(QueryParamsRoute);
