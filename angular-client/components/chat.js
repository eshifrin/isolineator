angular.module('app')
.controller('ChatCtrl', function($scope, isolineatorService) {
  var socket = io();
  this.englishText = '';
  this.foreignText = '';
  this.username = '';
  this.translateTo = 'en';
  this.messages = [];
  this.chatting = true;

  //chatting is a boolean passed to the interpreter directive & html
  //so we can hide features we don't want

  isolineatorService.getChatLang((data) => {
    this.languages = data.data;
  });


  this.sendMessage = () => {
    if (this.foreignText) {
      var message = { 
        username: this.username,
        text: this.foreignText,
        langCode: this.translateTo
      };
      socket.emit('message', message);
      this.foreignText = '';
    }
  }

  //waiting for the audio
  socket.on('transcription', (data, trans) => {
      this.foreignText = trans;
      this.englishText = data;
  });

  this.changeLanguage = () => {
    socket.emit('changeLanguage', this.translateTo);
  }

  socket.on('message', (message) => {
    $scope.$apply(() => {
      this.messages.push(message);
    });
  });
  
})
.directive('chat', function() {
  return {
    scope: {
    },
    controller: 'ChatCtrl',
    controllerAs: 'ctrl',
    bindToController: true,
    templateUrl: 'templates/chat.html'
  }
})


