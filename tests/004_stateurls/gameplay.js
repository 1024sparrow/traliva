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
                                id: 'tab2_content',
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
        /*initState:{
            active: false,
            tab_1: true,
            tab_2: false,
            tab2Data:{
                1: false,
                2: false
            }
        },*/
        tree:{
            /*
                /tab1
                /tab1/active
                /tab2/1
                /tab2/1/active
                два варианта: как подURLы и как параметр (это про 1 и 2)
            */
            _default:{
                processor: function(s){
                    s.active = false;
                    s.tab_1 = true;
                    s.tab_2 = false;
                    s.tab2Data = {
                        1: false,
                        2: false
                    };
                }
            },
            tab1:{
                in: function(s){
                    s.tab_1 = true;
                },
                out: function(s){
                    s.tab_1 = false;
                }
            },
            tab2:{
                in: function(s){
                    s.tab_2 = true;
                },
                out: function(s){
                    s.tab_2 = false;
                },
                children:{
                    _default:{
                        processor: function(s){
                            s.tab2Data['1'] = false;
                            s.tab2Data['2'] = true;
                        }
                    },
                    1:{
                        in: function(s){
                            s.tab2Data['1'] = true;
                        },
                        out: function(s){
                            s.tab2Data['1'] = false;
                        }
                    },
                    2:{
                        in: function(s){
                            s.tab2Data['2'] = true;
                        },
                        out: function(s){
                            s.tab2Data['2'] = false;
                        }
                    }
                }
            }
        },
        initPath: '/',
        stringifyState: function(s, ifSubstituteCurrentContainer){
            var retVal = '/';
            if (s.tab_1)
                retVal.append('tab1/');
            else if (s.tab_2)
                retVal.append('tab2/');
            return retVal;
        },
        stateSubscribers:[
            Logics
        ]
    }
});
