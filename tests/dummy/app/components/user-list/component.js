import Ember from 'ember';
import connect from 'ember-redux/components/connect';

var stateToComputed = (state) => {
    return {
        users: state.users.all
    };
};

var UserListComponent = Ember.Component.extend();

export default connect(stateToComputed)(UserListComponent);
