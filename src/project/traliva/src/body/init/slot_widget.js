//'---------------init/slot_widget.js---------------';
function $SlotWidget($p_parentWidget, $p_attr){
	$Stack.call(this, $p_parentWidget, $p_attr);
    this.$_layerMap = {};
};
$SlotWidget.prototype = Object.create($Stack.prototype);
$SlotWidget.prototype.constructor = $SlotWidget;

//{{ Защита от вызова методов, которые вызывать не нужно
$SlotWidget.prototype.$addItem = function(){
#USAGE_BEGIN#debug##
    console.log('epic fail');
#USAGE_END#debug##
};
$SlotWidget.prototype.$removeItem = function(){
#USAGE_BEGIN#debug##
    console.log('epic fail');
#USAGE_END#debug##
};
//}}

$SlotWidget.prototype.$setContent = function($p_id, $p_wContent){
    if (this.$_layerMap.hasOwnProperty($p_id)){
#USAGE_BEGIN#debug##
        console.log('epic fail');// перезапись виджетов этот виджет не предполагает
#USAGE_END#debug##
        return;
    }
    $Stack.prototype.$addItem.call(this, $p_wContent);
    this.$_layerMap[$p_id] = {
        $index: this.$__items.length - 1,
        $widget: $p_wContent
    };
};
$SlotWidget.prototype.$removeContent = function($p_id){
    if (!this.$_layerMap.hasOwnProperty($p_id)){
#USAGE_BEGIN#debug##
        console.log('epic fail');
#USAGE_END#debug##
        return;
    }
    var $index = this.$_layerMap[$p_id].$index;
    delete this.$_layerMap[$p_id];
    $Stack.prototype.$removeItem.call(this, $index);
    var $0, $1;
    for ($0 in this.$_layerMap){
        $1 = this.$_layerMap[$0];
        if ($1.$index > $index){
            $1.$index--;
        }
    }
};
$SlotWidget.prototype.$widget = function($p_id){
    if (!this.$_layerMap.hasOwnProperty($p_id)){
#USAGE_BEGIN#debug##
        console.log('epic fail');
#USAGE_END#debug##
        return;
    }
    return this.$_layerMap[$p_id].$widget;
};
//'---------------init/slot_widget.js---------------';
