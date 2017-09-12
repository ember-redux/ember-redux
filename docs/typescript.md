---
layout: docs
title: TypeScript Guide - ember-redux
---
{% raw %}

# TypeScript Guide

If you prefer to skip ahead and read the source code check it out on <a href="https://github.com/ember-redux/guides/commits/typescript">github</a>

**Feature 1: Display a list of restaurants**

Before we start writing any code we need to install a few dependencies

```bash
ember install ember-redux
ember install ember-fetch
ember install ember-cli-typescript
```

To begin we define a route for the restaurants listing

```js
//app/router.js
Router.map(function() {
  this.route('restaurants', {path: '/'});
});
```

Before we start writing any TypeScript we need to first update the tsconfig.json file to turn on strict mode. This strict setting will help us ensure we get the most from TypeScript by turning on strictNullChecks, noImplicitThis, noImplicitAny. To read more about the strict option please checkout the TypeScript 2.3 <a href="https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-3.html">release notes</a>

```json
{
  "compilerOptions": {
    "target": "es2015",
    "module": "es2015",
    "moduleResolution": "node",
    "strict": true,
    "suppressImplicitAnyIndexErrors": true,
    "allowSyntheticDefaultImports": true,
    "noEmitOnError": false,
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "guides/*": ["app/*"]
    }
  },
  "include": [
    "**/*.ts"
  ]
}
```

In the route itself we use ember-fetch to make the network call. When this has completed we dispatch the event to redux with the response

```ts
//app/routes/restaurants.ts
import fetch from 'fetch';
import { route } from 'ember-redux';
import { Restaurants } from '../types/restaurants';
import { ListDispatch, TRANSFORM_LIST } from '../actions/restaurants';

const model = (dispatch: ListDispatch) => {
  return fetch('/api/restaurants')
    .then((fetched: Response) => fetched.json())
    .then((response: Restaurants) => dispatch({
      type: TRANSFORM_LIST,
      response: response.restaurants
    }));
};

export default route({model})();
```

If we tried to compile this right now we would have a handful of errors. The first of which is that we need to define the actual shape of our response

```ts
//app/types/restaurants.ts
export interface Restaurant {
  id: number;
  name: string;
}

export interface Restaurants {
  restaurants: Array<Restaurant>;
}
```

Next we need to declare ListDispatch and give it the correct type information to match our type/response args

```ts
//app/actions/restaurants.ts
import { Restaurant } from '../types/restaurants';

export interface ListAction {
  type: 'RESTAURANTS:TRANSFORM_LIST';
  response: Array<Restaurant>;
}

export interface ListDispatch {
  (action: ListAction): void;
}

export const TRANSFORM_LIST = 'RESTAURANTS:TRANSFORM_LIST';
```

One last compiler error for this route is a result of ember-cli-typescript looking for typedefs in node_modules/@types by default. To eliminate the compiler error we need to open the tsconfig.json file and add the path to each type definition file (ember-fetch, redux and ember-redux)

```json
{
  "compilerOptions": {
    "target": "es2015",
    "module": "es2015",
    "moduleResolution": "node",
    "strict": true,
    "suppressImplicitAnyIndexErrors": true,
    "allowSyntheticDefaultImports": true,
    "noEmitOnError": false,
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "guides/*": ["app/*"],
      "ember-redux": ["node_modules/ember-redux/index.d.ts"],
      "redux": ["node_modules/redux/index.d.ts"],
      "fetch": ["node_modules/ember-fetch/index.d.ts"]
    }
  },
  "include": [
    "**/*.ts"
  ]
}
```

Before we write the code to handle this response we must add an index reducer to combine all of our application reducers

```ts
//app/reducers/index.ts
import { combineReducers } from 'redux';
import restaurants from './restaurants';

export default combineReducers({
  restaurants
});
```

Now in the restaurants reducer we first convert the array of restaurants returned from ember-cli-mirage into an object. Next we merge that object with any existing restaurant data that might already be loaded. Finally we return a new state that our application can use to display the restaurants with

```ts
//app/reducers/restaurants.ts
import _ from 'lodash';
import { Restaurant, RestaurantState } from '../types/restaurants';
import { TRANSFORM_LIST, ListAction } from '../actions/restaurants';

const initialState = {
  all: undefined
};

export default ((state: RestaurantState, action: ListAction): RestaurantState => {
  switch(action.type) {
    case TRANSFORM_LIST: {
      const restaurants = _.keyBy(action.response, (restaurant: Restaurant) => restaurant.id);
      const merged = _.extend({}, state.all, restaurants);
      return Object.assign({}, state, {all: merged});
    }
    default: {
      return state || initialState;
    }
  }
});
```

