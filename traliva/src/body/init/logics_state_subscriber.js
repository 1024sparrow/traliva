function $LogicsStateSubscriber($p_changeFlags){
    $StateSubscriber.call(this, $p_changeFlags);
};
$LogicsStateSubscriber.prototype = Object.create($StateSubscriber.prototype);
$LogicsStateSubscriber.prototype.constructor = $LogicsStateSubscriber;
$LogicsStateSubscriber.prototype.$initializeGui = function($p_target, $p_layout){
};
