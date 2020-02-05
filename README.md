# Ember Redux

[![Travis][build-badge]][build] [![Code Climate][climate-badge]][climate] [![Score][score-badge]][score] [![Downloads][downloads-badge]][npm] [![npm package][npm-badge]][npm]

Predictable state management for ember apps

## Installation

ember redux requires ember v3.6+ and node >= 8. If you need support for an older version of ember use the v5 release

```
ember install ember-redux
```

## Documentation and Examples

https://ember-redux.com

## Demo

Counter
https://ember-twiddle.com/5bee7478e4216abe49f1c0a439bae352

TodoMVC
https://ember-twiddle.com/4bb9c326a7e54c739b1f5a5023ccc805

## Usage

### Container Component

```js
import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';
import { connect } from 'ember-redux';
import getUsersByAccountId from '../reducers';
import fetch from 'fetch';

const stateToComputed = (state, attrs) => ({
  users: getUsersByAccountId(state, attrs.accountId)
});

const dispatchToActions = (dispatch) => ({
  remove: (id) => fetch(`/api/users/${id}`, {method: 'DELETE'}).then(fetched => fetched.json()).then(response => dispatch({type: 'REMOVE_USER', id: id}))
});

const UserListComponent = Component.extend({
  layout: hbs`
    {{yield users (action "remove")}}
  `
});

export default connect(stateToComputed, dispatchToActions)(UserListComponent);
```

### Presentation Component

```js
import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';

const UserTableComponent = Component.extend({
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

## Octane Support?

As of version 6 ember-redux now supports both ember component and glimmer component. One brief example of glimmer components and ember redux below.

```js
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { connect } from 'ember-redux';
import getUsersByAccountId from '../reducers';
import fetch from 'fetch';

const stateToComputed = (state, attrs) => ({
  users: getUsersByAccountId(state, attrs.accountId)
});

const dispatchToActions = (dispatch) => ({
  remove: (id) => fetch(`/api/users/${id}`, {method: 'DELETE'}).then(fetched => fetched.json()).then(response => dispatch({type: 'REMOVE_USER', id: id}))
});

class MyClazz extends Component {
  @action
  example() {
    this.actions.remove();
  }
}

export default connect(stateToComputed, dispatchToActions)(MyClazz);
```

## How do I enable time travel debugging?

1. Install the [redux dev tools extension].

2. Enjoy!

## Running Tests

    yarn
    ember test

## License

Copyright © 2019 Toran Billups https://toranbillups.com

Licensed under the MIT License

[build-badge]: https://travis-ci.org/ember-redux/ember-redux.svg?branch=master
[build]: https://travis-ci.org/ember-redux/ember-redux

[npm-badge]: https://img.shields.io/npm/v/ember-redux.svg?style=flat-square
[npm]: https://www.npmjs.org/package/ember-redux

[climate-badge]: https://codeclimate.com/github/ember-redux/ember-redux/badges/gpa.svg
[climate]: https://codeclimate.com/github/ember-redux/ember-redux

[score-badge]: https://emberobserver.com/badges/ember-redux.svg
[score]: https://emberobserver.com/addons/ember-redux

[downloads-badge]: https://img.shields.io/npm/dm/ember-redux.svg

[redux]: https://github.com/reactjs/redux

[redux dev tools extension]: https://github.com/zalmoxisus/redux-devtools-extension