One missing type definition we need to add is RestaurantState

```ts
//app/types/restaurants.ts
import { Dictionary } from './index';

export interface Restaurant {
  id: number;
  name: string;
}

export interface RestaurantState {
  all: Dictionary<Restaurant>;
}

export interface Restaurants {
  restaurants: Array<Restaurant>;
}
```

This will then require we define a Dictionary type

```ts
//app/types/index.ts
export interface Dictionary<T> {
  [index: string]: T;
}
```

One last compiler error we get here can be silenced by installing the lodash type defs. Because ember-cli-typescript will pick this up automatically we do not need to add this to the tsconfig.json file manually

```bash
npm install @types/lodash
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

```ts
//app/components/restaurant-items.ts
import { connect } from 'ember-redux';
import { RootState } from '../types/index';

const stateToComputed = (state: RootState) => {
  return {
    restaurants: state.restaurants.all
  };
};

export default connect(stateToComputed)();
```

Next we need to define the RootState type

```ts
//app/types/index.ts
import { RestaurantState } from './restaurants';

export interface RootState {
  restaurants: RestaurantState;
}

export interface Dictionary<T> {
  [index: string]: T;
}
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

<p>Want the source code for part 1? You can find this commit up on <a href="https://github.com/ember-redux/guides/commit/6fa784ead8ff258ec35eeab09230c59652ce6a9a">github</a></p>

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

```ts
//app/routes/restaurants/detail.ts
import fetch from 'fetch';
import { route } from 'ember-redux';
import { RestaurantHash } from '../../types/restaurants';
import { DetailDispatch, TRANSFORM_DETAIL } from '../../actions/restaurants';

type ParamsObject = {
  id: string
}

const model = (dispatch: DetailDispatch, params: ParamsObject) => {
  return fetch(`/api/restaurants/${params.id}`)
    .then((fetched: Response) => fetched.json())
    .then((response: RestaurantHash) => dispatch({
      type: TRANSFORM_DETAIL,
      response: response.restaurants
    }));
};

export default route({model})();
```

If we kick off the compiler we again see a handful of missing types. First we can start out by adding DetailDispatch

```ts
//app/actions/restaurants.ts
import { Restaurant } from '../types/restaurants';

// list action types omitted for brevity

export interface DetailAction {
  type: 'RESTAURANTS:TRANSFORM_DETAIL';
  response: Restaurant;
}

export interface DetailDispatch {
  (action: DetailAction): void;
}

export const TRANSFORM_DETAIL = 'RESTAURANTS:TRANSFORM_DETAIL';
```

Now we need to add a new type that represents a single restaurant coming back from ember-cli-mirage

```ts
//app/types/restaurants.ts
import { Dictionary } from './index';

// other types omitted for brevity

export interface Restaurant {
  id: number;
  name: string;
}

export interface RestaurantHash {
  restaurants: Restaurant;
}
```

Next we need to handle this event in the reducer. We start by creating an object that we then merge into the existing state tree. Finally a new state is returned but in addition to the restaurant details we also set a selectedId value to help us track the active restaurant

```ts
//app/reducers/restaurants.ts
import _ from 'lodash';
import { Restaurant, RestaurantState } from '../types/restaurants';
import { TRANSFORM_LIST, TRANSFORM_DETAIL, DetailAction, ListAction } from '../actions/restaurants';

const initialState = {
  all: undefined,
  selectedId: undefined
};

type Action = ListAction | DetailAction;

export default ((state: RestaurantState, action: Action): RestaurantState => {
  switch(action.type) {
    case TRANSFORM_LIST: {
      const restaurants = _.keyBy(action.response, (restaurant: Restaurant) => restaurant.id);
      const merged = _.extend({}, state.all, restaurants);
      return Object.assign({}, state, {all: merged});
    }
    case TRANSFORM_DETAIL: {
      const restaurant = {[action.response.id]: action.response};
      const merge = _.extend({}, state.all, restaurant);
      return Object.assign({}, state, {
        all: merge,
        selectedId: action.response.id
      });
    }
    default: {
      return state || initialState;
    }
  }
});
```

