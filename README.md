QuiContext
=====================
JS context menu library for modern browsers

Yet another useless library. Written for chrome extension, then decided to develop separately...
It's day will come, trust me. Eventually.

Features
---
 - Right-click element to get custom, GoogleChrome-looking context menu.
 - Menus assignable by custom element attribute
 
Usage
---

### 1. Define the menu

First you have to define the menu. Each menu is a part of quicontext.menu object:

    quicontext.menu.demo_menu = [
        {title:'Hello, world',click:function(){alert('Hello, world!')}},
    ];
 
Each menu is an array, containing objects. Each object has several indexes:

 - `title` which contains menu title. This one is mandatory.
 - `click` which contains the function that should be called upon click. If this one is not set an item will be disabled
 - `disabled` (optional) which, if set to true, will make element disable. Also, if this is set to function returning
 true element will also be disabled.
 - `hidden` (optional) almost same as disabled, but this one will hide an element completely.
 - **Planned** `submenu` (optional) an array of menuitems in same format, which will be elements of child menu

### 2. Assign the menu to an element

Add an element with `context-menu` custom attribute and assign name of your menu (<strong>demo_menu</strong> in our case):

    <div class="center" context-menu="demo_menu">Right-click me.</div>
    
Et voila. Upon click on that element your menu should appear. Child elements have higher priority than parent in this.
 
Future plans
---
 - Nested menus
 - Icons (and sprites)
 - Maybe support for IE8 or something
 - URLs
 - Check-functions for titles