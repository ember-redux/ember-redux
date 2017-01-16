{% raw %}

# Cookbook

**Using ember services to manage complex action creation**

There's many reasons why you might want to do this:

1. You want to share action creation logic between components
2. You want access to other services within the ember container
3. You want a service to keep a long lived reference, e.g. to a channel on a websocket

```js
//app/services/todos.js
export default Ember.Service.extend({
  redux: Ember.inject.service(),
  channels: Ember.inject.service(),

  add(name) {
    let {redux, channels} = this.getProperties('redux', 'channels');
    let todoId = uuid();
    redux.dispatch({type: 'ADD_TODO_REQUESTED', todoId});
    channels.get('todos').add(name)
      .receive('ok', resp => redux.dispatch({type: 'ADD_TODO_COMPLETED', todoId}))
      .receive('error', resp => redux.dispatch({type: 'ADD_TODO_FAILED', todoId}));
  }
});
```

```js
//app/components/todos-list.js
export default Ember.Component.extend({
  todos: Ember.inject.service(),

  actions: {
    add(name) {
      this.get('todos').add(name);
    }
  }
});
```

{% endraw %}
