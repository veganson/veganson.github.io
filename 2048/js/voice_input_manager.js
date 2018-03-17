function VoiceInputManager() {
  this.events = {};

  var grammar = {
    en: '#JSGF V1.0; grammar directions; public <direction> = left | right | up | down ;'
  };

  this.dictionary = {
    right: 'right',
    left: 'left',
    down: 'down',
    up: 'up',
    stopListening: 'stop listening',
    newGame: 'new game',
    keepPlaying: 'keep playing'
  };

  this.recognition = new webkitSpeechRecognition();
  var speechRecognitionList = new webkitSpeechGrammarList();

  speechRecognitionList.addFromString(grammar.en, 1);
  this.recognition.grammars = speechRecognitionList;
  this.recognition.continuous = true;
  this.recognition.lang = 'en-US';
  this.recognition.interimResults = false;
  this.recognition.maxAlternatives = 1;

  this.listen();
}

VoiceInputManager.prototype.on = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

VoiceInputManager.prototype.emit = function (event, data) {
  var callbacks = this.events[event];

  if (callbacks) {
    callbacks.forEach(function (callback) {
      callback(data);
    });
  }
};

VoiceInputManager.prototype.listen = function () {
  this.logInstructions();
  var self = this;
  var map = {
    [this.dictionary.up]: 0,
    [this.dictionary.right]: 1,
    [this.dictionary.down]: 2,
    [this.dictionary.left]: 3
  };

  this.recognition.start();
  this.recognition.onresult = function(event) {
    var spell = event.results[event.results.length - 1][0]
    .transcript.trim().toLowerCase();
    var mapped = map[spell];
    console.log('Result received: ' + spell);

    if (mapped) {
      return self.emit("move", mapped);
    }

    switch(spell) {
      case self.dictionary.newGame:
        return self.emit("restart");

      case self.dictionary.keepPlaying:
        return self.emit("keepPlaying");

      case self.dictionary.stopListening:
        return self.stopListening();

      default:
        return false;
    }
  };
};

VoiceInputManager.prototype.stopListening = function () {
  this.recognition.stop();
};

VoiceInputManager.prototype.logInstructions = function () {
  console.log('%cMake sure to use https.', css);
  console.log('%cYou need to allow microphone access in order to controll with voice.', css);
  console.log('%cJust say "right", "left", "down", "up", "stop listening", "new game" or "keep playing".', css);
};

var css = "font-size: 2rem; padding: 1.5rem 1rem; background: linear-gradient(15deg, #00a9f1, #cf00f1); color: #fff; font-family: Roboto, sans-serif; text-transform: uppercase; font-weight: 100; font-size: 3rem";
