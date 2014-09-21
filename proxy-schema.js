
var ProxySchema = function (modelName, Extends, schema) {

  var validateChange = function(change) {
    
    //Warn when new properties added
    if(change.type == 'add' && !schema[change.name]){
      console.warn('Unknown member "' + change.name + '" added to ' + modelName + ' instance.');
    }

    //Warn when wrong types assigned (updating)
    if(change.type == 'update' && schema[change.name].name != self[change.name].constructor.name){
      console.warn('"' + change.name + '" in ' + modelName + ' instance updated to ' + self[change.name].constructor.name + ' instead of ' + schema[change.name].name) + '.';
    }
    
    //Warn when wrong types assigned (adding)
    if(change.type == 'add' && schema[change.name].name != self[change.name].constructor.name){
      console.warn('"' + change.name + '" of type ' + self[change.name].constructor.name + ' instead of type ' + schema[change.name].name + ' added to ' + modelName + ' instance.');
    }

    if(change.type == 'delete' && schema[change.name]){
      console.warn('Member "' + change.name + '" deleted from ' + modelName + ' instance.');
    }

  };

  var validateChanges = function(changes) {
    changes.forEach(validateChange);
  };

  //TODO: implement modelName somehow instead of PmroxySchemaClass
  var ProxySchemaClass = function () {
    
    //TODO: Use console.warn when wrong types are used

    var self = this;

    //Getter and setter checks on obj
    Object.observe(self, validateChanges);
    
    //Inherit from base class
    //TODO: Is it a problem that members are added to the child's __proto__ and not Resource's __proto__?
    Extends.apply(self, arguments);
    
    //Add undefined placeholders for each member if not assigned by super constructor
    _.keys(schema).forEach(function (key) {
      if(key in self === false) {
        self[key] = undefined;
      }
    });
  
  };

  ProxySchemaClass.prototype = Extends.prototype;
  return ProxySchemaClass;

};

originalPerson = {name: 'Johnny', age: 99};

angular.module('ProxySchemaApp', ['ngResource'])
  .directive('psEditExampleEntity', function (PersonResource) {
    'use strict';
    return {
      templateUrl: 'edit-example-entity.html',
      scope: {},
      link: function (scope) {

        //Node: Default value types will be validated
        scope.person = new PersonResource({ name: 'Johnny', age: 99});

      }
    }
  })
  .factory('PersonResource', function($resource) {
    'use string';
   
    var PersonResource = $resource('/api/people/:id', {}, {
      update: {method: 'PUT'}
    });

    //Define schema for "person"
    var Person = ProxySchema('Person', PersonResource, {
      name: String,
      age: Number
    });

    return Person;

  })
;

