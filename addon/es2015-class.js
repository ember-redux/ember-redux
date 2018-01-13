import { core, update, destroy } from './core';
import { inject } from '@ember/service';

export default function wrapEs2015Class(stateToComputed, dispatchToActions, WrappedComponent) {

  WrappedComponent.prototype.redux = inject('redux');

  return class Connect extends WrappedComponent {

    constructor() {
      super(...arguments);
      core.call(this, stateToComputed, dispatchToActions);
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
