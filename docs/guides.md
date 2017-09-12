---
layout: docs
---
{% raw %}

# JavaScript Guide

If you prefer to skip ahead and read the source code check it out on <a href="https://github.com/ember-redux/guides/commits/master">github</a>

**Feature 1: Display a list of restaurants**

Before we start writing any code we need to install a few dependencies

```bash
ember install ember-redux
ember install ember-fetch
```

To begin we define a route for the restaurants listing

```js
//app/router.js
Router.map(function() {
  this.route('restaurants', {path: '/'});
});
```

In the route itself we use ember-fetch to make the network call. When this has completed we dispatch the event to redux with the response

```js
//app/routes/restaurants.js
import fetch from 'fetch';
import { route } from 'ember-redux';

var model = dispatch => {
  return fetch('/api/restaurants')
    .then(fetched => fetched.json())
    .then(response => dispatch({
      type: 'RESTAURANTS:TRANSFORM_LIST',
      response: response.restaurants
    }));
};

export default route({model})();
```

Before we write the code to handle this response we must add an index reducer to combine all of our application reducers

```js
//app/reducers/index.js
import { combineReducers } from 'redux';
import restaurants from './restaurants';

export default combineReducers({
  restaurants
});

```

Now in the restaurants reducer we first convert the array of restaurants returned from ember-cli-mirage into an object. Next we merge that object with any existing restaurant data that might already be loaded. Finally we return a new state that our application can use to display the restaurants with

```js
//app/reducers/restaurants.js
import _ from 'lodash';

const initialState = {
  all: undefined
};

export default ((state, action) => {
  switch(action.type) {
    case 'RESTAURANTS:TRANSFORM_LIST': {
      const restaurants = _.keyBy(action.response, restaurant => restaurant.id);
      const merged = _.extend({}, state.all, restaurants);
      return Object.assign({}, state, {all: merged});
    }
    default: {
      return state || initialState;
    }
  }
});
```
Next we add a presentation component to loop over this object and display each restaurant name
```js
//app/templates/components/restaurant-list.hbs
<ul>
  {{#each-in restaurants as |key restaurant|}}
    <li>{{restaurant.name}}</li>
  {{/each-in}}
</ul>
```

Because the restaurant-list component is html only we need a parent component that is redux aware. We use the connect function here to return a new component that provides us with the restaurants currently living in the redux store

```js
//app/components/restaurant-items.js
import Ember from 'ember';
import { connect } from 'ember-redux';

var stateToComputed = (state) => {
  return {
    restaurants: state.restaurants.all
  };
};

export default connect(stateToComputed)(Ember.Component);
```
Because we want to expose the restaurants we need to yield that data in the template

```js
//app/templates/components/restaurant-items.hbs
{{yield restaurants}}
```

The last step is to wire up both components in the routes controller template

```js
//app/templates/restaurants.hbs
{{#restaurant-items as |restaurants|}}
  {{restaurant-list restaurants=restaurants}}
{{/restaurant-items}}
```

<p>Want the source code for part 1? You can find this commit up on <a href="https://github.com/ember-redux/guides/commit/59126b6a227c2c8d080f2e687fbb4f411b7dedb8">github</a></p>

**Feature 2: Display restaurant details**

To begin we define a nested detail route for restaurants

```js
//app/router.js
Router.map(function() {
  this.route('restaurants', {path: '/'}, function() {
    this.route('detail', {path: '/detail/:id'});
  });
});
```

Next we define the detail route itself. Similar to the list route in part 1, we again use ember-fetch to make the network call. When this has completed we dispatch the event to redux with the response

```js
//app/routes/restaurants/detail.js
import fetch from 'fetch';
import { route } from 'ember-redux';

var model = (dispatch, params) => {
  return fetch(`/api/restaurants/${params.id}`)
    .then(fetched => fetched.json())
    .then(response => dispatch({
      type: 'RESTAURANTS:TRANSFORM_DETAIL',
      response: response.restaurants
    }));
};

export default route({model})();
```
Next we need to handle this event in the reducer. We start by creating an object that we then merge into the existing state tree. Finally a new state is returned but in addition to the restaurant details we also set a selectedId value to help us track the active restaurant
```js
//app/reducers/restaurants.js
export default ((state, action) => {
  switch(action.type) {
    // other reducer code from part 1
    case 'RESTAURANTS:TRANSFORM_DETAIL': {
      const restaurant = {[action.response.id]: action.response};
      const merge = _.extend({}, state.all, restaurant);
      return Object.assign({}, state, {
        all: merge,
        selectedId: action.response.id
      });
    }
  }
});
```