One very important TypeScript concept worth calling out here. Because we want type safety in the case statements on a per action basis we create what is called a <a href="https://basarat.gitbooks.io/typescript/docs/types/discriminated-unions.html">Discriminated Union</a> allowing the compiler to properly determine a given type (by doing a switch on action.type). This helps provide the appropriate compiler errors when the shape of an action doesn't match

Next we want to show the reviews for a given restaurant when the detail route is active. To start we should add some review data to the ember-cli-mirage fixture

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

```ts
//app/components/restaurant-item.ts
import { connect } from 'ember-redux';
import { RootState } from '../types/index';
import _ from 'lodash';

const stateToComputed = (state: RootState) => {
  return {
    restaurant: _.get(state.restaurants.all, state.restaurants.selectedId)
  };
};

export default connect(stateToComputed)();
```

Because RestaurantState now has both "all" and "selectedId" we will get a compiler error until we update it

```ts
//app/types/restaurants.ts

export interface RestaurantState {
  all: Dictionary<Restaurant>;
  selectedId: number;
}
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

<p>Want the source code for part 2? You can find this commit up on <a href="https://github.com/ember-redux/guides/commit/a90a8471a2694448f84bab9a6457b2e9e246e7">github</a></p>

**Refactor: Use reselect to encapsulate**

One problem we have with both the list and detail parent components right now is that they know the internal structure of the redux state tree. If we ever wanted to restructure this we would very likely need to touch the component files. The goal of <a href="https://github.com/reactjs/reselect">reselect</a> is to provide an interface for components that need state without leaking the details of how that state is structured. We start by adding the reselect dependency

```bash
ember install ember-reselect-shim
```

Next we add the custom selectors in the reducer file. If you are familiar with computed properties in ember you can think of each selector below in much the same way. If the inputs to any selector have changed the value will be recalculated. If not, you will get a cached value back

```ts
//app/reducers/restaurants.ts
import _ from 'lodash';
import reselect from 'reselect';
import { RootState, Dictionary } from '../types/index';
import { Restaurant, RestaurantState } from '../types/restaurants';
import { TRANSFORM_LIST, TRANSFORM_DETAIL, DetailAction, ListAction } from '../actions/restaurants';

const { createSelector } = reselect;

// reducer omitted for brevity

const all = (state: RootState) => state.restaurants.all;
const selectedId = (state: RootState) => state.restaurants.selectedId;

export const getRestaurants = createSelector(
  all,
  (all: Dictionary<Restaurant>) => all
);

export const getSelectedRestaurant = createSelector(
  all,
  selectedId,
  (all: Dictionary<Restaurant>, selectedId: number) => _.get(all, selectedId)
);
```

To clear up any compiler error regarding reselect open the tsconfig.json file and add the reselect type defs

```json
{
  "compilerOptions": {
    "target": "es2015",
    "module": "es2015",
    "moduleResolution": "node",
    "strict": true,
    "suppressImplicitAnyIndexErrors": true,
    "allowSyntheticDefaultImports": true,
    "noEmitOnError": false,
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "guides/*": ["app/*"],
      "ember-redux": ["node_modules/ember-redux/index.d.ts"],
      "redux": ["node_modules/redux/index.d.ts"],
      "fetch": ["node_modules/ember-fetch/index.d.ts"],
      "reselect": ["node_modules/reselect/lib/index.d.ts"]
    }
  },
  "include": [
    "**/*.ts"
  ]
}
```

Now in the detail component we use the getSelectedRestaurant selector

```ts
//app/components/restaurant-item.ts
import { connect } from 'ember-redux';
import { RootState } from '../types/index';
import { getSelectedRestaurant } from '../reducers/restaurants';

const stateToComputed = (state: RootState) => {
  return {
    restaurant: getSelectedRestaurant(state)
  };
};

export default connect(stateToComputed)();
```

And in the list component we can use the getRestaurants selector

```ts
//app/components/restaurant-items.ts
import { connect } from 'ember-redux';
import { RootState } from '../types/index';
import { getRestaurants } from '../reducers/restaurants';

const stateToComputed = (state: RootState) => {
  return {
    restaurants: getRestaurants(state)
  };
};

