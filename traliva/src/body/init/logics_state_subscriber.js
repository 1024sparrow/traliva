function $LogicsStateSubscriber(){
    $StateSubscriber.call(this);
};
$LogicsStateSubscriber.prototype = Object.create($StateSubscriber.prototype);
$LogicsStateSubscriber.prototype.constructor = $LogicsStateSubscriber;
$LogicsStateSubscriber.prototype.$initializeGui = function($p_target, $p_layout){
};
