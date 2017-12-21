function SlotWidget(p_parentWidget, p_attr){
	Stack.call(this, p_parentWidget, p_attr);
}
SlotWidget.prototype = Object.create(Stack.prototype);
SlotWidget.prototype.constructor = SlotWidget;
