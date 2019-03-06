import Component from '@ember/component';
import wrapEmberObject from './ember-object';
import wrapEs2019Class from './es2019-class';

export default (stateToComputed, dispatchToActions=() => ({})) => {
  return IncomingComponent => {
    const WrappedComponent = IncomingComponent || Component;

    if(WrappedComponent.hasOwnProperty('extend')) {
      return wrapEmberObject(stateToComputed, dispatchToActions, WrappedComponent);
    }

    return wrapEs2019Class(stateToComputed, dispatchToActions, WrappedComponent);
  };
};
