import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';
import ajax from 'dummy/utilities/ajax';
import { connect } from 'ember-redux';

var stateToComputed = (state) => {
  return {
    users: state.users.all
  };
};

var dispatchToActions = (dispatch) => {
  return {
    fetch: () => ajax('/api/users', 'GET').then(response => dispatch({type: 'DESERIALIZE_USERS', response: response}))
  };
};

var UserListComponent = Component.extend({
  willRender() {
    this.triggerAction({action: 'fetch', target: this});
  },
  layout: hbs`
    {{#each this.users as |user|}}
      <div class="user-name">{{user.name}}</div>
    {{/each}}
  `
});

export default connect(stateToComputed, dispatchToActions)(UserListComponent);
