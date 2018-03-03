import { compose } from 'redux';
import createSaga from 'redux-saga';
import addAsync from 'dummy/sagas/counter';
import reducers from 'dummy/reducers/index';
import ReduxService from 'ember-redux/services/redux';

export function patchMiddleware(hooks) {
  hooks.beforeEach(function() {
    const sagaMiddleware = createSaga();
    const setup = (...args) => {
      window.middlewareArgs = args;
      sagaMiddleware.run(addAsync);
    };
    const middlewares = {
      middleware: [sagaMiddleware],
      setup: setup
    };
    const enhancers = compose(window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f);
    this.owner.register('service:redux', ReduxService.extend({ reducers, enhancers, middlewares }));
  });
}
