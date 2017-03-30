angular.module('app')
.controller('LangCtrl', function($scope, isolineatorService) {

  this.listStyle = {
    'overflow': 'scroll',
    'height': '300px'
  }
  
  this.lang;

  this.currentCode = 'es';
  this.currentLang = 'Spanish';
  
  isolineatorService.getLang((data) => {
    console.log('in getlang', data.data)
    this.lang = data.data;
  });

  this.onClick = (newLang) => {
    this.currentLang = newLang.name;
    this.currentCode = newLang.code;
  }
})
.directive('listlang', function() {
  return {
    restrict: 'E',
    controller: 'LangCtrl',
    controllerAs: 'ctrl',
    bindToController: true,
    templateUrl: '/templates/listlang.html'
  }
});