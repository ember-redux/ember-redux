import { defineProperty } from '@ember/object';
import { core, update, destroy } from './core';
import { inject } from '@ember/service';

export default function wrapEs2015Class(stateToComputed, dispatchToActions, WrappedComponent) {

  defineProperty(WrappedComponent.prototype, 'redux', inject('redux'));

  return class Connect extends WrappedComponent {

    constructor() {
      super(...arguments);
    }

    init() {
      core.call(this, stateToComputed, dispatchToActions);
      super.init(...arguments)
    }

    didUpdateAttrs() {
      super.didUpdateAttrs && super.didUpdateAttrs(...arguments);
      update.call(this);
    }

    willDestroy() {
      super.willDestroy(...arguments);
      destroy.call(this);
    }

  }

}
