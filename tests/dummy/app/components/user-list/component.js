import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';
import { connect } from 'ember-redux';

var stateToComputed = (state) => {
  return {
    users: state.users.all
  };
};

var UserListComponent = Component.extend({
  layout: hbs`
    {{#each this.users as |user|}}
      <div class="user-name">{{user.name}}</div>
      <LinkTo @route="users.detail" @model={{user.id}} class="user-detail-link">details</LinkTo>
    {{/each}}
    {{outlet}}
  `
});

export default connect(stateToComputed)(UserListComponent);