We want to show the reviews for a given restaurant when the detail route is active. To start we should add some review data to the ember-cli-mirage fixture

```js
//mirage/fixtures/restaurants.js
export default [
  {id: 1, name: 'Tacopocalypse', reviews: [{id: 9, rating: 5}]},
  {id: 2, name: 'Fuzzy’s Taco Shop', reviews: [{id: 8, rating: 3}]},
  {id: 3, name: 'El Bait Shop', reviews: []}
];
```

Next the user needs a link to activate the detail route so in our restaurant-list component we will add a link-to like so

```js
//app/templates/components/restaurant-list.hbs
<ul>
  {{#each-in restaurants as |key restaurant|}}
    <li>{{#link-to "restaurants.detail" restaurant.id}}{{restaurant.name}}{{/link-to}}</li>
  {{/each-in}}
</ul>
```

Now we add a presentation component that will display the reviews

```js
//app/templates/components/restaurant-detail.hbs
<ul>
  {{#each restaurant.reviews as |review|}}
    <li>{{review.rating}} ★</li>
  {{else}}
    <li>no reviews</li>
  {{/each}}
</ul>
```

And to provide the reviews for this presentation component we will add another parent component that is redux aware

```js
//app/components/restaurant-item.js
import Ember from 'ember';
import { connect } from 'ember-redux';
import _ from 'lodash';

var stateToComputed = (state) => {
  return {
    restaurant: _.get(state.restaurants.all, state.restaurants.selectedId)
  };
};

export default connect(stateToComputed)(Ember.Component);
```

We then yield this restaurant from the template

```js
//app/templates/components/restaurant-item.hbs
{{yield restaurant}}
```

And finally we add a detail controller template and wire up the parent and child components

```js
//app/templates/restaurants/detail.hbs
{{#restaurant-item as |restaurant|}}
  {{restaurant-detail restaurant=restaurant}}
{{/restaurant-item}}
```

<p>Want the source code for part 2? You can find this commit up on <a href="https://github.com/ember-redux/guides/commit/b4e29f597ed5b29fc47968e6632e8ced023bd25f">github</a></p>

**Refactor: Use reselect to encapsulate**

One problem we have with both the list and detail parent components right now is that they know the internal structure of the redux state tree. If we ever wanted to restructure this we would very likely need to touch the component files. The goal of <a href="https://github.com/reactjs/reselect">reselect</a> is to provide an interface for components that need state without leaking the details of how that state is structured. We start by adding the reselect dependency

```bash
ember install ember-reselect-shim
```

Next we add the custom selectors in the reducer file. If you are familiar with computed properties in ember you can think of each selector below in much the same way. If the inputs to any selector have changed the value will be recalculated. If not, you will get a cached value back

```js
//app/reducers/restaurants.js
import _ from 'lodash';
import reselect from 'reselect';

const { createSelector } = reselect;

const all = state => state.restaurants.all;
const selectedId = state => state.restaurants.selectedId;

export const getRestaurants = createSelector(
  all,
  (all) => all
);

export const getSelectedRestaurant = createSelector(
  all,
  selectedId,
  (all, selectedId) => _.get(all, selectedId)
);
```

Now in the detail component we use the getSelectedRestaurant selector

```js
//app/components/restaurant-item.js
import Ember from 'ember';
import { connect } from 'ember-redux';
import { getSelectedRestaurant } from '../reducers/restaurants';

var stateToComputed = (state) => {
  return {
    restaurant: getSelectedRestaurant(state)
  };
};

export default connect(stateToComputed)(Ember.Component);
```

And in the list component we can use the getRestaurants selector

```js
//app/components/restaurant-items.js
import Ember from 'ember';
import { connect } from 'ember-redux';
import { getRestaurants } from '../reducers/restaurants';

var stateToComputed = (state) => {
  return {
    restaurants: getRestaurants(state)
  };
};

export default connect(stateToComputed)(Ember.Component);
```

