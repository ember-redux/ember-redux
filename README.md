# Ember Redux

[![Travis][build-badge]][build] [![npm package][npm-badge]][npm]

## Description

[ember-cli][] addon that provides simple [redux][] bindings for [ember.js][]

## Installation

```
npm install ember-browserify -D
npm install redux@3 -D
npm install redux-thunk@2 -D
npm install ember-redux -D
```

## Documentation

http://www.ember-redux.com/

## Example Container Component

```js
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import connect from 'ember-redux/components/connect';
import ajax from 'example/utilities/ajax';

var stateToComputed = (state) => {
  return {
    users: state.users.all
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

## Running Tests

    npm install
    bower install
    ember test

## License

Copyright © 2016 Toran Billups http://toranbillups.com

Licensed under the MIT License

[build-badge]: https://img.shields.io/travis/toranb/ember-redux/master.svg?style=flat-square
[build]: https://travis-ci.org/toranb/ember-redux

[npm-badge]: https://img.shields.io/npm/v/ember-redux.svg?style=flat-square
[npm]: https://www.npmjs.org/package/ember-redux

[ember-cli]: http://www.ember-cli.com/
[ember.js]: http://emberjs.com/
[redux]: https://github.com/rackt/redux/
