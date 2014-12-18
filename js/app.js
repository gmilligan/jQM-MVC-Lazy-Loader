//***********************************************************
//
// Lazy Loading MVC for jQuery Mobile
//
'use strict';

var app = {

/* --------------------------------------
 Public Properties
*/
  // toggle interface style
  useTabletUI: true,
  $page: null,
  $content: null,
  $header: null,
  content: null,

  // DOM manipulation Library  - github.com/xybersolve/xs-dom-single-node-lib
  nodes : new Nodes(),

/* --------------------------------------
 Public Methods
*/
  initialize: function () {
    var self = this;
    self._initializeSystem();
    self._initializeInterface();
  },
  createMenu: function(id){
    var self = this
       ,$list = null
       ,list = null;
    
    if(! self.useTabletUI){
      $list = $('#main-menu-list');  
    } else if(self.useTabletUI) {
      $list = $('#nav-panel-menu-list');
      self.showMenuButton(true);
    }
    list = $list[0];
    
    for (var moduleKey in self._modules){
      var module = self._modules[moduleKey];
      if(module.isMenuItem){
        var li = self.nodes.insertAny(list, 'li', '');
        var a = self.nodes.insertAny(li, 'a', module.display, {href:'#', id: moduleKey});
      }
    }
    $list.listview().listview('refresh');
    self._setMenuEvents($list);
   },
  showMenuButton: function (show, cb, text) {
    var self = this
       ,$navPanel = $('#nav-panel')
       ,$menuButton = $('#menu-toggle-button')
       ,mode = (show === true) ? 'show' : 'hide';
       
    $menuButton[mode]();
  },
  openNavPanel: function(show){
    var self = this
       ,$navPanel = $('#nav-panel')
       ,mode = (show === true) ? 'open' : 'close';
    
    $navPanel.panel(mode);
    
  },
  showBackButton: function (show, cb, text) {
    var self = this
       ,mode = (show === true) ? 'show' : 'hide'
       ,display = text ? text : 'Back';

    // show or hide button
    $('#go-back-button')[mode]();
    // change the buttons text
    $('#go-back-button .ui-btn-text').text(display);
    if(show){
      $('#go-back-button').off('vclick')
                          .on('vclick', function(e){
        
        self._loadLastModule();
        self.showBackButton(false);
        e.preventDefault();
        e.stopPropagation();

        if(cb) cb();
          
      });
    }
  },
  emptyContent: function () {
    $('#content').empty();
  },
  registerModule: function(module) {
    this._modules[module.name] = module;
  },
  registerModules: function(modules) {
    this._modules = modules;
  },
  loadModule: function (id, cb) {
    var self = this
      , module   = self._modules[id];

    self._currentObject = null;
    self.registerModule(module);
    self._moduleCache.push(module.name);
    self._loadView(id, function () {
      self._loadController(id, cb);
    });
  },
  showPageLoadingMessage: function (msg) {
    if (msg) {
      $.mobile.loadingMessage = true;
      $.mobile.loading('show', { theme: "a",
        text: msg,
        textonly: false
      });
    } else {
      $.mobile.loading('hide');
      //$.mobile.hidePageLoadingMsg();
      //$.mobile.loadingMessage = 'Loading';
    }
  },
  showFeedback: function (id, msg, css, time, cb) {
    time = time || 4000;
    if (css)
      $(id).css(css);

    $(id).show()
     .html(msg)
     .animate({
        opacity: 0
      }, time, function(){
        if(cb) cb();
      });
  },
  writeTitle: function (title) {
    $('#mainTitle').html(title);
  },
  disableItems: function (items, disable) {
    var self = this;
    for (var i = 0; i < items.length; i++) {
      self.disableItem(items[i], disable);
    }
  },
  disableItem: function (id, disable) {
    var self = this;
    if (disable) {
      $(id).addClass('ui-state-disabled');
    } else {
      $(id).removeClass('ui-state-disabled');
    }
  },
  footer: {
    buttons: [
    'new',
    'save',
    'clear',
    'edit',
    'delete'
   ]
  },
  showFooterButtons: function (buttons) {
    var self = this;
    // togle all footer buttons
    for (var i = 0; i < self.footer.buttons.length; i++) {
      // if button in buttons
      var footerButton = self.footer.buttons[i];
      if (buttons.indexOf(footerButton) > -1) {
          // show it
        $('#' + footerButton).show();
      } else {
          // hide it
        $('#' + footerButton).hide();
      }
    }
  },
  hideFooterButtons: function (buttons) {
    var self = this
      , i = null;

    if (!buttons) {
        // hide them all
      for (i = 0; i < self.footer.buttons.length; i++) {
        var footerButton = self.footer.buttons[i];
        $('#' + footerButton).hide();
      }
    } else {
        // hide those passed in
      for (i = 0; i < buttons.length; i++) {
        $('#' + buttons[i]).hide();
      }
    }
  },
  cleanUpPage: function(id) {
    var self = this;
    if (id !== 'Sign') {
      $('#sign-setting-button').hide();
      $('#logout-button').show();
    }
  },
  createPage: function () {
    var self = this;
    // this is faster - use it first
    // if it doesn't work - use 2 below
    self.$content.trigger('create');
  },
  refreshPage: function () {
    var self = this;
    self.$page.trigger('pagecreate');
    return self;
  },
  refreshList: function () {
    var self = this;
    self.$page.listview().listview('refresh');
    return self;
  },
  getPageSize: function(){
    var self = this;
    return {
      height : self.$page.height(),
      width  : self.$page.width()
    };
  },  
  getContentSize: function(){
    var self = this;
    return {
      height : self.$content.height(),
      width  : self.$content.width()
    };
  },  
  getScreenSize: function(){
    // screen.width
    return {
      height : window.innerHeight,
      width  : window.innerWidth
    };
  },

/* --------------------------------------
 Private Properies
*/
  _currentObject: {},
  _scriptCache: [],
  _moduleCache: [],
  _modules: {},

/* --------------------------------------
 Private Methods
*/
  _loadLastModule: function () {
    var self = this;
    // look back 2 modules and load it
    var lastModule = self._moduleCache[self._moduleCache.length - 2];
    self.loadModule(lastModule);
  },
  _loadController: function (id, cb) {
    // load codebehind defined in module structure
    var self = this
      , module = self._modules[id]
      , controller = 'controller/' + module.controller
      , $content = $('#content');

    self.lastId = id;
    self.$content = $content;
    // delete the object that was last used
    self._moduleCache.forEach(function (prop) { delete window[prop]; });
    $.getScript(controller, function () {
      // initialize is a global from the loaded script
      if (initialize) {
        // initialize pass in app and content reference
        // callback returns instantiated object
        initialize($content, app, function (obj) {
          if (obj) {
            self._currentObject = obj;

            // call default method
            self._currentObject.start();
            if(cb) cb();
          }
        });
      }
      // close menu after module load
      $('#navPanel').panel('close');
    });
  },
  _loadView: function (id, cb) {
    // load template defined in module structure
    var self = this
      , module   = self._modules[id]
      , title    = module.title
      , view     = 'view/' + module.view
      , $content = $('#content');

    self.cleanUpPage(id);

    $content.empty();
    $('#mainTitle').html(title);

    // if a template has been defined in the module
    if (module.view != null && module.view.length > 0) {
      $content.load(view, function (responseText, textStatus, req) {
        //self.showBackButton(false);
        // loading new view - hide all footer buttons from last view
        self.hideFooterButtons();
        $content.trigger('create');
        cb();
      });
    } else {
      cb();
    }
  },
  _setMenuEvents: function($list){
    var self = this
      ,$a = $list.find('a');

    $a.off('vclick')
      .on('vclick', function(){
        var moduleId = $(this).attr('id');
        self._gotMenuEvent(moduleId);
      });
  },
  _gotMenuEvent: function(moduleId){
    var self = this;
    if(! self.useTabletUI){
      self.showBackButton(true);
    } else if(self.useTabletUI){
      self.openNavPanel(false);
    }
    self.loadModule(moduleId);
  },
  _initializeSystem: function () {
    var self = this;
    self.$page    = $('#page');
    self.$content = $('#content');
    self.$header  = $('#header');
    self.content  = self.$content[0];
  },
  _initializeInterface: function () {
    var self = this;
    self.showMenuButton(false);
    self.showBackButton(false);
    self.hideFooterButtons(['new', 'save', 'clear', 'edit','delete']);
    self.loadModule('Main');
  }
};

/* --------------------------------------
Sample start up code

// Module Definition Block
// load modules: views and controllers
app.registerModules({
  Main: {
    name: 'Main',
      title: 'Main',
      display: 'Main Page',
      controller: 'Main.js',
      view: 'main.html',
      canBeDefault: true,
      isMenuItem: false
  },
  Module1: {
    name: 'Module1',
      title: 'Module1',
      display: 'View Module 1',
      controller: 'Module1.js',
      view: 'module1.html',
      canBeDefault: true,
      isMenuItem: true
  },
  Module2: {
    name: 'Module2',
    title: 'Module2',
    display: 'View Module 2',
    controller: 'Module2.js',
    view: 'module2.html',
    canBeDefault: true,
    isMenuItem: true
  }
});

// initialize the app
$(document).ready(function(){
  app.initialize();
});

*/