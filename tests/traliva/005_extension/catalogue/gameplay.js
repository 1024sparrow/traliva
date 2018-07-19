'use strict';
/*catalogue*/

function Button(p_wContainer, p_options){
    Traliva.WidgetStateSubscriber.call(this, p_wContainer);
};
Button.prototype = Object.create(Traliva.WidgetStateSubscriber.prototype);
Button.prototype.constructor = Button;

EXTERNAL = {
    layouts:{
        canvas:{
            type: 'strip',
            orient: 'h',
            items:[
                {
                    size: '256px',
                    widget:'a'
                },
                {
                    widget: 'b'
                }
            ]
        }
    },
    widgets:{
    },
    states:{
    }
    //extender: .. ,
    //hideWidgets: true // возможные значения: true ; false ; ['widget_1', ...] .
};
