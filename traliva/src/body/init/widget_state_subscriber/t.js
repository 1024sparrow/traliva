/*
Виджет-подписчик.
Принимаемые параметры:
$p_wContainer - виджет, в который будем встраивать контент этого виджета
$p_options - опции. Они определяются либо в секции $layouts, либо в секции $widgets
$p_descr - если виджет-подписчик, создаётся по секции $widgets, сам описывающий объект передётся сюда (со свойствами $constructor, $options, $optionsFromState и т.д.)
*/

{%% array.js %%}
#MASK#$Traliva$scroll:v,h##
function $WidgetStateSubscriber($p_wContainer, $p_options, $p_descr){
    $StateSubscriber.call(this);
    var $1;
    this.$__WidgetStateSubscriber = {
        $wContainer: $p_wContainer,
        $descr: $p_descr,
        $childrenChanged: {}, // set: все значения - 1
        $childrenWidgets: {} // массивы дочерних виджетов (как { $w: <$Widget>, $o: <$WidgetStateSubscriber> })
    };
    if ($p_options){
        if ($p_options.hasOwnProperty('$bg'))
            $p_wContainer.$_div.style.background = $p_options.$bg;
        if ($p_options.hasOwnProperty('$scroll')){
            #USAGE_BEGIN#debug##
            if (typeof $p_otions.$scroll !== 'number' || ($p_otions.$scroll & 0xff !== #m#$Traliva$scroll##))
                console.log('error: опция $scroll должна иметь тип маски {$Traliva$scroll:v,h}');
            #USAGE_END#debug##
            $1 = $p_options.$scroll & #m#$Traliva$scroll:v##;
            if ($1 === ($p_options.$scroll & #m#$Traliva$scroll:h##))
                $p_wContainer.$_div.style.overflow = $1 ? 'auto' : 'hidden';
            else{
                $p_wContainer.$_div.style.overflowY = $1 ? 'auto' : 'hidden';
                $p_wContainer.$_div.style.overflowX = $1 ? 'hidden' : 'auto';
            }
        }
    }
    if ($p_descr){
        console.log('DESCR:', $p_descr);
        this.$__WidgetStateSubscriber.$children = $p_descr.$children || {}; // подсостояния-массивы
    }
    else{
        if ($p_options)
            return $p_options.$_children;
    }
    // return undefined;
};
$WidgetStateSubscriber.prototype = Object.create($StateSubscriber.prototype);
$WidgetStateSubscriber.prototype.constructor = $WidgetStateSubscriber;
$WidgetStateSubscriber.prototype.$container = function(){
    return this.$__WidgetStateSubscriber.$wContainer;
};
{%% process_state_changes.js %%}
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
