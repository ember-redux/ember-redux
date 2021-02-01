---
layout: docs
title: Overview - ember-redux
---
{% raw %}

# Overview

First install ember-redux from the command line

```
ember install ember-redux
```

To better understand ember-redux we first need to break down the essential concepts in redux itself. Because redux revolves around a central store we first need to create it using the `createStore` function.

```js
import { createStore } from 'redux';

const store = createStore();
```

If you ran the code above you likely hit a runtime error in redux. This error occurs because I failed to pass `createStore` a required argument. The argument is a function that takes the current state of the application plus an action and returns the next state of the application. If that description sounded a bit terse let me explain with an example.

```js
const reducer = ((state, action) => {
  if(action.type === 'ADD') {
    return state + 1;
  }
  return state || 0;
});
```

In the code sample above you can see the function takes 2 arguments. The first is the current state of the application. In the first pass this value will be `undefined` and at the very end you will notice the function returns a value of `0` (acting as our default state). This return value now represents the next state of the application and we will render it using our web component a bit later. It's important to note that the second time this reducer function is called we start with a state value of `0`.

The action represents some intent of the program to help us know what operation or transformation we should perform. If you were to `console.log` the action during the first pass you would see a custom INIT action that redux will pass if we provide no other action. During the second pass, if we provided an action with type `ADD` we will increment the value and return it as the next state.

We can now update the `createStore` function above to take this new reducer function as it's the required argument we were missing earlier.

```js
import { createStore } from 'redux';

const reducer = ((state, action) => {
  if(action.type === 'ADD') {
    return state + 1;
  }
  return state || 0;
});

const store = createStore(reducer);
```

Now that we have the store itself, we can use it to get the state and send actions. First we will create a computed property to wrap the state returned from the store. In the example below we can get the state of the function by invoking `getState` directly on the store.

```js
import Component from '@ember/component';
import { computed } from '@ember/object';
import hbs from 'htmlbars-inline-precompile';
import { createStore } from 'redux';

const reducer = ((state, action) => {
  if(action.type === 'ADD') {
    return state + 1;
  }
  return state || 0;
});

const store = createStore(reducer);

export default Component.extend({
  number: computed(function() {
    return store.getState();
  }),
  layout: hbs`
    {{number}}
  `
});
```

The initial render now shows the default state of `0` as we expect. To modify that number (and fire that reducer function above with an action) we need to wire up a button in this component that can `dispatch` to the store. We are required to give this dispatch function at minimum one argument of type object with a `type` attribute that describes the intent so the reducer function knows what it should do.

```js
import Component from '@ember/component';
import { computed } from '@ember/object';
import hbs from 'htmlbars-inline-precompile';
import { createStore } from 'redux';

const reducer = ((state, action) => {
  if(action.type === 'ADD') {
    return state + 1;
  }
  return state || 0;
});

const store = createStore(reducer);

export default Component.extend({
  number: computed(function() {
    return store.getState();
  }),
  actions: {
    add: function() {
      store.dispatch({type: 'ADD'});
    }
  },
  layout: hbs`
    {{number}}
    <button onclick={{action "add"}}>add</button>
  `
});
```

If you run this in the browser you will notice one last problem ... the number never gets updated. If you `console.log` in the reducer function you would see the action is getting passed in and we are returning a new state. The problem is that our computed property is cached and we never informed the component about a new value.

To break the cache on the computed property we need to notify the component that it has changed. This brings about the last redux method we need to learn about called `subscribe`. This method will be fired when the store returns the next state of our application. We can wire it up in the `init` function so it will break the cache correctly allowing us to re-render the number.

```js
import Component from '@ember/component';
import { computed } from '@ember/object';
import hbs from 'htmlbars-inline-precompile';
import { createStore } from 'redux';

const reducer = ((state, action) => {
  if(action.type === 'ADD') {
    return state + 1;
  }
  return state || 0;
});

const store = createStore(reducer);

export default Component.extend({
  init: function() {
    this._super(...arguments);
    store.subscribe(() => {
      this.notifyPropertyChange('number');
    });
  },
  number: computed(function() {
    return store.getState();
  }),
  actions: {
    add: function() {
      store.dispatch({type: 'ADD'});
    }
  },
  layout: hbs`
    {{number}}
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

Next, try the [quickstart](/quickstart) to see the ember-redux API in action!

{% endraw %}
