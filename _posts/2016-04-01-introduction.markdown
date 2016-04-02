---
layout: post
title:  "Introduction"
date:   2016-04-01 23:18:27 -0500
categories: docs
---
To install ember-redux

```
npm install ember-browserify -D
npm install ember-redux -D
```

To better understand ember-redux we first need to break down the essential concepts in redux itself. Because redux revolves around a central store we first need to create that using the `createStore` function.

```js
import Redux from 'npm:redux';

var { createStore } = Redux;

var store = createStore();
```

If you ran the code above you would notice a runtime error in redux. This error occurs because I failed to pass `createStore` a required argument. The argument is a function that takes the current state of the application plus an action and returns the next state of the application. If that sounded a little dense let me explain with an example.

```js
var reducer = ((state, action) => {
    if(action.type === 'ADD') {
        return state + 1;
    }
    return state || 0;
});
```

In the example my function takes 2 arguments. The first is simply the state that we will later render in a web component. Notice this will start as `undefined` so we will begin with a default value of `0`.

The action represents some intent of the program to help us know what operation should occur. If you were to `console.log` the action during the first pass you would see a custom INIT action that redux will pass if we provide no other action is present. This means we will simply return the value of `0` and exit the function.

We can now update the `createStore` function above to take this new reducer function as it's the required argument we are missing.

```js
import Redux from 'npm:redux';

var { createStore } = Redux;

var reducer = ((state, action) => {
    if(action.type === 'ADD') {
        return state + 1;
    }
    return state || 0;
});

var store = createStore(reducer);
```

Now that we have the store itself, we can use it to get the state and send actions. First up lets create a simple computed property to wrap the state returned from the store. In the example below we can get the state of the function by invoking `getState` directly on the store.

```js
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import Redux from 'npm:redux';

var { createStore } = Redux;

var reducer = ((state, action) => {
    if(action.type === 'ADD') {
        return state + 1;
    }
    return state || 0;
});

var store = createStore(reducer);

export default Ember.Component.extend({
    number: Ember.computed(function() {
        return store.getState();
    }),
    layout: hbs`
      {\{number}}
    `
});
```

The initial render now shows the default state of `0` as we expect. To modify that number (and fire that reducer function above with an action) we need to wire up a button in this component that can `dispatch` to the store with the action type.

```js
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import Redux from 'npm:redux';

var { createStore } = Redux;

var reducer = ((state, action) => {
    if(action.type === 'ADD') {
        return state + 1;
    }
    return state || 0;
});

var store = createStore(reducer);

export default Ember.Component.extend({
    number: Ember.computed(function() {
        return store.getState();
    }),
    actions: {
        add: function() {
            store.dispatch({type: 'ADD'});
        }
    },
    layout: hbs`
      {\{number}}
      <button onclick={{action "add"}}>add</button>
    `
});
```

If you run this in the browser you will notice on big problem ... the number never gets updated. If you `console.log` in the reducer function you would see the action is getting passed in and we are returning a new state. The problem is that our computed is cached and we never informed the component about a new value.

To break the cache on the computed property we need to notify the property that it has changed. This brings about the last redux method we need to learn about called `subscribe`. This method will be fired when the store returns the next state of our application. We can wire it up in the `init` below so it breaks the cache and we truly re-render the number.

```js
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import Redux from 'npm:redux';

var { createStore } = Redux;

var reducer = ((state, action) => {
    if(action.type === 'ADD') {
        return state + 1;
    }
    return state || 0;
});

var store = createStore(reducer);

export default Ember.Component.extend({
    init: function() {
        this._super(...arguments);
        store.subscribe(() => {
            this.notifyPropertyChange('number');
        });
    },
    number: Ember.computed(function() {
        return store.getState();
    }),
    actions: {
        add: function() {
            store.dispatch({type: 'ADD'});
        }
    },
    layout: hbs`
      {\{number}}
      <button onclick={{action "add"}}>add</button>
    `
});
```

A quick recap of the 4 methods we use from redux.

1) `createStore` the starting point that creates the store itself

2) `store.getState()` the function that returns the state we render in our components

3) `store.dispatch({type: 'ADD'})` the function we send off to the reducer that results in a new state

4) `store.subscribe(callback here)` the function we put here is called when a new state of the application is returned

Note: One very important detail I'm skipping over is that when we return a new state of the application we should not mutate the previous state. Notice In my reducer function(s) above, we always return a new number (never change the existing number). The term for this concept is immutability and I'll discuss it in more detail later.
