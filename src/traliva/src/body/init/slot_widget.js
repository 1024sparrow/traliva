function SlotWidget(p_parentWidget, p_attr){
	Stack.call(this, p_parentWidget, p_attr);
    this._layerMap = {};
}
SlotWidget.prototype = Object.create(Stack.prototype);
SlotWidget.prototype.constructor = SlotWidget;

//{{ Защита от вызова методов, которые вызывать не нужно
SlotWidget.prototype.addItem = function(){
    console.log('epic fail');
};
SlotWidget.prototype.removeItem = function(){
    console.log('epic fail');
};
//}}

SlotWidget.prototype.setContent = function(p_id, p_wContent){
    if (this._layerMap.hasOwnProperty(p_id)){
        console.log('epic fail');// перезапись виджетов этот виджет не предполагает
        return;
    }
    Stack.prototype.addItem.call(this, p_wContent);
    this._layerMap[p_id] = {
        index: this.__items.length - 1,
        widget: p_wContent
    };
}
SlotWidget.prototype.removeContent = function(p_id){
    if (!this._layerMap.hasOwnProperty(p_id)){
        console.log('epic fail');
        return;
    }
    var index = this._layerMap[p_id].index;
    delete this._layerMap[p_id];
    Stack.prototype.removeItem.call(this, index);
    var i, tmp;
    for (i in this._layerMap){
        tmp = this._layerMap[i];
        if (tmp.index > index){
            tmp.index--;
        }
    }
}
SlotWidget.prototype.widget = function(p_id){
    if (!this._layerMap.hasOwnProperty(p_id)){
        console.log('epic fail');
        return;
    }
    return this._layerMap[p_id].widget;
}