If this feels a little silly at first glance just keep in mind that as your application grows you will be thankful you didn't expose any implementation details about the store because of the freedom this contract affords you at refactor time

<p>Want the source code for part 3? You can find this commit up on <a href="https://github.com/ember-redux/guides/commit/6e5286cd2ac04d4219e15effa8824f1753854e2f">github</a></p>

**Refactor: Use normalizr to expose reviews**

One problem with the reducer is that we have a nested relationship between restaurant => reviews. Ideally we should avoid nested data structures like this when using redux. One great reason to avoid nested structures can be seen by looking at our detail component markup

```js
//app/templates/components/restaurant-detail.hbs
<ul>
  {{#each restaurant.reviews as |review|}}
    <li>{{review.rating}} ★</li>
  {{else}}
    <li>no reviews</li>
  {{/each}}
</ul>
```

If we look critically at this template we can identify a <a href="https://en.wikipedia.org/wiki/Law_of_Demeter">law of demeter violation</a>. We have passed the restaurant but only use it to pull off a reviews property and loop over it. Beyond this violation, the real problem here is that if our restaurant name changes a notifyPropertyChange event will fire when in truth we only care to re-render if a review is added/removed/updated. To start install the <a href="https://github.com/paularmstrong/normalizr">normalizr</a> dependency

```bash
ember install ember-cli-normalizr-shim
```

Next we want to define a schema in the reducer to help us break apart this nested structure

```js
//app/reducers/restaurants.js
import { normalize, schema } from 'normalizr';

const reviewSchema = new schema.Entity('reviews');
const restaurantSchema = new schema.Entity('restaurants', {
  reviews: [reviewSchema]
});
```
The real work involved here is that now we need to normalize the data in each reducer and as a result we end up with two top level structures instead of "all restaurants"

```js
//app/reducers/restaurants.js
export default ((state, action) => {
  switch(action.type) {
    case 'RESTAURANTS:TRANSFORM_LIST': {
      const normalized = normalize(action.response, [restaurantSchema]);
      const { restaurants, reviews } = normalized.entities;
      const merged = _.extend({}, state.all, _.keyBy(restaurants, r => r.id));
      const mergedReviews = _.extend({}, state.reviews, _.keyBy(reviews, r => r.id));
      return Object.assign({}, state, {
        all: merged,
        reviews: mergedReviews
      });
    }
```

The upside here is that our data structure looks like this now. Keep in mind the big win here is that we can subscribe to changes on reviews without having to listen for changes to the restaurant

```js
{
  restaurants: {
    all: {
      '1': {
        id: '1',
        name: 'Tacopocalypse',
        reviews: [
          9
        ]
      },
      '2': {
        id: '2',
        name: 'Fuzzy’s Taco Shop',
        reviews: [
          8
        ]
      },
      '3': {
        id: '3',
        name: 'El Bait Shop',
        reviews: []
      }
    },
    reviews: {
      '8': {
        id: 8,
        rating: 3
      },
      '9': {
        id: 9,
        rating: 5
      }
    }
  }
}
```

The next step is to create a custom selector that only returns the reviews for a given restaurant

```js
//app/reducers/restaurants.js
const reviews = state => state.restaurants.reviews;

export const getReviews = createSelector(
  reviews,
  getSelectedRestaurant,
  (reviews, selectedRestaurant) => {
    return _.map(selectedRestaurant.reviews, reviewId => {
      return _.get(reviews, reviewId);
    });
  }
);
```

Now we can update the selector used in the detail parent component

```js
//app/components/restaurant-item.js
import Ember from 'ember';
import { connect } from 'ember-redux';
import { getReviews } from '../reducers/restaurants';

var stateToComputed = (state) => {
  return {
    reviews: getReviews(state)
  };
};

export default connect(stateToComputed)(Ember.Component);
```

This update does require we alter the yield and the detail controller template
```js
//app/templates/components/restaurant-item.hbs
{{yield reviews}}
```

```js
//app/templates/components/restaurant-detail.hbs
<ul>
  {{#each reviews as |review|}}
    <li>{{review.rating}} ★</li>
  {{else}}
    <li>no reviews</li>
  {{/each}}
</ul>
```

```js
//app/templates/restaurants/detail.hbs
{{#restaurant-item as |reviews|}}
  {{restaurant-detail reviews=reviews}}
{{/restaurant-item}}
```

