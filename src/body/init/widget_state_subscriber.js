function WidgetStateSubscriber(p_wContainer){
    StateSubscriber.call(this);
    this.__WidgetStateSubscriber = {
        wContainer: p_wContainer
    }
}
WidgetStateSubscriber.prototype = Object.create(StateSubscriber.prototype);
WidgetStateSubscriber.prototype.constructor = WidgetStateSubscriber;
WidgetStateSubscriber.processStateChanges = function(){
}
