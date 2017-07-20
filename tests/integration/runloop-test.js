import { run } from '@ember/runloop';
import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';

var original, joined;

moduleForComponent('count-list', 'integration: runloop test', {
  integration: true,
  setup() {
    this.inject.service('redux');

    joined = false;
    original = Ember.run.join;
    Ember.run.join = function() {
      joined = true;
      return original.apply(this, arguments);
    };
  },
  teardown() {
    joined = false;
    Ember.run.join = original;
  }
});

test('handleChange is invoked inside runloop explicitly', function(assert) {
  this.render(hbs`{{count-list}}`);

  let $parent = this.$('.parent-state');

  assert.equal($parent.text(), 0);

  this.redux.dispatch({type: 'UP'});

  assert.equal($parent.text(), 1);
});

test('handleChange will join an existing runloop when exists', function(assert) {
  this.render(hbs`{{count-list}}`);

  let $parent = this.$('.parent-state');

  assert.equal($parent.text(), 0);

  run(() => {
    this.redux.dispatch({type: 'UP'});
  });

  assert.equal($parent.text(), 1);
  assert.equal(joined, true);
});
