import Ember from 'ember';
import connect from 'ember-redux/components/connect';

var EmptyThingComponent = Ember.Component.extend();

export default connect()(EmptyThingComponent);
