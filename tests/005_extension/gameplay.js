'use strict';
Traliva.debug = {
    state: true
}

// Класс виджета Button. Параметром конструктора передаётся id, который должен быть записан корневое свойство 'value'
function Button(p_wContainer, p_options){// options: title, id, valueVarName - имя свойства, в которое сохранять значение
    Traliva.WidgetStateSubscriber.call(this, p_wContainer);
    var e = Traliva.createElement(p_options.title);
    e.className = 'bn';
    e.addEventListener('click', function(self, opt){return function(){
        self._state[opt.valueVarName] = opt.id;
        self._registerStateChanges();
    };}(this, p_options));
    p_wContainer.setContent(e);
}
Button.prototype = Object.create(Traliva.WidgetStateSubscriber.prototype);
Button.prototype.constructor = Button;

Traliva.init({

layouts:{
    type: 'strip',
    orient: 'v',
    items:[
        {
            size: '64px',
            widget:{
                type: 'strip',
                orient: 'h',
                items: [
                    {widget: 'bnCatalogue', size: '128px'},
                    {},
                    {widget: 'bnAuth', size: '128px'}
                ]
            }
        },
        {
            widget: 'canvas'
        }
    ]
},
widgets:{
    bnCatalogue:{
        constructor: Button,
        options: {id:'catalogue', title:'Каталог', valueVarName:'mode'}
    },
    bnAuth:{
        constructor: Button,
        options: {id:'auth', title:'Авторизация', valueVarName:'mode'}
    }
},
states:{
    initState:{
        value1: '1',
        value2: 2
    }
},
extender:{
    getUrl: function(extId){
        return extId + '/gameplay.js';
    },
    substate: 'mode'
    //ifSave: false
}

}); // Traliva.init()