export default connect(stateToComputed)();
```

If this feels a little silly at first glance just keep in mind that as your application grows you will be thankful you didn't expose any implementation details about the store because of the freedom this contract affords you at refactor time

<p>Want the source code for part 3? You can find this commit up on <a href="https://github.com/ember-redux/guides/commit/cbf43c2450f1745a3dc5b7cb6afde4f2fd3c1681">github</a></p>

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

```ts
//app/reducers/restaurants.ts
import { Review, Restaurant, RestaurantState } from '../types/restaurants';
import { normalize, schema } from 'normalizr';

const reviewSchema = new schema.Entity('reviews');
const restaurantSchema = new schema.Entity('restaurants', {
  reviews: [reviewSchema]
});

const initialState = {
  all: undefined,
  selectedId: undefined,
  reviews: undefined
};
```

The real work involved here is that now we need to normalize the data in each reducer and as a result we end up with two top level structures instead of "all restaurants"

```ts
//app/reducers/restaurants.ts
export default ((state: RestaurantState, action: Action): RestaurantState => {
  switch(action.type) {
    case TRANSFORM_LIST: {
      const normalized = normalize(action.response, [restaurantSchema]);
      const { restaurants, reviews } = normalized.entities;
      const merged = _.extend({}, state.all, _.keyBy(restaurants, (r: Restaurant) => r.id));
      const mergedReviews = _.extend({}, state.reviews, _.keyBy(reviews, (r: Review) => r.id));
      return Object.assign({}, state, {
        all: merged,
        reviews: mergedReviews
      });
    }
    case TRANSFORM_DETAIL: {
      const restaurant = {[action.response.id]: action.response};
      const normalized = normalize(restaurant, [restaurantSchema]);
      const { restaurants, reviews } = normalized.entities;
      const merge = _.extend({}, state.all, restaurants);
      const mergeReviews = _.extend({}, state.reviews, _.keyBy(reviews, (r: Review) => r.id));
      return Object.assign({}, state, {
        all: merge,
        reviews: mergeReviews,
        selectedId: action.response.id
      });
    }
    default: {
      return state || initialState;
    }
  }
});
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

We have a few compiler errors because of this new data structrue. Open the types file and add a Review/ update Restaurants to reflect it has an Array of numbers for each review

```ts
//app/types/restaurants.ts
import { Dictionary } from './index';

export interface Review {
  id: number;
  rating: number;
}

export interface Restaurant {
  id: number;
  name: string;
  reviews: Array<number>;
}

export interface RestaurantState {
  all: Dictionary<Restaurant>;
  reviews: Dictionary<Review>;
  selectedId: number;
}

export interface Restaurants {
  restaurants: Array<Restaurant>;
}

export interface RestaurantHash {
  restaurants: Restaurant;
}
```

The last compiler error requires we add the normalizr typedefs to the tsconfig.json file

```json
{
  "compilerOptions": {
    "target": "es2015",
    "module": "es2015",
    "moduleResolution": "node",
    "strict": true,
    "suppressImplicitAnyIndexErrors": true,
    "allowSyntheticDefaultImports": true,
    "noEmitOnError": false,
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "guides/*": ["app/*"],
      "ember-redux": ["node_modules/ember-redux/index.d.ts"],
      "redux": ["node_modules/redux/index.d.ts"],
      "fetch": ["node_modules/ember-fetch/index.d.ts"],
      "reselect": ["node_modules/reselect/lib/index.d.ts"],
      "normalizr": ["node_modules/normalizr/index.d.ts"]
    }
  },
  "include": [
    "**/*.ts"
  ]
}
```

The next step is to create a custom selector that only returns the reviews for a given restaurant

```ts
//app/reducers/restaurants.ts
const reviews = (state: RootState) => state.restaurants.reviews;

export const getReviews = createSelector(
  reviews,
  getSelectedRestaurant,
  (reviews: Dictionary<Review>, selectedRestaurant: Restaurant) => {
    return _.map(selectedRestaurant.reviews, (reviewId: number) => {
      return _.get(reviews, reviewId);
    });
  }
);
```

Now we can update the selector used in the detail parent component

```ts
//app/components/restaurant-item.ts
import { connect } from 'ember-redux';
import { RootState } from '../types/index';
import { getReviews } from '../reducers/restaurants';

const stateToComputed = (state: RootState) => {
  return {
    reviews: getReviews(state)
  };
};

export default connect(stateToComputed)();
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

<p>Want the source code for part 4? You can find this commit up on <a href="https://github.com/ember-redux/guides/commit/047ec9fce66d2d3ca4387323fefd4b3543325d31">github</a></p>

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

```ts
//app/components/restaurant-item.ts
import fetch from 'fetch';
import { connect } from 'ember-redux';
import { RootState } from '../types/index';
import { RestaurantHash } from '../types/restaurants';
import { RateDispatch, RATE_ITEM } from '../actions/restaurants';
import { getReviews, getSelectedId } from '../reducers/restaurants';

