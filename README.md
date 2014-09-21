AngularJS Proxy Schema
===

Model schemas using ES6 Proxy concept with AngularJS Resources.

Why?
---

Sometimes in single page web applications it gets hard to track the structure of your models. Because of this you may accidentally use the wrong name when setting model members, or spend too long researching model usage throughout your codebase just to understand the best way to design a new feature or diagnose a bug. Wouldn't it be nice to have one central place in your app where the model schema is defined and also introduce some concept of type safety to avoid these errors?

How
---

About this example of a possible way to solve this:
  - Doesn't actually use Proxies from ES6 and instead uses `Object.observe` [available in Chrome 36](http://www.html5rocks.com/en/tutorials/es7/observe/).
  - Schema definitions are just objects with type constructors as values
  - "Integration" with AngularJS resources is implemented by extending Resource to make model objects
  - The pattern can be easily updated to use Proxy at somepoint soon when ES6 is better supported
  - `Object.observe()` relies on a fairly recent versin of Chrome, so this solution may have limited utility
  - `console.warn` is used when type rules are violated. This could hook nicely into the build process so that violations during testiing fail.

Here is the example schema from this app:
```javascript
var Person = ProxySchema('Person', PersonResource, {
  name: String,
  age: Number
});
```

A person has a `name` and an `age`. Person extends a PersonResource from AngularJS. ProxySchema handles extending PersonResource with the new properties for Person and setting up observers to warn if Person is used in a way that contradicts its schema.

Instructions
---
  1. `git clone git@github.com:Trindaz/angularjs-proxy-schema.git`
  2. Serve files through your favorite static webserver and browse to `/index.html` in Chrome 36+
  3. Use Console in Chrome Developer to run the following examples:

####Example 1: View the model for these examples (Person)
```javascript
var s = angular.element($('h3')[0]).scope();
console.log(s.person);
```
Note that `s.person` is a model with `name` and `age` properties in addition to other properties inherited from AngularJS' Resource (`$get`, `$save`, etc.)

####Example 2: Violate type safety for `name` on `Person`
```javascript
var s = angular.element($('h3')[0]).scope();
s.person.name = {first: 'Johnny', last: 'Cash'};
```
Note that a warning is displayed
> "name" in Person instance updated to Object instead of String

####Example 3: Attempt adding new members to `Person`
```javascript
var s = angular.element($('h3')[0]).scope();
s.person.address = {street: '386 Park Avenue South', city: 'New York', state: 'NY', zip: '10016'};
```
Note that a warning is displayed
> Unknown member "address" added to Person instance.

####Example 4: Type check initialization properties
_This example requires editing source code for the app._
Type safety is checked on initial properties passed to Resource. To see this in action, update this line in `proxy-schema.js` and reload the app:
> `scope.person = new PersonResource({name: 'Johnny', age: 99});`
to
> `scope.person = new PersonResource({name: 'Johnny', age: {years: 99, pensionAge: true}});`
and then node the warning displayed when loading the app:
> "age" of type Object instead of type Number added to Person instance.

Future
---

Possible improvements for the future:
  - Use [forms-angular](https://github.com/forms-angular/forms-angular) for re-use of Mongoose models for schema definitions


