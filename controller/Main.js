// all modules must have initialize function
function initialize($content, app, cb){ 'use strict';
  var theMain = new Main($content, app);
  return cb(theMain);
}

// all module objects must have a "start" method
function Main($content, app) { 'use strict';
  // all modules must have start method
  this.start = function () {
    console.log('Invoke start(): Main controller');
    var self = this;
    // Main module in this app tells app to create menu
    app.createMenu();
  };
}