const stateToComputed = (state: RootState) => {
  return {
    reviews: getReviews(state),
    selectedId: getSelectedId(state)
  };
};

const dispatchToActions = (dispatch: RateDispatch) => {
  return {
    rate: (rating: number, selectedId: number) => {
      let params = {
        method: 'POST',
        body: JSON.stringify({rating: rating})
      };
      return fetch(`/api/restaurants/${selectedId}`, params)
        .then((fetched: Response) => fetched.json())
        .then((response: RestaurantHash) => dispatch({
          type: RATE_ITEM,
          response: response.restaurants
        }));
    }
  };
};

export default connect(stateToComputed, dispatchToActions)();
```

We are missing a few types. Open the actions and add the RateDispatch type

```ts
//app/actions/restaurants.ts
import { Restaurant } from '../types/restaurants';

// list and detail action types omitted for brevity

export interface RateAction {
  type: 'RESTAURANTS:RATE';
  response: Restaurant;
}

export interface RateDispatch {
  (action: RateAction): void;
}

export const RATE_ITEM = 'RESTAURANTS:RATE';
```

Now in the reducer we need to add that new selector

```ts
//app/reducers/restaurants.ts
const selectedId = (state: RootState) => state.restaurants.selectedId;

export const getSelectedId = createSelector(
  selectedId,
  (selectedId: number) => selectedId
);
```

And finally we need to write the reducer logic to handle our new "RESTAURANTS:RATE" action. This case is almost identical to the "RESTAURANTS:TRANSFORM_DETAIL" action and at some point in the near future we will DRY up this reducer

```ts
//app/reducers/restaurants.ts
import { RATE_ITEM, TRANSFORM_LIST, TRANSFORM_DETAIL, RateAction, DetailAction, ListAction } from '../actions/restaurants';

// other imports omitted for brevity

type Action = ListAction | DetailAction | RateAction;

export default ((state: RestaurantState, action: Action): RestaurantState => {
  switch(action.type) {
    // other actions omitted for brevity
    case RATE_ITEM: {
      const restaurant = {[action.response.id]: action.response};
      const normalized = normalize(restaurant, [restaurantSchema]);
      const { restaurants, reviews } = normalized.entities;
      const rateMerge = _.extend({}, state.all, restaurants);
      const rateReviews = _.extend({}, state.reviews, _.keyBy(reviews, (r: Review) => r.id));
      return Object.assign({}, state, {
        all: rateMerge,
        reviews: rateReviews
      });
    }
    default: {
      return state || initialState;
    }
  }
});
```

Before we can boot up the app we need to alter the templates to pass through the selectedId value we mapped above

```js
//app/templates/components/restaurant-detail.hbs
<div class="star-rating">
  <span onclick={{action rate 1 selectedId}}>★</span>
  <span onclick={{action rate 2 selectedId}}>★</span>
  <span onclick={{action rate 3 selectedId}}>★</span>
  <span onclick={{action rate 4 selectedId}}>★</span>
  <span onclick={{action rate 5 selectedId}}>★</span>
</div>

<ul>
  {{#each reviews as |review|}}
    <li>{{review.rating}} ★</li>
  {{else}}
    <li>no reviews</li>
  {{/each}}
</ul>
```
Next we need to yield the "selectedId" and plug that value into the restaurant-detail component

```js
//app/templates/components/restaurant-item.hbs
{{yield reviews selectedId (action "rate")}}
```

```js
//app/templates/restaurants/detail.hbs
{{#restaurant-item as |reviews selectedId rate|}}
  {{restaurant-detail reviews=reviews selectedId=selectedId rate=rate}}
{{/restaurant-item}}
```

<p>Want the source code for the entire TypeScript application? You can find it on <a href="https://github.com/ember-redux/guides/commits/typescript">github</a></p>

<p>Still not sure about the relationship between reducers and the store? Checkout this <a href="https://ember-twiddle.com/c950cf7d7e1c9f37b1ca683967370ae7?openFiles=components.number-count.js%2C">ember twiddle</a> with a 24 line redux implementation!</p>

{% endraw %}
