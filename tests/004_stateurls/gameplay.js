'use strict';

Traliva.debug = {
    state: true,
    url: 'traliva.ru'
};
Traliva.init({
    layouts:{
        bg: '#000',
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
            //{widget:'w3'}
            {
                widget:{
                    type: 'stack',
                    items:[
                        'qwerty',
                        {
                            widget:{
                                id: 'body',
                                bg:'',
                                type: 'strip',
                                orient: 'v',
                                items:['bn21','bn22']
                            }
                        }
                    ]
                }
            }
        ]
    },
    widgets:{
        w1:{
            constructor: TralivaKit.Button,
            options: {title: 'Нажмите здесь', activeVarName: 'active'}
        },
        bn1:{
            constructor: TralivaKit.Button,
            options: {title: 'Вкладка 1', activeVarName: 'tab_1'}
        },
        bn2:{
            constructor: TralivaKit.Button,
            options: {title: 'Вкладка 2', activeVarName: 'tab_2'}
        },
        bn21:{
            constructor: TralivaKit.Button,
            options: {title: 'Подраздел 1', activeVarName: '1'},
            substate: 'tab2Data'
        },
        bn22:{
            constructor: TralivaKit.Button,
            options: {title: 'Подраздел 2', activeVarName: '2'},
            substate: 'tab2Data'
        }
    },
    states:{
        initState:{
            active: false,
            tab_1: true,
            tab_2: false,
            tab2Data:{
                1: false,
                2: false
            }
        },
        /*tree:{
            //
        }*/
        stateSubscribers:[
            Logics
        ]
    }
});
