import { inject } from '@ember/service';
import Route from '@ember/routing/route';
import { isPresent } from '@ember/utils';

const QueryParamsRoute = Route.extend({
  redux: inject(),
  queryParams: {
    foo: {
      refreshModel: false
    }
  },
  afterModel(model, transition) {
    var redux = this.get('redux');
    if (isPresent(transition)) {
      redux.dispatch({
        queryParams: Object.keys(this.get('queryParams')),
        type: 'SET_QUERY_PARAMS'
      });
    }
  }
});

export default QueryParamsRoute;
