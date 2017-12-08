import { core, update, destroy } from './core';
import { inject } from '@ember/service';

export default function wrapEmberObject(stateToComputed, dispatchToActions, WrappedComponent) {

  return WrappedComponent.extend({
    redux: inject('redux'),

    init() {
      core.call(this, stateToComputed, dispatchToActions);
      this._super(...arguments);
    },

    didUpdateAttrs() {
      this._super(...arguments);
      update.call(this);
    },

    willDestroy() {
      this._super(...arguments);
      destroy.call(this);
    }

  });

}
