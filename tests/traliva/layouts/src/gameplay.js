'use strict';

//Traliva.init(--states--, --gui--, --state_subscribers--);

var states = {
    initState:{
    }
    /*tree:{
    },
    initPath:'',
    stringifyState: function(s,b){}*/
}
var gui = {
    /*
        dpi пока всегда 1 (будет 2 для мобил)
        target - на время разработки представлены разные варианты. Когда уже идёт в production, условной компиляцией вырезается всё кроме текущей платформы
    */
    /*
        При прокидывании событий о ресайзе элементов, w и h передаём предварительно помноженные на dpi
    */
    get_layout: function(w, h, target){ // dpi пока всегда 1 (будет 2 для мобил)
        if (w < 512)
            return 'small';
        else if (w < 1280)
            return 'normal';
        return 'large'; 
    },
    layouts:{
        small:{
        },
        normal:{
            type: 'strip',
            orient: 'v',
            items:[
                {
                    widget:{
                        type: 'strip',
                        orient: 'h',
                        items:[
                            {
                                widget: 'header__bnCatalogue',
                                size: '128px'
                            },
                            {
                                widget: 'header__bnSaved',
                                size: '128px'
                            },
                            {}, // stretch
                            {
                                widget: 'header_right__bnAuth',
                                size: '64px'
                            }
                        ]
                    },
                    size: '64px'
                },
                {
                    type: 'chameleon', // приложение внутри приложения (при смене состояния меняются лэйауты, виджеты и вообще весь контент, включая StateSubscriber-ы, задающие логику компонента)
                    //после смены состояния старые подписчики и состояния уничтожаются
                    substate: 'a/b/c', // оттуда берёт сетевой адрес, откуда брать данные по отображению; путь до строки(сетевой адрес)
                    // id - идентификатор состояния Хамелеона
                    get: function(id){} // возвращает сетевой адрес, откуда грузить. Здесь же загружается BOOL, удалять ли загруженное-построенное при смене 
                },
                {
                    // footer
                    widget: 'footer_stub',
                    size: '64px'
                }
            ]
        },
        large:{
        }
    },
    widgets:{
        //catalogue: CatalogueWidget,
        header__bnCatalogue: HeaderButtonCatalogue,
        header__bnSaved: HeaderButtonSaved,
        header_right__bnAuth: HeaderButtonAuth
    }
};
var processors = {};

//Traliva.init('web', states, gui, processors);
//....Traliva.hitState('state_id')
