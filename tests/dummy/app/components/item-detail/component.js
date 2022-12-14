import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';
import { connect } from 'ember-redux';

var stateToComputed = (state) => {
  return {
    item: state.items.selected
  };
};

var dispatchToActions = (dispatch) => {
  return {
    nameUpdated: (name) => dispatch({type: 'ITEM_NAME_UPDATED', name: name})
  };
};

var ItemDetailComponent = Component.extend({
  layout: hbs`
    <input class="item-detail-name" value={{this.item.name}} oninput={{action "nameUpdated" value="target.value"}} />
  `
});

export default connect(stateToComputed, dispatchToActions)(ItemDetailComponent);
