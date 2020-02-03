import Component from '@ember/component';
import wrapEs2015Class from './es2015-class';
import octaneConnect from './octane-connect'

function isClassicComponent(component) {
  // Not finding any other better way check component is classic or octane
  return component.toString() === '@ember/component' && component.reopenClass;
}
export default (stateToComputed, dispatchToActions=() => ({})) => {
  return IncomingComponent => {
    const WrappedComponent = IncomingComponent || Component;
    if (isClassicComponent(WrappedComponent)) {
      return wrapEs2015Class(stateToComputed, dispatchToActions, WrappedComponent);
    }
    return octaneConnect(stateToComputed, dispatchToActions, WrappedComponent);
  };
};
