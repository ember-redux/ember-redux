import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';

export default Component.extend({
  layout: hbs`
    <span class="child-state">{{this.high}}</span>
    <button class="btn-down" onclick={{this.down}}>down</button>
  `
});
