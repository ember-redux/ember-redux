import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';

export default Component.extend({
  layout: hbs`
    <button class="random-change" onclick={{action this.random}}>random</button>
  `
});
