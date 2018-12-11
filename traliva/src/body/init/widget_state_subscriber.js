/*
Виджет-подписчик.
Принимаемые параметры:
$p_wContainer - виджет, в который будем встраивать контент этого виджета
$p_options - опции. Они определяются либо в секции $layouts, либо в секции $widgets
$p_descr - если виджет-подписчик, создаётся по секции $widgets, сам описывающий объект передётся сюда (со свойствами $constructor, $options, $optionsFromState и т.д.)
*/
$WidgetStateSubscriber__makeArrayReportable = function(p_reportTaker, p_arr){
    /*
    $set:
    один параметр (массив) - полная замена массива
    два параметра (индекс, значение) - замена отдельного элемента массива. Предполагается, что элемент изменился, и мы должны применить эти изменения.
    */
    p_arr.set = function($0, $1){
        if ($0 instanceof Array){
            // boris here
        }
        else{
            // boris here
        }
    };
    p_arr.push = function($0){
        //boris here
    };
    p_arr.pop = function($0){
        //boris here
    };
    p_arr.shift = function($0){
        //boris here
    };
    p_arr.unshift = function($0){
        //boris here
    };
    p_arr.splice = function($p_0, $p_1){
        //boris here
    };
};
function $WidgetStateSubscriber($p_wContainer, $p_options, $p_descr){
    $StateSubscriber.call(this);
    var $1;
    this.$__WidgetStateSubscriber = {
        $wContainer: $p_wContainer,
        $descr: $p_descr,
        $children: {}
    };
    if ($p_options && $p_options.hasOwnProperty('$bg'))
        $p_wContainer.$_div.style.background = $p_options.$bg;
};
$WidgetStateSubscriber.prototype = Object.create($StateSubscriber.prototype);
$WidgetStateSubscriber.prototype.constructor = $WidgetStateSubscriber;
$WidgetStateSubscriber.prototype.$processStateChanges = function(s){
    /*вызовите этот базовый метод в начале своей реализации этого метода*/
    if (!s){
        console.error('epic fail');
        return;
    }
    var $0, $1,
        $descr = this.$__WidgetStateSubscriber.$descr,
        $arrSubstate
    ;
    //if ($descr.$substate)
    if ($descr.$children){
        $0 = $descr
        for ($1 in $descr.$children){
            $arrSubstate = s;
            if ($descr.$children[$1].$substate){
                $0 = $descr.$children[$1].$substate.split('/');
                while (($arrSubstate !== undefined) && $0.length){
                    $arrSubstate = $arrSubstate[$0.shift()];
                }
            }
            if ($arrSubstate === this.$__WidgetStateSubscriber.$children[$1]){
            }
            else{
                $WidgetStateSubscriber__makeArrayReportable(this, $arrSubstate);
                this.$__WidgetStateSubscriber.$children[$1] = $arrSubstate;
                #USAGE_BEGIN#debug##if (!($arrSubstate instanceof Array))console.log('epic fail');#USAGE_END#debug##
            }
        }
    }
};
$WidgetStateSubscriber.prototype.$destroy = function(){};//уничтожить созданный ранее DOM-элемент
//$WidgetStateSubscriber.prototype.$_increaseChildrenSize
