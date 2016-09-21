import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

export default Ember.Component.extend({
  layout: hbs`
    <button class="random-change" onclick={{action random}}>random</button>
  `
});
