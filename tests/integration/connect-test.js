import Ember from 'ember';
import connect from 'ember-redux/components/connect';
import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('count-list', 'integration: connect test', {
  integration: true,
  setup() {
    this.inject.service('redux');
  }
});

test('should render parent component with one state and child component with another', function(assert) {
  this.render(hbs`{{count-list}}`);
  let $parent = this.$('.parent-state');
  let $child = this.$('.child-state');
  assert.equal($parent.text(), 0);
  assert.equal($child.text(), 9);
  Ember.run(() => {
    this.$('.btn-up').trigger('click');
  });
  assert.equal($parent.text(), 1);
  assert.equal($child.text(), 9);
  Ember.run(() => {
    this.$('.btn-up').trigger('click');
  });
  assert.equal($parent.text(), 2);
  assert.equal($child.text(), 9);
  Ember.run(() => {
    this.$('.btn-down').trigger('click');
  });
  assert.equal($parent.text(), 2);
  assert.equal($child.text(), 8);
  Ember.run(() => {
    this.$('.btn-down').trigger('click');
  });
  assert.equal($parent.text(), 2);
  assert.equal($child.text(), 7);
});

test('should render attrs', function(assert) {
  assert.expect(2);
  this.set('myName', 'Dustin');
  this.render(hbs`{{count-list name=myName}}`);

  assert.equal(this.$('.greeting').text(), 'Welcome back, Dustin!', 'should render attrs provided to component');

  this.set('myName', 'Toran');

  assert.equal(this.$('.greeting').text(), 'Welcome back, Toran!', 'should rerender component if attrs change');
});

test('stateToComputed will provide `this` context that is the component instance (when not using [phat]Arrow function)', function(assert) {
  assert.expect(1);

  this.render(hbs`{{count-list}}`);

  assert.equal(this.$('.serviced').text(), 'true', 'should render the prop provided by component instance');
});

test('stateToComputed can be used with component level CP if notifyPropertyChange invoked during didUpdateAttrs', function(assert) {
  assert.expect(2);

  this.set('dynoNameValue', 'Toran');
  this.render(hbs`{{count-list dynoNameValue=dynoNameValue}}`);

  assert.equal(this.$('.dyno').text(), 'name: Toran', 'should render the local component value');

  this.set('dynoNameValue', 'Tom');

  assert.equal(this.$('.dyno').text(), 'name: Tom', 'should render new value when local component CP changed and notifyPropertyChange invoked');
});

test('the component should truly be extended meaning actions map over as you would expect', function(assert) {
  this.render(hbs`{{count-list}}`);
  let $random = this.$('.random-state');
  assert.equal($random.text(), '');
  Ember.run(() => {
    this.$('.btn-random').trigger('click');
  });
  assert.equal($random.text(), 'blue');
});

test('each computed is truly readonly', function(assert) {
  assert.expect(1);
  this.render(hbs`{{count-list}}`);
  Ember.run(() => {
    assert.throws(() => {
      this.$('.btn-alter').trigger('click');
    }, (e) => {
      return e.message.indexOf('Cannot set read-only property') > -1;
    });
  });
});

test('lifecycle hooks are still invoked', function(assert) {
  assert.expect(3);
  this.register('component:test-component', connect()(Ember.Component.extend({
    init() {
      assert.ok(true, 'init is invoked');
      this._super(...arguments);
    },

    didUpdateAttrs() {
      assert.ok(true, 'didUpdateAttrs should be invoked');
      this._super(...arguments);
    },

    willDestroy() {
      assert.ok(true, 'willDestroy is invoked');
      this._super(...arguments);
    }
  })));

  this.render(hbs`{{test-component name=name}}`);

  this.set('name', 'Dustin');
});

test('connecting dispatchToActions only', function(assert) {
  assert.expect(2);
  const dispatchToActions = () => {};

  this.register('component:test-component-1', connect(null, dispatchToActions)(Ember.Component.extend({
    init() {
      this._super(...arguments);
      assert.ok(true, 'should be able to connect components passing `null` to stateToComputed');
    }
  })));

  this.register('component:test-component-2', connect(undefined, dispatchToActions)(Ember.Component.extend({
    init() {
      this._super(...arguments);
      assert.ok(true, 'should be able to connect components passing `undefined` to stateToComputed');
    }
  })));

  this.render(hbs`{{test-component-1}}`);
  this.render(hbs`{{test-component-2}}`);
});
