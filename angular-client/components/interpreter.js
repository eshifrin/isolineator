angular.module('app')
.controller('InterCtrl', function($scope) {
  console.log('interpreter scope')
  console.log($scope.ctrl);
    })
.directive('interpreter', function() {
  return {
    scope: {
      chatting: '<',
      text: '<',
      translate: '<',
      translateTo: '<'
    },
    controller: 'InterCtrl',
    controllerAs: 'ctrl',
    bindToController: true,
    templateUrl: 'templates/interpreter.html'
  };
});