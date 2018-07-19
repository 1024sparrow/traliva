'use strict';
/*auth*/

EXTERNAL = {
    layouts:{
        canvas:{
            type: 'strip',
            orient: 'h',
            items:[
                {
                    widget: 'aa'
                },
                {
                    widget: 'bb'
                },
                {
                    widget: 'canvas'//тест на отсутвие конфликтов с виджетом с таким же идентификатором в продолжении более другого уровня (на верхнем уровне у нас 'canvas')
                }
            ]
        }
    },
    widgets:{
    },
    states:{
    }
    //extender
    //hideWidgets: true
}
