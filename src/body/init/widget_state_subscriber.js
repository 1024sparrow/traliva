function WidgetStateSubscriber(p_wContainer){
    StateSubscriber.call(this);
    this.__WidgetStateSubscriber = {
        wContainer: p_wContainer
    }
}
WidgetStateSubscriber.prototype = Object.create(StateSubscriber.prototype);
WidgetStateSubscriber.prototype.constructor = WidgetStateSubscriber;
WidgetStateSubscriber.prototype.processStateChanges = function(){
};
WidgetStateSubscriber.prototype.destroy = function(){};//уничтожить созданный ранее DOM-элемент
