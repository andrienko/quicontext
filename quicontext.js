/**
 * QuiContext library 1.0 by I. Andrienko
 * http://github.com/andrienko/quicontext
 * MIT Licensed
 */

quicontext = {

    strings:{
        attrName:'context-menu',
        attrNameIndex:'menu-item',
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

    displayMenu: function (x,y, menu,forElement) {

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
        this.element.className = this.strings.skinPrefix+this.skin;
        this.element.appendChild(ul);

        this.element.style.display = 'block';
        this.element.style.left = x + 'px';
        this.element.style.top = y + 'px';

    },

    build:function(){
        return {
            items:[],
            item:function(title,callback,disabled,hidden){
                this.items.push({title:title,click:callback,disabled:disabled,hidden:hidden});
                return this;
            },
            separator:function(){
                this.items.push('-');
                return this;
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