angular.module('app')
.controller('InterCtrl', function($scope) {
  console.log($scope.ctrl);
    })
.directive('interpreter', function() {
  return {
    scope: {
      chatting: '<',
      text: '<',
      translate: '<'
    },
    controller: 'InterCtrl',
    controllerAs: 'ctrl',
    bindToController: true,
    templateUrl: 'templates/interpreter.html'
  };
});