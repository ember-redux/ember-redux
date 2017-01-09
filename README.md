# Ember Redux

[![Travis][build-badge]][build] [![Code Climate][climate-badge]][climate] [![Score][score-badge]][score] [![npm package][npm-badge]][npm]

## Description

[ember-cli][] addon that provides simple [redux][] bindings for [ember.js][]

## Installation

```
ember install ember-redux
```

## Documentation

http://www.ember-redux.com/

## Demo

Counting Example (simple)
https://ember-twiddle.com/7ce3446b14f166f04064eba663c0a350

Yelp Clone (complex)
https://ember-twiddle.com/64b18c23223fbc1f3a7da8171c6d8881

## Example Container Component

```js
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import connect from 'ember-redux/components/connect';
import ajax from 'example/utilities/ajax';
import getUsersByAccountId from '../reducers';

var stateToComputed = (state, attrs) => {
  return {
    users: getUsersByAccountId(state, attrs.accountId)
  };
};

var dispatchToActions = (dispatch) => {
  return {
    remove: (id) => ajax(`/api/users/${id}`, 'DELETE').then(() => dispatch({type: 'REMOVE_USER', id: id}))
  };
};

var UserListComponent = Ember.Component.extend({
  layout: hbs`
    {{yield users (action "remove")}}
  `
});

export default connect(stateToComputed, dispatchToActions)(UserListComponent);
```

## Example Presentation Component

```js
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

## Example Composition
```js
{{#user-list accountId=accountId as |users remove|}}
  {{user-table users=users remove=remove}}
{{/user-list}}
```

## How do I enable time travel debugging?

    1) install the redux chrome dev tools plugin
    2) add a folder named enhancers with one file named index.js
    3) in that file add 3 lines of code

```js
//app/enhancers/index.js
import redux from 'redux';
var devtools = window.devToolsExtension ? window.devToolsExtension() : f => f;
export default redux.compose(devtools);
```

## Running Tests

    npm install
    bower install
    ember test

## License

Copyright © 2016 Toran Billups http://toranbillups.com

Licensed under the MIT License

[build-badge]: https://travis-ci.org/ember-redux/ember-redux.svg?branch=master
[build]: https://travis-ci.org/ember-redux/ember-redux

[npm-badge]: https://img.shields.io/npm/v/ember-redux.svg?style=flat-square
[npm]: https://www.npmjs.org/package/ember-redux

[climate-badge]: https://codeclimate.com/github/ember-redux/ember-redux/badges/gpa.svg
[climate]: https://codeclimate.com/github/ember-redux/ember-redux

[score-badge]: http://emberobserver.com/badges/ember-redux.svg
[score]: http://emberobserver.com/addons/ember-redux

[ember-cli]: http://www.ember-cli.com/
[ember.js]: http://emberjs.com/
[redux]: https://github.com/rackt/redux/
