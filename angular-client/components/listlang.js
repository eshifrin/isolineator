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
    this.lang = data.data;
  });

  this.onClick = (newLang) => {
    this.currentLang = newLang.name;
    this.currentCode = newLang.code;
    if (this.chatting) {
      console.log('sending', newLang.code)
      isolineatorService.changeAudioLanguage(newLang.code);
    }
  }
})
.directive('listlang', function() {
  return {
    scope: {
      chatting: '<'
    },
    restrict: 'E',
    controller: 'LangCtrl',
    controllerAs: 'ctrl',
    bindToController: true,
    templateUrl: '/templates/listlang.html'
  }
});