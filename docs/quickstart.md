---
layout: docs
title: Quickstart - ember-redux
---
{% raw %}

# Quickstart

Now that you have the hang of this redux thing lets take a look at what building that same component would look like using the `ember-redux` addon!

The first step is to remove the redux import and `createStore` code that is declared outside of the component. We won't need this anymore because the addon does the heavy lifting for us.

Next we need to move the reducer itself by creating a new folder called `reducers`. Inside this folder we need a single file with the name `index.js` (as it's the only reducer by default at the moment). Notice I'm also exporting this out with an object because in a real application we won't just have one reducer function.

```js
//app/reducers/index.js

import { combineReducers } from 'redux';

const number = (state, action) => {
  if (action.type === 'ADD') {
    return state + 1;
  }
  return state || 0;
};

export default combineReducers({
  number
});
```

After we've got our reducer setup we need to remove the computed and action we created manually and replace them with a function that will be given state/dispatch directly.

```js
//app/components/number-count.js

import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';
import { connect } from 'ember-redux';

const stateToComputed = (state) => {
  return {
    number: state.number
  };
};

const dispatchToActions = (dispatch) => {
  return {
    add: () => dispatch({type: 'ADD'})
  };
};

const NumbersComponent = Component.extend({
  layout: hbs`
    {{number}}
    <button onclick={{action "add"}}>add</button>
  `
});

export default connect(
  stateToComputed,
  dispatchToActions
)(NumbersComponent);
```

And finally you will notice we use a new helper called `connect` to return a new component given the 2 functions that map the computed and actions.

Next try this [example](https://ember-twiddle.com/2d98cd4418b7df5cbce6c5213351d31e) in your web browser with ember-twiddle! Then continue reading about how to apply [data down/ actions up](/ddau) with ember-redux!

{% endraw %}
