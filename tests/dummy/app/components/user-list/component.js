import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import connect from 'ember-redux/components/connect';

var stateToComputed = (state) => {
  return {
    users: state.users.all
  };
};

var UserListComponent = Ember.Component.extend({
  layout: hbs`
    {{#each users as |user|}}
      <div class="user-name">{{user.name}}</div>
      {{#link-to 'users.detail' user.id class='user-detail-link'}}details{{/link-to}}
    {{/each}}
    {{outlet}}
  `
});

export default connect(stateToComputed)(UserListComponent);
