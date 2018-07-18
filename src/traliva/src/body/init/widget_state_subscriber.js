function WidgetStateSubscriber(p_wContainer, p_options){
    StateSubscriber.call(this);
    this.__WidgetStateSubscriber = {
        wContainer: p_wContainer
    };
    if (p_options && p_options.hasOwnProperty('bg'))
        p_wContainer._div.style.background = p_options.bg;
}
WidgetStateSubscriber.prototype = Object.create(StateSubscriber.prototype);
WidgetStateSubscriber.prototype.constructor = WidgetStateSubscriber;
WidgetStateSubscriber.prototype.processStateChanges = function(){
};
WidgetStateSubscriber.prototype.destroy = function(){};//уничтожить созданный ранее DOM-элемент
