// all modules must have initialize function
function initialize($content, app, cb){ 'use strict';
  var theModule2 = new Module2($content, app);
  return cb(theModule2);
}

function Module2($content, app){ 'use strict';
  // all modules must have start method
  this.start = function(){
    var self = this;

    // setup this module
    console.log('Invoke start(): Module 2 controller' );
  };
}