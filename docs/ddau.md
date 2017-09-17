---
layout: docs
title: Data Down, Actions Up - ember-redux
---

{% raw %}

# Data Down, Actions Up

All of the examples so far have shown a single component but in real applications we build a tree of components each with a variety of responsibilities. In this short tutorial I hope to explain how redux has better informed my component design in ember by requiring the data down actions up paradigm.

Before we dive into code it's worth describing how components have evolved over the last year. I'm sure it goes without saying but to be totally clear, I did not coin any terms or ideas you will hear about below. [Dan Abramov][] in particular has done a phenomenal job outlining what I now believe to be the foundation of modern component design in a [blog][] he wrote back in early 2015. I highly recommend reading more about his opinion on the subject as a primer.

The core concept is that we should separate the responsibility of components into 2 groups. The first group is given the label `Container Components` and they act like the "backend of the frontend" in a way. They will be "connected" to the datasource and delegate to other components for any html that is rendered on the page. The second group is given the label `Presentational Components` and as you can probability guess the only job they have is to render html given some object/data.

I took the diagram below from the [react-redux][] documentation because it clearly shows how each type of component operates.

|                    | Presentational Components     | Container Components                          |
| ------------------ | ----------------------------- | --------------------------------------------- |
| **Purpose**        | How things look (html/css)    | How things work (data fetching/state updates) |
| **Aware of redux** | No                            | Yes                                           |
| **To read data**   | Read data from incoming attrs | Subscribe to Redux state                      |
| **To change data** | closure actions               | Dispatch Redux actions                        |

I've personally seen two big benefits after adopting this strict separation in production apps. The first is that teams can more easily reuse the `Presentation Components` because they are nothing more than html/css. Over time this will allow the team to amass a great component library that is more composable allowing even greater code sharing across the organization. The second benefit is that teams can more easily upgrade the infrastructure that powers data flow throughout the application. Because this code is isolated in the `Container Components` we don't need to untangle the plumbing code from the html/css that displays it. So you want to swap your global store for an ember service? No problem! We just modify the entry point in the `Container Components` and the data still flows down to any `Presentational Components` like it did before the refactor.

To illustrate this with an example I decided to build a minimal grid view component and show the steps involved. I felt this was a great way to put "data down actions up" on display for anyone with doubts about this approach.

**Show me the code**

Like any modern ember application we always start by defining a route.

```js
//app/router.js
import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('users', { path: '/' });
});

export default Router;
```

With the route in place we now need to fire an async network request to fetch the list of user data. In classic ember we would use the identity map or "store" abstraction (ember-data/ember-model/ember-cli-simple-store) but in this example we are using redux and want to send an action up with the response upon success so the reducer can do it's work. I'm using a very simple [ajax][] helper but you can use anything you like here so long as it's "then-able".

```js
//app/users/route.js

import { route } from 'ember-redux';
import ajax from 'example/utilities/ajax';

var model = (dispatch) => {
  return ajax('/api/users', 'GET').then(response => dispatch({type: 'DESERIALIZE_USERS', response: response}));
};

export default route({model})();
```

The end result is the same as anything you've done in ember previously but you no doubt noticed that the model hook is now a function we pass into the `route` function from ember-redux. This pattern isn't a hard requirement so if you prefer [idiomatic][] ember you can always inject the redux service and use dispatch directly.

When the ajax request has resolved we dispatch an action to the redux store with a type of `DESERIALIZE_USERS` and the http response. We later deserialize that response and return the data as part of the next state of our application using the reducer function (shown below).

```js
//app/reducers/users.js
import { uniq, remove } from 'example/utilities/array';

const initialState = {
  all: []
};

export default ((state, action) => {
  if (action.type === 'DESERIALIZE_USERS') {
    return Object.assign({}, state, {
      all: uniq(state.all, action.response)
    });
  }
  if (action.type === 'REMOVE_USER') {
    return Object.assign({}, state, {
      all: remove(state.all, action.id)
    });
  }
  return state || initialState;
});
```

