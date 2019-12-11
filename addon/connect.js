import Component from '@ember/component';
import wrapEs2015Class from './es2015-class';

export default (stateToComputed, dispatchToActions=() => ({})) => {
  return IncomingComponent => {
    const WrappedComponent = IncomingComponent || Component;

    return wrapEs2015Class(stateToComputed, dispatchToActions, WrappedComponent);
  };
};
