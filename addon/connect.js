import Component from '@ember/component';
import wrapEmberObject from './ember-object';
import wrapEs2015Class from './es2015-class';

export default (stateToComputed, dispatchToActions=() => ({})) => {
  return IncomingComponent => {
    const WrappedComponent = IncomingComponent || Component;

    if(WrappedComponent.hasOwnProperty('extend')) {
      return wrapEmberObject(stateToComputed, dispatchToActions, WrappedComponent);
    }

    return wrapEs2015Class(stateToComputed, dispatchToActions, WrappedComponent);
  };
};
