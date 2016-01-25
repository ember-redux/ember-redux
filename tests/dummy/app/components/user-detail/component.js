import Ember from 'ember';
import connect from 'ember-redux/components/connect';

var stateToComputed = (state) => {
    return {
        user: state.users.selected
    };
};

var UserDetailComponent = Ember.Component.extend();

export default connect(stateToComputed)(UserDetailComponent);