<p>Want the source code for part 4? You can find this commit up on <a href="https://github.com/ember-redux/guides/commit/226bd28e6cde904e09d6358d10d4332c2dab3573">github</a></p>

**Feature 3: Add rate action to add/update review**

The next feature allows us to create or update a rating for a given restaurant. First we add the html below to the restaurant-detail component. This represents a basic star rating component in its most primitive form. Notice we are planning to use a new closure action called "rate" that will be defined in the parent component and passed down

```js
//app/templates/components/restaurant-detail.hbs
<div class="star-rating">
  <span onclick={{action rate 1}}>★</span>
  <span onclick={{action rate 2}}>★</span>
  <span onclick={{action rate 3}}>★</span>
  <span onclick={{action rate 4}}>★</span>
  <span onclick={{action rate 5}}>★</span>
</div>

<ul>
  {{#each reviews as |review|}}
    <li>{{review.rating}} ★</li>
  {{else}}
    <li>no reviews</li>
  {{/each}}
</ul>
```
To pass the "rate" closure action down we need to modify both the restaurant-item and detail controller templates

```js
//app/templates/components/restaurant-item.hbs
{{yield reviews (action "rate")}}
```

```js
//app/templates/restaurants/detail.hbs
{{#restaurant-item as |reviews rate|}}
  {{restaurant-detail reviews=reviews rate=rate}}
{{/restaurant-item}}
```
Next open the restaurant-item component and add the function dispatchToActions. This function is where we define closure actions that will interact with redux. The "rate" action requires the id of the restaurant we are planning to add a review for. We don't have this in the template itself but redux is tracking the active restaurant with a "selectedId" property. We can create a selector to expose this and add that to our stateToComputed function.

One important point to note in this example is that because we want to ask for a computed property inside the dispatchToActions function I intentionally used the "function" keyword. If we used the "=>" syntax here we wouldn't have access to the component instance

```js
//app/components/restaurant-item.js
import Ember from 'ember';
import fetch from 'fetch';
import { connect } from 'ember-redux';
import { getReviews, getSelectedId } from '../reducers/restaurants';

const { get } = Ember;

var stateToComputed = (state) => {
  return {
    reviews: getReviews(state),
    selectedId: getSelectedId(state)
  };
};

var dispatchToActions = function(dispatch) {
  return {
    rate: rating => {
      let selectedId = get(this, 'selectedId');
      let params = {
        method: 'POST',
        body: JSON.stringify({rating: rating})
      };
      return fetch(`/api/restaurants/${selectedId}`, params)
        .then(fetched => fetched.json())
        .then(response => dispatch({
          type: 'RESTAURANTS:RATE',
          response: response.restaurants
        }));
    }
  };
};

export default connect(stateToComputed, dispatchToActions)(Ember.Component);
```
Now in the reducer we need to add that new selector

```js
//app/reducers/restaurants.js
const selectedId = state => state.restaurants.selectedId;

export const getSelectedId = createSelector(
  selectedId,
  (selectedId) => selectedId
);
```

And finally we need to write the reducer logic to handle our new "RESTAURANTS:RATE" action. This case is almost identical to the "RESTAURANTS:TRANSFORM_DETAIL" action and at some point in the near future we will DRY up this reducer

```js
//app/reducers/restaurants.js
export default ((state, action) => {
  switch(action.type) {
    // other reducer code from parts 1-4
    case 'RESTAURANTS:RATE': {
      const restaurant = {[action.response.id]: action.response};
      const normalized = normalize(restaurant, [restaurantSchema]);
      const { restaurants, reviews } = normalized.entities;
      const rateMerge = _.extend({}, state.all, restaurants);
      const rateReviews = _.extend({}, state.reviews, _.keyBy(reviews, r => r.id));
      return Object.assign({}, state, {
        all: rateMerge,
        reviews: rateReviews
      });
    }
  }
});
```

<p>Want the source code for this entire application? You can find it on <a href="https://github.com/ember-redux/guides/commits/master">github</a></p>

<p>Still not sure about the relationship between reducers and the store? Checkout this <a href="https://ember-twiddle.com/c950cf7d7e1c9f37b1ca683967370ae7?openFiles=components.number-count.js%2C">ember twiddle</a> with a 24 line redux implementation!</p>

{% endraw %}
