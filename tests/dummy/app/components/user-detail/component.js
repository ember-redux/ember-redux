import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';
import { connect } from 'ember-redux';

var stateToComputed = (state) => {
  return {
    user: state.users.selected
  };
};

var UserDetailComponent = Component.extend({
  layout: hbs`
    <span style="color: blue;" class="user-detail-name">{{this.user.name}}</span>
  `
});

export default connect(stateToComputed)(UserDetailComponent);
