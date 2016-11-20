import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import connect from 'ember-redux/components/connect';

var stateToComputed = (state) => {
  return {
    user: state.users.selected
  };
};

var UserDetailComponent = Ember.Component.extend({
  layout: hbs`
    <span style="color: blue;" class="user-detail-name">{{user.name}}</span>
  `
});

export default connect(UserDetailComponent, stateToComputed);
