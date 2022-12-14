import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';

export default Component.extend({
  layout: hbs`
    <button class="unrelated-change" onclick={{action this.update}}>update</button>
  `
});
