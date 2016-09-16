/**
 * For many Ember apps you may choose to ignore the state-initializer but
 * with a growing tendency for offline applications it is becoming increasingly
 * likely that you'll want some strategy for initializing your state.
 *
 * Initialization acts structurally in a similar way to reducers. In both instances
 * the overall state machine is broken down into discrete parts. Then each part of the
 * state tree is delegated to a separate file for processing.
 *
 * You can of course, address intialisation across all state here as a singular
 * file but typically you'll actually want to initialize state by sections in which case you'll
 * want to use the following ember-cli commands:
 *
 * ember generate state-initializer [name]
 * ember destroy state-initializer [name]
 *
 * Using these two commands will ensure that this file is managed for you.
 */

export default () => {};
