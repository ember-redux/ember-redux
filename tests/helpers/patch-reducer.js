import { compose, combineReducers } from 'redux';
import middlewares from 'dummy/middleware/index';
import ReduxService from 'ember-redux/services/redux';
import low from 'dummy/reducers/low';
import high from 'dummy/reducers/high';

export function patchReducer(hooks) {
  hooks.beforeEach(function() {
    const combined = function combined(state, action) {
      if (action.type === 'COMBINE') {
        return Object.assign({}, state, { done: true });
      }
      return state || { done: false };
    };
    const reducers = combineReducers({
      low,
      high,
      combined
    });
    const enhancers = compose(window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f);
    this.owner.register('service:redux', ReduxService.extend({ reducers, enhancers, middlewares }));
  });
}
