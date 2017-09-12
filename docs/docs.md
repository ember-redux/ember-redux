---
layout: docs
---

# Philosophy

One common criticism of ember-redux is that the api is not ember(-y). That would make sense given the origin of our connect api comes from the popular project <a href="https://github.com/reactjs/react-redux">react-redux</a>.

A few of the prominent themes that will jump out at you when using this addon are listed below. This isn't a complete list but it should serve as a guide to help you decide if ember redux is something you should adopt or avoid.

### often the best api is no api at all

To quote <a href="https://twitter.com/kentbeck/status/258316233068396544?lang=en">Kent Beck</a> "first you learn the value of abstraction, then you learn the cost of abstraction, then you're ready to engineer". Abstraction isn't inherently bad but the redux community generally prefers less of it. This project takes a minimalist look at redux but does wire up a default store with redux thunk to launch the developer into the pit of success.

### data down actions up

Redux itself could be best described as a pure implementation of "data down actions up". In 2015 the ember community took on this new mantra but it is my belief that we (the ember community) didn't take that far enough.

### borrow from the wider JavaScript ecosystem

One way data flow and the redux library expand well beyond the react ecosystem. Why not take advantage of everything the wider JavaScript community has to offer? We believe that redux is the new data flow primitive and should be accessible regardless of frontend framework.
