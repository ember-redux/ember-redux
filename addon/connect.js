import Component from '@ember/component';
import wrapEmberObject from './ember-object';
import wrapEs2015Class from './es2015-class';
import wrapEs2019Class from './es2019-class';
import { gte } from 'ember-compatibility-helpers';

export default (stateToComputed, dispatchToActions=() => ({})) => {
  return IncomingComponent => {
    const WrappedComponent = IncomingComponent || Component;

    let emberObject = true;

    if (gte('3.6.0')) {
      emberObject = WrappedComponent.extend;
    } else {
      try {
        WrappedComponent();
      } catch(e) {
        if (e && e.message.indexOf('constructor') > 0) {
          emberObject = false;
        }
      }
    }

    if(WrappedComponent.hasOwnProperty('extend') || emberObject) {
      return wrapEmberObject(stateToComputed, dispatchToActions, WrappedComponent);
    } else {
      if (gte('3.6.0')) {
        return wrapEs2019Class(stateToComputed, dispatchToActions, WrappedComponent);
      }
      return wrapEs2015Class(stateToComputed, dispatchToActions, WrappedComponent);
    }

  };
};
