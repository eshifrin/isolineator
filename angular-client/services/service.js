angular.module('app')
.service('isolineatorService', function($http, $window) {

  this.getAll = function(callback) {
    $http.get('/log')
    .then(function({data}) {
      if(callback) {
        callback(data);
      }
    })
    .catch(function({err}) {
      console.log(err);
    });
  };

  this.getFileByTopic = function(query, callback) {

    let config = {params: {query: query}};

    $http.get('/getFileByTopic', config)
    .then(function(data) {
      if(callback) {
        callback(data);
      }
    })
    .catch(function(err) {
      console.log('error in searchLogs:', err);
    });
  };

  this.getFileById = function(id, callback) {
    
    $http({
      method: 'GET',
      url: '/getFileById',
      params: {'id': id},
      responseType: 'arraybuffer'
    })
    .then(function(response) {
      var audioContext = new AudioContext();
      audioContext.decodeAudioData(response.data, function(buffer) {
        mainBuffer = buffer;
        var source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.loop = false;
        source.start(0);

        var stop = document.getElementById(id);

        stop.onclick = function() {
          source.stop(0);
          audioContext.close();
        };
        if (callback) {
          callback(response);
        }
      });
    })
    .catch(function(err) {
      console.log('error in getFileById:', err);
    });
  };

  this.postRecording = function(topic, recording, date, callback) { 

    var formData = new FormData();
    formData.append('recording', recording, topic);

    $http({
      method: 'POST',
      url: '/record', 
      data: formData,
      contentType: false,
      transformRequest: angular.identity,
      processData: false,
      headers: {'Content-type': undefined}
    })
    .then(function(data) {
      if (callback) {
        callback(data);
      }
    })
     .catch(function(err) {
       console.log('error in postRecording', err);
     });
  };

  this.transOnEnd = function(topic, recording, date, lang, callback) { 

    var formData = new FormData();
    formData.append('recording', recording, topic);
    formData.append('langCode', lang)

    $http({
      method: 'POST',
      url: '/onEnd', 
      data: formData,
      responseType: 'arraybuffer',
      contentType: false,
      transformRequest: angular.identity,
      processData: false,
      headers: {'Content-type': undefined}
    })
    .then(function(response) {
      var audioContext = new AudioContext();
      audioContext.decodeAudioData(response.data, function(buffer) {
        mainBuffer = buffer;
        var source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.loop = false;
        source.start(0);
      }, function(err) {
        console.log(err);
      });
    })
     .catch(function(err) {
       console.log('error in postRecording', err);
     });
  };

  this.getLang = (callback) => {
    $http.get('/getLang')
      .then((data) => {
        callback(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  this.getChatLang = (callback) => {
    $http.get('/getChatLang')
      .then((data) => {
        console.log('data in getchatlang in services: ', data);
        callback(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  this.translateText = (text, languageCode, cb) => {
    return $http({
        method: 'POST',
        url: '/translateText', 
        data: {
          text: text,
          languageCode: languageCode 
        },
        headers: {'Content-type': 'application/json'}
     })
  }

  this.changeAudioLanguage = (languageCode) => {
     $http({
        method: 'POST',
        url: '/inputLang', 
        data: {
          languageCode: languageCode 
        },
        headers: {'Content-type': 'application/json'}
     })
    .catch(err => console.log('error changing language'))
  }
  
  // SERVICE USED TO INVOKE LIVE STREAMING FUNCTION IN SERVER

  // this.postStream = function(callback) {

  //   $http({
  //     method: 'POST',
  //     url: '/testStream', 
  //     responseType: 'arraybuffer'
  //   })
  //   .then(function(response) {
  //     var audioContext = new AudioContext();
  //     console.log('response', response);
  //     audioContext.decodeAudioData(response.data, function(buffer) {
  //       mainBuffer = buffer;
  //       var source = audioContext.createBufferSource();
  //       source.buffer = buffer;
  //       source.connect(audioContext.destination);
  //       source.loop = false;
  //       source.start(0);
  //     }, function(err) {
  //       console.log(err);
  //     });
  //   })
  //    .catch(function(err) {
  //      console.log('error in postRecording', err);
  //    });
  // };

  //SERVICE USED TO STOP LIVE STREAM

  // this.stopStream = function(callback) {
  //   $http({
  //     method: 'POST',
  //     url: '/stopStream', 
  //   })
  //   .then(function(data) {
  //     console.log('voice streaming has stopped', data);
  //     // io.disconnect();
  //     if (callback) {
  //       callback(data);
  //     }
  //   })
  //    .catch(function(err) {
  //      console.log('error in stopStream', err);
  //    });
  //   };
});