function $StubWidget__getBgByNum($N){
    var $colorCount = 7;
    var $directionCount = 5;
    var $imageCount = 6;

    var $c, // color index
        $d, // direction index
        $i; // image index
    $c = $N % $colorCount;
    $N -= $c;
    $d = $N % $directionCount;
    $N -= $d;
    $i = $N % $imageCount;
    return 'bg-'+$c+'-'+$d+'-'+$i;
}

var $StubWidget__stubWidgets = {};//stubWidgetId's set
var $StubWidget__stubWidgetCount = 0;
function $StubWidget($p_wContainer, $p_id){
    $WidgetStateSubscriber.call(this, $p_wContainer);
    var $e = document.createElement('div');
    $e.innerHTML = '<div class="$traliva__stub_widget__text">id: "'+$p_id+'"</div>';
    $p_wContainer.$setContent($e);

    var $bg;
    if ($StubWidget__stubWidgets.hasOwnProperty($p_id))
        $bg = $StubWidget__stubWidgets[$p_id];
    else{
        $bg = $StubWidget__getBgByNum($StubWidget__stubWidgetCount);
        $StubWidget__stubWidgets[$p_id] = $bg;
        $StubWidget__stubWidgetCount++;
    }
    $p_wContainer.$_div.className = '$traliva__stub_widget ' + $bg;
}
$StubWidget.prototype = Object.create($WidgetStateSubscriber.prototype);
$StubWidget.prototype.constructor = $StubWidget;
$StubWidget.prototype.$processStateChanges = function(){}
$WidgetStateSubscriber.prototype.$destroy = function(){};//уничтожить созданный ранее DOM-элемент
