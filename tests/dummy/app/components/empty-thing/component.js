import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';
import { connect } from 'ember-redux';

var EmptyThingComponent = Component.extend({
  layout: hbs`
    <span class="empty-state">empty</span>
  `
});

export default connect()(EmptyThingComponent);
