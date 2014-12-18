// all modules must have initialize function
function initialize($content, app, cb){ 'use strict';
  var theModule1 = new Module1($content, app);
  return cb(theModule1);
}
function Module1($content, app){ 'use strict';
  // all modules objects must have start method
  this.start = function(){
    var self = this;

    // setup this module...
    app.showFooterButtons(['new', 'edit', 'delete']);

    // simple event handling using button #id
    $('#new').on('click', function() {
      // do new stuff here
    });

    // now write to the view - using $content



  };
}