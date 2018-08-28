// -- class $Stack --
function $Stack($p_parentWidget, $p_attr){
	this.$__items = [];
	this.$__zIndexCounter = 1;
    this.$_w = undefined;
    this.$_h = undefined;

	this.$_eStack = document.createElement('div');
	this.$_eStack.style.position = 'relative';
	$_WidgetBase.call(this, $p_parentWidget, $p_attr);
}
$Stack.prototype = Object.create($_WidgetBase.prototype);
$Stack.prototype.constructor = $Stack;
$Stack.prototype.$_createContentElem = function(){
	return this.$_eStack;
}
$Stack.prototype.$_onResized = function($w,$h){
    this.$_w = $w;
    this.$_h = $h;
	for (var $0 = 0 ; $0 < this.$__items.length ; $0++){
		var $item = this.$__items[$0];
		$item.$resize($w,$h);
	}
}
$Stack.prototype.$addItem = function($p_itemWidget){
	if (typeof $p_itemWidget != 'object'){
		console.log('epic fail');
		return;
	}
	if (!($p_itemWidget instanceof $_WidgetBase)){
		console.log('epic fail');
		return;
	}
	$p_itemWidget.$_div.style.position = 'absolute';
	$p_itemWidget.$_div.style.zIndex = this.$__zIndexCounter;
	$p_itemWidget.$_div.style.left = '0';
	$p_itemWidget.$_div.style.top = '0';
	this.$_eStack.appendChild($p_itemWidget.$_div);
	this.$__items.push($p_itemWidget);
    if (this.$_w)
        $p_itemWidget.$resize(this.$_w, this.$_h);

	this.$__zIndexCounter++;
}
$Stack.prototype.$removeItem = function($p_index){
    if ($p_index >= this.$__items.length){
        console.log('epic fail');
        return;
    }
    this.$_eStack.removeChild(this.$__items[$p_index].$_div);
    this.$__items.splice($p_index, 1);
}
$Stack.prototype.$_onChildVisibilityChanged = function($wChild){
    var $0, $1, $2;//$1 - top level widget index
    for ($0 = 0 ; $0 < this.$__items.length ; $0++){
        if (this.$__items[$0].$isVisible())
            $1 = $0;
    }
    for ($0 = 0 ; $0 < this.$__items.length ; $0++){
        $2 = this.$__items[$0];
        $2.$setMouseEventsBlocked($0 !== $1);
    }
}
// -- end class $Stack --
