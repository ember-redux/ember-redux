import Ember from 'ember';
import connect from 'ember-redux/components/connect';
import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent, test } from 'ember-qunit';

const { Component } = Ember;

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

test('stateToComputed is not invoked extraneously', function(assert) {
  let callCount = 0;
  const stateToComputed = () => {
    callCount++;
    return { callCount };
  }
  this.register('component:test-component', connect(stateToComputed)(Component.extend({
    layout: hbs`{{callCount}}`
  })));

  this.render(hbs`{{test-component attr=attr}}`);
  assert.equal(this.$().text(), '1');
  assert.equal(callCount, 1);

  this.set('attr', 'some-change');
  assert.equal(this.$().text(), '2');
  assert.equal(callCount, 2);

  this.get('redux').dispatch({ type: 'FAKE-ACTION' });
  assert.equal(this.$().text(), '3');
  assert.equal(callCount, 3);
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
      return e.message.indexOf('Assertion Failed: Cannot set redux property "low". Try dispatching a redux action instead.') > -1;
    });
  });
});

test('lifecycle hooks are still invoked', function(assert) {
  assert.expect(3);
  this.register('component:test-component', connect()(Component.extend({
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

  this.register('component:test-component-1', connect(null, dispatchToActions)(Component.extend({
    init() {
      this._super(...arguments);
      assert.ok(true, 'should be able to connect components passing `null` to stateToComputed');
    }
  })));

  this.register('component:test-component-2', connect(undefined, dispatchToActions)(Component.extend({
    init() {
      this._super(...arguments);
      assert.ok(true, 'should be able to connect components passing `undefined` to stateToComputed');
    }
  })));

  this.render(hbs`{{test-component-1}}`);
  this.render(hbs`{{test-component-2}}`);
});

test('connecting dispatchToActions as object should dispatch action', function(assert) {
  assert.expect(2);

  const dispatchToActions = {
    up() {
      assert.ok(true, 'should be able to pass object of functions to dispatchToActions');
      return {
        type: 'UP'
      };
    },
    down() {
      assert.ok(true, 'should be able to pass object of functions to dispatchToActions');
      return {
        type: 'DOWN'
      };
    }
  };

  this.register('component:test-dispatch-action-object', connect(undefined, dispatchToActions)(Component.extend({
    init() {
      this._super(...arguments);
    },
    layout: hbs`
      <button class="btn-up" onclick={{action "up"}}>up</button>
      <button class="btn-down" onclick={{action "down"}}>up</button>
    `
  })));

  this.render(hbs`{{test-dispatch-action-object}}`);
  Ember.run(() => {
    this.$('.btn-up').trigger('click');
    this.$('.btn-down').trigger('click');
  });
});

test('calling deprecated methods shows message', function(assert) {
  const warnings = [];

  const originalWarn = Ember.warn;
  Ember.warn = (message, falsy, { id }) => warnings.push({ message, id });

  this.register('component:test-component', connect()(Component.extend({
    init() {
      this.handleChange();
      this.getAttrs();
      this._super(...arguments);
    }
  })));

  this.render(hbs`{{test-component}}`);

  assert.equal(warnings[0].id, 'ember-redux.no-public-handle-change');
  assert.equal(warnings[1].id, 'ember-redux.no-public-get-attrs');

  Ember.warn = originalWarn;
});
