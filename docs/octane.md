---
layout: docs
title: Octane - ember-redux
---
{% raw %}

# Octane

As of ember-redux v6.0 connect now supports both ember components and glimmer components!

To see what glimmer and ember redux look like together checkout the component file below.

```js
import Component from '@glimmer/component';
import { action, computed } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { connect } from 'ember-redux';

const stateToComputed = function(state, attrs) {
  console.log(this.color);

  return {
    number: state.fooz,
    greeting: `Hello ${attrs.name}!`
  };
};

const dispatchToActions = (dispatch) => {
  return {
    up: () => dispatch({type: 'UP'})
  };
};

class MyClazz extends Component {
  @tracked color = 'red';

  @computed('greeting')
  get bar() {
    const someKey = this.greeting;
    return `${someKey} - bazbaz style`;
  }

  @action
  go() {
    this.actions.up();
  }

  constructor() {
    super(...arguments);
    this.color = 'green';
  }
}

export default connect(stateToComputed, dispatchToActions)(MyClazz);
```

{% endraw %}
