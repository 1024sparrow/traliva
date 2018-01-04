'use strict';

Traliva.debug = {
    states: true,
    url: 'traliva.ru'
};
Traliva.init({
    layouts:{
        type: 'strip',
        orient: 'v',
        items:[ {widget:'w1'}, {widget:'w2'} ]
    },
    widgets:{
        w1:{
            constructor: TralivaKit.Button,
            options: {title: 'Нажмите здесь', activeVarName: 'active'}
        }
    },
    states:{
        initState:{
            active: false
        }
    }
});