The reducer has a code path for storing each user in the object literal using the key `all`. Inside the conditional we use a simple [array][] helper to ensure we get a basic merge of the current state and json response. One of the key ideas in redux is that we shouldn't mutate the current state so we also use `Object.assign` here to avoid any side effects. The returned value from the reducer function represents the next state. It's important to note that this new state will live independent from the previous. In similar fashion the code path for removing a user will avoid side effects with help from the [array][] helper function `remove`.

This reducer is fine but without an entry in the index.js file (found in the reducers directory) it will never be executed. Simply import the users reducer function and export it with a key of `users`.

```js
//app/reducers/index.js
import { combineReducers } from 'redux';
import users from 'example/reducers/users';

export default combineReducers({
  users
});
```

Before we can start building the component tree we need to add the template file for the users route and define the `users-list` component.

```js
//app/users/template.hbs

{{users-list}}
```

Now that we have fetched the data we declare the `Container Component` that will be redux aware.

```js
//app/components/users-list/component.js

import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import { connect } from 'ember-redux';
import fetch from 'fetch';

var stateToComputed = (state) => {
  return {
    users: state.users.all
  };
};

var dispatchToActions = (dispatch) => {
  return {
    remove: (id) => fetch(`/api/users/${id}`, {method: 'DELETE'}).then(fetched => fetched.json()).then(response => dispatch({type: 'REMOVE_USER', id: id}))
  };
};

var UserListComponent = Ember.Component.extend({
  layout: hbs`
    {{users-table users=users remove=(action "remove")}}
  `
});

export default connect(stateToComputed, dispatchToActions)(UserListComponent);
```

The component itself maps the state of redux to a computed called `users` and the remove function to an action. Notice we don't use that array or action directly in this component. Instead we pass the data and closure action down to a `Presentational Component` that will be responsible for rendering the html.

```js
//app/components/users-table/component.js

import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

var UserTableComponent = Ember.Component.extend({
  layout: hbs`
    {{#each users as |user|}}
      <div>{{user.name}}</div>
      <button onclick={{action remove user.id}}>remove</button>
    {{/each}}
  `
});

export default UserTableComponent;
```

The big difference between this component and the `users-list` component is that we know nothing about redux here. The blessing of this constraint is that we don't need to be concerned with how we got the `users` array or the `remove` action. This components entire role is to transform an array of plain javascript objects into the html representation.

**Maximum reuse!**

Now that we have the basics down we can iterate once more to enable maximum reuse. In real ember apps the `Container Components` shouldn't hard code the presentation component directly as you see above. Instead if we `yield` up the state and actions our development team(s) can more easily mix and match components.

First remove the hard coded `users-table` component from the layout of `users-list`. Next add a yield statement passing out both the users and the remove action.

```js
//app/components/users-list/component.js

var UserListComponent = Ember.Component.extend({
  layout: hbs`
    {{yield users (action "remove")}}
  `
});
```

Finally in the users template itself we declare the `Presentational Component` inside the `Container Component` and use anything we yielded out.

```js
//app/users/template.hbs

{{#users-list as |users remove|}}
  {{users-table users=users remove=remove}}
{{/users-list}}
```

This pattern has greatly improved reuse and simplicity in my ember applications. Even if you don't use ember-redux this example should serve as a good reminder of the advantages behind "data down actions up".

The full ember application for this example is available on [github][]

**Note**: When designing your first component it's often best to solve the problem in front of you, then refactor to a more modular design as needed. I've seen this pattern taken to an extreme so I wanted to share my favorite quote from [Sandi Metz][] as a word of caution.

> "prefer duplication over the wrong abstraction"

Next learn about the different extension points by reading the [configuration](/configure) documentation!

[Dan Abramov]: https://twitter.com/dan_abramov
[blog]: https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0
[react-redux]: http://redux.js.org/docs/basics/UsageWithReact.html
[Sandi Metz]: http://www.sandimetz.com/blog/
[ajax]: https://gist.github.com/toranb/0b4023a181ccc5869ac740894c9d2d63
[array]: https://gist.github.com/toranb/b661b53f9ab277ef8d4041cebe770414
[idiomatic]: https://gist.github.com/toranb/8bf0b62841051dc64f1fa81299526a0a
[github]: https://github.com/toranb/ember-redux-ddau-example

{% endraw %}
