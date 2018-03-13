'use strict';

Traliva.debug = {
    state: true,
    url: 'traliva.ru'
};
Traliva.init({
    layouts:{
        type: 'strip',
        orient: 'v',
        items:[
            {widget:'w1', size: '50px'},
            {
                widget:{
                    type: 'strip',
                    orient: 'h',
                    items:['bn1', 'bn2']
                },
                size: '50px'
            },
            {widget:'w3'}
        ]
    },
    widgets:{
        w1:{
            constructor: TralivaKit.Button,
            options: {title: 'Нажмите здесь', activeVarName: 'active'}
        },
        bn1:{
            constructor: TralivaKit.Button,
            options: {title: 'Вкладка 1', activeVarName: 'active_1'}
        },
        bn2:{
            constructor: TralivaKit.Button,
            options: {title: 'Вкладка 2', activeVarName: 'active_2'}
        }
    },
    states:{
        initState:{
            active: true
        }/*,
        tree:{
            //
        }*/
    }
});
