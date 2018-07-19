'use strict';

/*Traliva.debug = {
    state: true,
    url: 'traliva.ru'
};*/
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
        initState:{
            active: false,
            tab_1: false,
            tab_2: true,
            tab2Data:{
                1: false,
                2: false
            }
        },
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
                    console.log('1');//
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
                    console.log('2');//
                    s.tab_1 = true;
                },
                out: function(s){
                    console.log('3');//
                    s.tab_1 = false;
                }
            },
            tab2:{
                in: function(s){
                    console.log('4');//
                    s.tab_2 = true;
                },
                out: function(s){
                    console.log('5');//
                    s.tab_2 = false;
                },
                children:{
                    _default:{
                        processor: function(s){
                            console.log('6');//
                            s.tab2Data['1'] = false;
                            s.tab2Data['2'] = true;
                        }
                    },
                    1:{
                        in: function(s){
                            console.log('7');//
                            s.tab2Data['1'] = true;
                        },
                        out: function(s){
                            console.log('8');//
                            s.tab2Data['1'] = false;
                        }
                    },
                    2:{
                        in: function(s){
                            console.log('9');//
                            s.tab2Data['2'] = true;
                        },
                        out: function(s){
                            console.log('10');//
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
                retVal += 'tab1/';
            else if (s.tab_2)
                retVal += 'tab2/';
            ifSubstituteCurrentContainer.b = false;
            return retVal;
        },
        stateSubscribers:[
            Logics
        ]
    }
});
