import Ember from 'ember';

const QueryParamsRoute = Ember.Route.extend({
  redux: Ember.inject.service(),
  queryParams: {
    foo: {
      refreshModel: false
    }
  },
  afterModel(model, transition) {
    var redux = this.get('redux');
    if (Ember.isPresent(transition)) {
      redux.dispatch({
        queryParams: Object.keys(this.get('queryParams')),
        type: 'SET_QUERY_PARAMS'
      });
    }
  }
});

export default QueryParamsRoute;
