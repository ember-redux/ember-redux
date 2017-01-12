# Configure

If you have a solid understanding of redux basics and what the ember bindings offer, this section will help you unlock the potential of ember-redux by showing all the extension points!

**Enhancers**

In redux [enhancers][] allow you to write a function that produces a "new and improved" store creator. The most well known enhancer is one that enables [time travel debugging][]. To write a custom enhancer that enables time travel debugging (with help from the [chrome dev tools][]) just add a new directory named `enhancers` and inside it a single file `index.js`

```js
//app/enhancers/index.js
import { compose } from 'redux';

var devtools = window.devToolsExtension ? window.devToolsExtension() : f => f;

export default compose(devtools);
```

**Middleware**

In redux [middleware][] allows you to write a function that produces a "new and improved" dispatch. By default we include [redux-thunk][] to enable async actions. If you want to override this just add a new directory named `middleware` and inside it a single file `index.js`

```js
//app/middleware/index.js
import thunk from 'redux-thunk';

var resolved = thunk.default ? thunk.default : thunk;

var warnz = function({dispatch, getState}) {
  console.warn('wait!');
  return next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    return next(action);
  };
};

export default [resolved, warnz];
```

If the middleware you are using requires some additional setup after the store is created, like redux-saga you can export a setup function that will be run for you.

```js
//app/middleware/index.js
import createSagaMiddleWare from 'redux-saga';
import addAsync from '../sagas/counter';

const createSaga = createSagaMiddleWare.default ? createSagaMiddleWare.default : createSagaMiddleWare;

const sagaMiddleware = createSaga();

const setup = () => {
    sagaMiddleware.run(addAsync);
};

export default {
    middleware: [sagaMiddleware],
    setup: setup
};
```

**Reducers**

In redux [reducers][] take the current state along with some action and return a new state. In the example below you can see we return the previous state + 1 when the explicit action 'ADD' is triggered.

```js
//app/reducers/index.js
var number = ((state, action) => {
    if(action.type === 'ADD') {
        return state + 1;
    }
    return state || 0;
});

export default {
    number
}
```

[chrome dev tools]: https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en
[time travel debugging]: https://www.youtube.com/watch?v=xsSnOQynTHs
[enhancers]: https://github.com/reactjs/redux/blob/master/docs/Glossary.md#store-enhancer
[middleware]: https://github.com/reactjs/redux/blob/master/docs/Glossary.md#middleware
[reducers]: https://github.com/reactjs/redux/blob/master/docs/Glossary.md#reducer
[redux-thunk]: https://github.com/gaearon/redux-thunk
