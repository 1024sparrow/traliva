function $LogicsStateSubscriber($p_wContainer){
    $StateSubscriber.call(this);
    this.$__WidgetStateSubscriber = {
        $wContainer: $p_wContainer
    }
};
$LogicsStateSubscriber.prototype = Object.create($StateSubscriber.prototype);
$LogicsStateSubscriber.prototype.constructor = $LogicsStateSubscriber;
$LogicsStateSubscriber.prototype.$initializeGui = function($p_target, $p_layout){
};
