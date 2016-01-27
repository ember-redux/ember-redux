import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

export default Ember.Component.extend({
  layout: hbs`
    <span class="child-state">{{high}}</span>
    <button class="btn-down" onclick={{down}}>down</button>
  `
});
