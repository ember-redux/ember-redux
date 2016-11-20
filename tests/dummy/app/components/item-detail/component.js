import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import connect from 'ember-redux/components/connect';

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

var ItemDetailComponent = Ember.Component.extend({
  layout: hbs`
    <input class="item-detail-name" value={{item.name}} oninput={{action "nameUpdated" value="target.value"}} />
  `
});

export default connect(ItemDetailComponent, stateToComputed, dispatchToActions);
