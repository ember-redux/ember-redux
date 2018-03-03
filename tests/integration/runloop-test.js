import { run } from '@ember/runloop';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';

var original, joined, redux;

module('integration: runloop test', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    redux = this.owner.lookup('service:redux');
    joined = false;
    original = run.join;
    run.join = function() {
      joined = true;
      return original.apply(this, arguments);
    };
  });

  hooks.afterEach(function() {
    joined = false;
    run.join = original;
  });

  test('handleChange is invoked inside runloop explicitly', async function(assert) {
    await render(hbs`{{count-list}}`);

    let $parent = this.$('.parent-state');

    assert.equal($parent.text(), 0);

    redux.dispatch({type: 'UP'});

    assert.equal($parent.text(), 1);
  });

  test('handleChange will join an existing runloop when exists', async function(assert) {
    await render(hbs`{{count-list}}`);

    let $parent = this.$('.parent-state');

    assert.equal($parent.text(), 0);

    run(() => {
      redux.dispatch({type: 'UP'});
    });

    assert.equal($parent.text(), 1);
    assert.equal(joined, true);
  });
});
