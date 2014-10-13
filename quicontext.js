/**
 * QuiContext library
 * version 1.0
 * (c) I. Andrienko, 2014
 */

quicontext = {

    strings:{
        attrName:'context-menu',
        elementID:'quicontext'
    },
    menu:{},
    menu_add:function(menu_id,menu_items){
        this.menu[menu_id] = menu_items;
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

        console.log(x,y);
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
            if(menu[index]=='-')list_item.className = 'sep';
            else{
                list_item.innerHTML = index;
                list_item.onclick =   function(e){
                    menu[e.target.innerHTML](forElement,menu,e.target.innerHTML,e);
                    that.hideMenu();
                };
            }
            ul.appendChild(list_item);
        }

        this.element.innerHTML = '';
        this.element.appendChild(ul);

        this.element.style.display = 'block';
        this.element.style.left = x + 'px';
        this.element.style.top = y + 'px';

    },

    element:undefined

};


window.addEventListener('contextmenu',function(a){
    quicontext.click(a);
});

window.addEventListener('click',function(a){
    quicontext.hideMenu();
});