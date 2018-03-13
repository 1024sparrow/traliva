'use strict';

Traliva.debug = {
    state: true,
    url: 'traliva.ru'
}
Traliva.init({
    target: 'web',
    get_layout: function(w,h,t){return w > h ? 'wide' : 'narrow'},
    layouts:{
        wide:{
            type: 'strip',
            orient: 'h',
            items:[
                {widget: 'w1'},
                {widget: 'w2'},
                {widget: 'w3'}
            ]
        },
        narrow:{
            type: 'strip',
            orient: 'v',
            items:[
                {widget: 'w1', size: '128px'},
                {widget: 'w2'}
            ]
        }
    },
    widgets:{}
});
