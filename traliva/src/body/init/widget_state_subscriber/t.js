/*
Виджет-подписчик.
Принимаемые параметры:
$p_wContainer - виджет, в который будем встраивать контент этого виджета
$p_options - опции. Они определяются либо в секции $layouts, либо в секции $widgets
$p_descr - если виджет-подписчик, создаётся по секции $widgets, сам описывающий объект передётся сюда (со свойствами $constructor, $options, $optionsFromState и т.д.)
*/

{%% array.js %%}
function $WidgetStateSubscriber($p_wContainer, $p_options, $p_descr){
    $StateSubscriber.call(this);
    var $1;
    this.$__WidgetStateSubscriber = {
        $wContainer: $p_wContainer,
        $descr: $p_descr,
        $children: {}, // подсостояния-массивы
        $childrenChanged: {}, // set: все значения - 1
        $childrenWidgets: {} // массивы дочерних виджетов
    };
    if ($p_options && $p_options.hasOwnProperty('$bg'))
        $p_wContainer.$_div.style.background = $p_options.$bg;
};
$WidgetStateSubscriber.prototype = Object.create($StateSubscriber.prototype);
$WidgetStateSubscriber.prototype.constructor = $WidgetStateSubscriber;
$WidgetStateSubscriber.prototype.$container = function(){
    return this.$__WidgetStateSubscriber.$wContainer;
};
$WidgetStateSubscriber.prototype.$processStateChanges = function(s){
    /*вызовите этот базовый метод в начале своей реализации этого метода*/
    if (!s){
        console.error('epic fail');
        return;
    }
    var $0, $1, $2,
        $descr = this.$__WidgetStateSubscriber.$descr,
        $arrSubstate,
        $cand, /*=undefined*/
        $tmp;
    ;
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
                if (this.$__WidgetStateSubscriber.$childrenChanged[$1]){
                    if (!$cand)
                        $cand = {};
                    $cand[$1] = [];
                }
            }
            else{
                $WidgetStateSubscriber__makeArrayReportable(this, $arrSubstate, $1);
                this.$__WidgetStateSubscriber.$children[$1] = $arrSubstate;
                #USAGE_BEGIN#debug##if (!($arrSubstate instanceof Array))console.log('epic fail');#USAGE_END#debug##
                if (!$cand)
                    $cand = {};
                $cand[$1] = [];
            }
        }
        if ($cand){
            $0 = {};
            for ($1 in $cand){
                $0[$1] = [];
                for ($2 = 0 ; $2 < this.$__WidgetStateSubscriber.$childrenWidgets[$1].length ; ++$2){
                    $tmp = Object.create($descr.$children[$1].$options || null);
                    $tmp.$_widget = this.$__WidgetStateSubscriber.$childrenWidgets[$1][$2];
                    $0[$1].push($tmp);
                }
            }
            this.$_updateLayout($0);
        }
    }
    console.log('WSS::processStateChanges: ', this);//
};
$WidgetStateSubscriber.prototype.$destroy = function(){};//уничтожить созданный ранее DOM-элемент, вызывается перед отписыванием от издателя
//$WidgetStateSubscriber.prototype.$_increaseChildrenSize
$WidgetStateSubscriber.prototype.$_updateLayout = function($p){
};
var $WidgetStateSubscriber__reSize = /^(\d+)(\s*)((px)|(part))$/;
$WidgetStateSubscriber.prototype.$_transformStringSize = function($str){
	//Почему невалидное значение по умолчанию - чтобы для программиста не прошло незамеченным.
	var $retVal = {#USAGE_BEGIN#debug##$value:undefined, $unit:undefined}#USAGE_END#debug##};
	if ($str){
		//работа с регулярными выражениями
		var $0 = $str.match($WidgetStateSubscriber__reSize);
		if ($0){
			$retVal.$value = parseInt($0[1]);
			$retVal.$unit = $0[3];
		}
		else{
			console.log('error: incorrect size parameter (incorrect string)');
		}
	}
	else{
		$retVal.$value = 1;
		$retVal.$unit = 'part';
	}
	//console.log(JSON.stringify($retVal));
	return $retVal;
};
