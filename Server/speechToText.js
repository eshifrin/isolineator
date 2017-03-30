const fs = require('fs');

if (process.env.GOOGLE_PRIVATE_KEY_ID) {
  var credentials = {
    type: "service_account",
    project_id: "isolineator-162918",
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
    client_email: "isolineator@isolineator-162918.iam.gserviceaccount.com",
    client_id: "108655960826759356460",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://accounts.google.com/o/oauth2/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/isolineator%40isolineator-162918.iam.gserviceaccount.com"
  }
  var Speech = require('@google-cloud/speech')({
    projectId: 'isolineator-162918',
    credentials: credentials
  });
} else {
  var Speech = require('@google-cloud/speech')({
    projectId: 'isolineator-162918',
    keyFilename: './APIs/isolineator-a25b826f81b6.json'
  });
}

var options = {
  encoding: 'LINEAR16',
  sampleRate: 44100,
  languageCode: 'ru'
};

const request = {
  config: {
    encoding: 'LINEAR16',
    sampleRate: 16000
  },
  singleUtterance: false,
  interimResults: true, // maybe to false
  verbose: true
};
//##############to create a file first then transcribe##########
exports.createAndStream = (file, callback) => {
  return fs.createWriteStream(file)
    .on('finish', () => {
      exports.streamFile(file, callback);
    })
};

//Update language of recording
exports.updateLanguage = (req, res) => {
  console.log('getting code', req.body.languageCode)
  options.languageCode = req.body.languageCode;
  res.end();
}

//################for streaming audio from a file already created###################
exports.streamFile = (file, callback) => {
  fs.createReadStream(file)
  .on('error', console.error)
  .pipe(Speech.createRecognizeStream(request))
  .on('error', console.error)
  .on('data', function(data) {
    callback(data)
  })
};

///////////for direct mic to api//////////////////
exports.liveStreamAudio = (callback) => {
  return Speech.createRecognizeStream(request)
    .on('error', console.error)
    .on('data', (data) => {
      callback(data);
    });
}

//################normal synchronus####################
exports.syncAudio = (file, callback) => {
  Speech.recognize(file, options)
  .then((results) => {
    const transcription = results[0];
    return transcription;
  })
  .then((data) => {
    callback(data);
  })
  .catch((err) => {
    console.log(err);
  });
}