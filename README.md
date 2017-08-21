# Ember Redux

[![Travis][build-badge]][build] [![Code Climate][climate-badge]][climate] [![Score][score-badge]][score] [![npm package][npm-badge]][npm]

## Description

[ember-cli][] addon that provides simple [redux][] bindings for [ember.js][]

## Installation

ember redux requires ember-cli v2.4+ and node 6+

```
ember install ember-redux
```

## Documentation

http://www.ember-redux.com/

## Guides

http://www.ember-redux.com/guides/

## Demo

Counting Example (simple)
https://ember-twiddle.com/5bee7478e4216abe49f1c0a439bae352

Yelp Clone (complex)
https://ember-twiddle.com/f17fdcaa48cc99be9f6e3aac6f103191

## Examples

### Container Component

```js
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import { connect } from 'ember-redux';
import getUsersByAccountId from '../reducers';
import fetch from 'fetch';

var stateToComputed = (state, attrs) => {
  return {
    users: getUsersByAccountId(state, attrs.accountId)
  };
};

var dispatchToActions = (dispatch) => {
  return {
    remove: (id) => fetch(`/api/users/${id}`, {method: 'DELETE'}).then(fetched => fetched.json()).then(response => dispatch({type: 'REMOVE_USER', id: id}))
  };
};

var UserListComponent = Ember.Component.extend({
  layout: hbs`
    {{yield users (action "remove")}}
  `
});

export default connect(stateToComputed, dispatchToActions)(UserListComponent);
```

### Presentation Component

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

### Composition

```js
{{#user-list accountId=accountId as |users remove|}}
  {{user-table users=users remove=remove}}
{{/user-list}}
```

## How do I enable time travel debugging?

1. Install the [redux dev tools extension].

2. Enjoy!

## Running Tests

    npm install
    ember test

## License

Copyright © 2017 Toran Billups http://toranbillups.com

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
[redux]: https://github.com/reactjs/redux

[redux dev tools extension]: https://github.com/zalmoxisus/redux-devtools-extension
