/**
 * QuiContext library 1.0 by I. Andrienko
 * http://github.com/andrienko/quicontext
 * MIT Licensed
 */

quicontext = {

    strings:{
        attrName:'context-menu',
        attrNameIndex:'menu-item',
        attrNameSkin:'menu-skin',
        elementID:'quicontext',
        elementClass:'quicontext',
        skinPrefix:'quicontext_skin_'
    },
    defaultClicker:function(clickedElement,all_menu_items,menuitem_index,mouse_event){
        console.log('Clicked element number '+menuitem_index+' titled '+all_menu_items[menuitem_index].title);
    },
    skin:'chrome',
    menu:{},
    menu_add:function(menu_id,menu_items){
        if(menu_items.items == undefined)
            this.menu[menu_id] = menu_items;
        else this.menu[menu_id] = menu_items.items;
    },
    getMenu:function(element){
        var selectedElement = element;
        while(element!=null){

            var name = element.getAttribute(this.strings.attrName);
            if(name && this.menu.hasOwnProperty(name))return {
                name:name,
                selectedElement:selectedElement,
                element:element
            };

            element = element.parentElement;
        }
        return null;
    },
    click:function(a){
        this.hideMenu();
        var menu = this.getMenu(a.target);

        if(menu){
            this.displayMenu(a.clientX, a.clientY,this.menu[menu.name], a.target);
            a.preventDefault();
            return false;
        }

        return true;

    },

    hideMenu: function(){
        if(this.element)
            this.element.style.display = 'none';
    },

    clickMenu:function(){
        this.element.style.display = 'none';
    },

    displayMenu: function (x,y, menu ,forElement) {

        var that = this;

        if(this.element==undefined){
            this.element = document.createElement('div');
            this.element.id = this.strings.elementID;
            document.body.appendChild(this.element);
            this.element.onclick = function(e){
                e.stopPropagation();
            }

        }

        var ul = document.createElement('ul');

        for(var index in menu){
            var list_item = document.createElement('li');
            list_item.setAttribute(this.strings.attrNameIndex,index);

            if(menu[index].hidden == true || (typeof menu[index].hidden == 'function' && menu[index].hidden(forElement,menu,index,[x,y]))){}
            else{
                if(menu[index]=='-')list_item.className = 'sep';
                else{
                    list_item.innerHTML = menu[index].title;

                    var disabled = false;

                    if(typeof menu[index].disabled == "function")
                        disabled = menu[index].disabled(forElement,menu,index,[x,y]);

                    else if(menu[index].disabled == true)disabled=true;


                    if(!disabled){
                        list_item.className='clickable';


                        list_item.onclick =   function(e){

                            var clicker = that.defaultClicker;

                            var index = this.getAttribute(that.strings.attrNameIndex);
                            if(typeof menu[index].click == 'function') clicker = menu[index].click;
                            clicker(forElement,menu,index,e);
                            that.hideMenu();
                        };
                    }
                    else list_item.className = 'disabled';
                }
                ul.appendChild(list_item);
            }
        }

        this.element.innerHTML = '';

        var skin = forElement.getAttribute(this.strings.attrNameSkin);
        if(skin == undefined) skin = this.skin;

        this.element.className = this.strings.skinPrefix+skin;
        this.element.appendChild(ul);

        this.element.style.display = 'block';
        this.element.style.left = x + 'px';
        this.element.style.top = y + 'px';

    },

    build:function(){
        var that = this;
        return {
            items:[],
            item:function(title,callback,disabled,hidden){
                this.items.push({title:title,click:callback,disabled:disabled,hidden:hidden});
                return this;
            },
            separator:function(){
                this.items.push('-');
                return this;
            },
            add:function(menu_id){
                that.menu_add(menu_id,this.items);
            }
        };
    },

    element:undefined

};

window.addEventListener('contextmenu',function(a){
    quicontext.click(a);
});

window.addEventListener('click',function(a){
    quicontext.hideMenu();
});


quicontext.strings.menuId = 'menu-id';


document.addEventListener('DOMContentLoaded',function(){

    (function(parent){
        parent.strings.menuId = 'menu-id';
        parent.tools = {

            qsa:function(selector,element){
                if(element == undefined)element = document;
                var nl = element.querySelectorAll(selector);
                var arr = [];
                for(var i = nl.length; i--; arr.unshift(nl[i])){}
                return arr;
            },
            readMenus:function(){
                var menus = this.qsa('['+parent.strings.menuId+']');
                for(var index in menus){
                    this.readMenu(menus[index]);
                    menus[index].remove();
                }
            },
            readMenu:function(menuElement){
                var menuId = menuElement.getAttribute(parent.strings.menuId);
                var menu = parent.build();
                var items = [].slice.call(menuElement.getElementsByTagName('li'));
                for(var index in items){
                    var element = items[index];
                    var title = element.innerHTML;
                    var onclick = element.onclick;

                    if(title=="-")menu.separator();
                    else menu.item(element.innerHTML,onclick);
                }
                menu.add(menuId);
            }

        };

        parent.tools.readMenus();

    })(quicontext);

});


