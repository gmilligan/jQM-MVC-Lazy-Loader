#jQM-Lazy-Loading-MVC

###Table of Contents 
* [Purpose](#purpose)
* [Tablet or Phone UI](#ui)
* [Footer Buttons](#footer-buttons)
* [app Initialization](#init)
  * [Controller Creation](#controller)
  * [View Creation](#view)
  * [Module Registration * Start](#module)
* [Design Notes](#design)
* [Library Attributes](#attributes)
* [Demo](#demo)

----
<a name="purpose"></a>
##Purpose
Lightweight jQuery Mobile MVC-ish Lazy Loading library. Makes project creation quick and easy.   
* Lazy loads controllers and views. 
* The models are left to the developer. 
* Helper methods make available quick & easy UI features. 

####Notes
This is not meant to be a all encompassing framework (it is only 300 lines of code). 
Rather it is a spring board for certain jQM projects, which want to employ lazy loading.
I have used it in several projects now and it seems to be pretty solid. 

----

<a name="ui"></a>
##Tablet or Phone UI
There are two navigation interfaces (Tablet and Phone).

Setting                  | Interface
-------------------------|-----------------------------------  
`app.useTabletUI=true`   | Tablet oriented Slide Out Navigation Panel without Back Buttons 
`app.useTabletUI=false`  | Phone oriented List Menu with Back Buttons

This could be set using some browser detection code. 
However, it can be hardwired to force one interface over or the other.
So, its is left to the developer to decide the implementation.   

Examples of Navigation Interfaces: 

####Tablet UI (Slide out Menu)
![Tablet UI](http://common.xybersolve.com/jQM-Lazy-Loading-MVC/screenshots/optimized/tablet-composite.png "Tablet UI")

####Phone UI (List Menu, with Back Button)
![Phone UI](http://common.xybersolve.com/jQM-Lazy-Loading-MVC/screenshots/optimized/iphone-composite.png "Phone UI")

----

<a name="footer-buttons"></a>
##Footer Buttons
Perhaps you noticed the footer buttons.
These are displayed using a helper method `showFooterButtons(['new', 'edit', 'delete'])`. 
Buttons displayed in one module are automatically hidden when the next module is loaded (which makes sense).
The syntax to show footer buttons from within a controller is shown in the controller creation code below.

---

<a name="init"></a>
##App Initialization
There are essentially 3 steps to create a running app.
* Code your modules: a Controller and View  
* Register those modules. 
* Start the app: `app.initialize()`

---

<a name="controller"></a>
##Module Creation(Controller & View):

###Controller Creation
Adding a new controller is simple and straight forward.
Controllers should be created in the `/controller` directory. 
There is a modicum of initialization code. 
Modules and Controllers are polymorphic and setup requires:
 
* Module: requires an `initialize($content, app, cb)` function. In `initialize` the Controller is instantiated and returned to `app`.  
* Controller: requires a `start()` method. The `app` calls `start()` once the module is loaded.

```
    // the Module
    // all modules must have initialize function - instantiate controller here
    function initialize($content, app, cb){ 'use strict';
      var theModule1 = new Module1($content, app);
      return cb(theModule1);
    }
    
    // the Controller
    function Module1($content, app){ 'use strict';
      // all modules objects require a start method 
      this.start = function(){
        var self = this;
    
        // setup this module...
        // show footer button
        app.showFooterButtons(['new', 'edit', 'delete']);
    
        // now you write to the view - using "$content" or "querySelector('whatever')"
        ...
    };
 
``` 

===

<a name="view"></a>
###View Creation
Views are autonomous and can contain most any jQuery Mobile HTML markup. They are reside in the `/view` directory.
A new View is loaded into the `#content` element, which is referenced by `app.$content`.
In the Controller a View can be manipulated via the `app.$content`, `document.querySelector('myElem')` or a template lib.

===

<a name="module"></a>
###Module Registration & Start
Object modules are added using the `registerModules({...})` method, like so:

```javascript
 
    // register modules: i.e., controller and view
     
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
    
    // start it up
    $(document).ready(function(){
        app.initialize();
    });
   
``` 

----

<a name="design"></a>
##Design Notes  
#####Open Interface
I have purposely left exposed the "private" properties and methods. 
They are named with a underscore _prefix, like that is going to keep anyone out. 
Dabbling with them may prove useful, but exercise some caution and don't blame me if it breaks.

#####Flat Hierarchy
I have purposefully left this design flat. 
My main objective was to create a simple-simon library with the least amount of code and dependencies.
 

<a name="attributes"></a>
##Library Attributes 
####Methods
===

####Properties
Public properties of `app`:
  
 Property                             | Description
--------------------------------------|----------------------------
`useTabletUI`                         | Toggle Tablet or Phone" type UI.  
`$content`                            | Reference to jQuery wrapped content area of `view`.
`$content`                            | Reference to HTML Element of view's content area.
`$header`                             | Reference to jQuery wrapped header area of `view`.
`$header`                             | Reference to jQuery wrapped $page - entire app page .
`nodes`                               | Reference to XyberSolve DOM manipulation library

Public methods of `app`:

 Method                               | Description
--------------------------------------|----------------------------
`registerModule(module)`              | Register a Module: controller & view.
`registerModules({Module1:{}})`       | Register a block of modules: controllers & views.
`initialize()`                        | Starts app. IS REQUIRED.
`createMenu(id)`                      | Generate a menu as defined in the module definition block (`isMenuItem: true`).     
`showBackButton(show, cb, text)`      | Toggle "Back" button display. Handled automatically for main menu. 
`emptyContent()`                      | Clear the current view..
`showPageLoadingMessage(msg)`         | Give use feedback that a process is running. Call without msg or false to hide.
`showFeedback(id, msg, css, time)`    | Show animated feedback somewhere (`id`) on the display.
`disableItems(items, disable)`        | Enable or disable jQuery Mobile UI elements.
`disableItem(item, disable)`          | Enable or disable a jQuery Mobile UI element.
`showFooterButtons(['new','edit'])`   | Show footer action buttons for working with current view.
`hideFooterButtons(['new','edit'])`   | Hide footer action buttons. No parameter hides all footer buttons.
`createPage()`                        | Ask jQuery Mobile to update all DOM manipulated elements
`refreshPage()`                       | Ask jQuery Mobile to update all DOM manipulated elements.
`refreshList()`                       | Ask jQuery Mobile to update all listview elements in view. 
`getPageSize()`                       | Get page dimensions, returns `{width:nnn, height:nnn}`.
`getContentSize()`                    | Get size of view, returns `{width:nnn, height:nnn}`.
`getScreenSize()`                     | Get size of entire screen, returns `{width:nnn, height:nnn}`.
`writeTitle(title)`                   | Set the text of the app title bar, automatic for module (`module.title`).
`showMenuButton(show, text)`          | Toggles menu button in and set its text.
`openNavPanel(show)`                  | Toggles slide out menu in "Tablet" mode (automatic handled).
`loadModule(id, cb)`                  | Load a module. Generally, library handles this, but it can also be done manually too.

===

Private properties of `app`:

 Property                             | Description
--------------------------------------|----------------------------
`_currentObject`                      | Internal - reference to module object currently loaded.
`_moduleCache`                        | Internal - cache for loaded modules
`_scriptCache`                        | Internal - cache for loaded scripts
`_modules`                            | Internal - houses module definitions

===

Private methods of `app`:

 Method                                | Description
---------------------------------------|----------------------------
`_loadController(id, cb)`              | Internal - loads and register module controller .
`_loadView(id, cb)`                    | Internal - loads HTML as view.
`_loadLastModule()`                    | Internal - part of MVC logic.
`_setMenuEvents($list)`                | Internal - part of menu system.
`_gotMenuEvent(id)`                    | Internal - back part of menu system.    
`_initializeSystem()`                  | Internal - getting the app setup.
`_initializeInterface()`               | Internal - interface setup. 


----

<a name="demo"></a>
##Demo of Project-jQM-MVC
Here is a demonstration of the library in action (in Tablet Mode). 
[Demo of jQM-MVC](http://common.xybersolve.com/jQM-Lazy-Loading-MVC/index.html)
