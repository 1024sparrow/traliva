'---------------init/init.js---------------';
// Функция переключения лэйаутов
function $switchToLayout($layId){
    //console.log('switch to $layout ' + $layId);
    var $d = $Traliva.$__d;
    if ($d.$layout === $layId)
        return;
    #USAGE_BEGIN#debug##
    if (!$d.$o.$layouts.hasOwnProperty($layId)){
        console.log('Указанный лэйаут не описан');
        $layId = undefined;
    }
    #USAGE_END#debug##
    //if ($d.$layout){ // чистим за старым лэйаутом
        // если при этом не валиден $layId (который подчищает за предыдущим виджеты),
        // то это косяк разработчика - оставляем последний валидный лэйаут

        // а если $layId валиден, то construct_layout подчищает за предыдущим лэйаутом

        // итого: здесь мы ничего не делаем
    //}
    //отписываем все текущие виджеты
    var $0;
    if ($layId){ // создаём новый лэйаут
        for ($0 in $Traliva.$widgets){
            delete $Traliva.$widgets[$0];
        }
        var $content = $construct_layout($d.$wRoot, $d.$o.$layouts[$layId], undefined, $d.$o.$widgets, $d.$w);
        if ($content){
            $d.$wRoot.$setContent($content);
        }
    }
    $d.$layout = $layId;
}

$Traliva.$init = function($o){
    #USAGE_BEGIN#debug##
    if ($Traliva.hasOwnProperty('$__d')){
        console.log('Пресечена попытка повторного вызова $Traliva.$init().');
        return;
    }
    #USAGE_END#debug##

    var $0, $1, $3;
    //$0 - i
    //$1 - tmp
    //$3 - cand

    #USAGE_BEGIN#debug##
    console.log('начинаю инициализацию');
    #USAGE_END#debug##
    $1 = fillParam($o);
    #USAGE_BEGIN#debug##
    if (typeof $1 === 'string'){
        console.error('В $Traliva.$init() передан некорректный объект: ' + $1);
        return;
    }
    #USAGE_END#debug##
    $Traliva.$widgets = {};//сюда будут записываться указатели на сгенерированые виджеты для доступа из кода, описанного в $o.states.$stateSubscribers, по идентификатору виджета
    var $d = $Traliva.$__d = {};
    $d.$o = $o;
    $d.$w = {};//widgets (WidgetStateSubscriber)
    $d.$widgets = {};//key: widgetId, value: widget (_WidgetBase)
    if ($o.hasOwnProperty('$initApi')){
        $Traliva.$api = {};
        $o.$initApi($o.$target, $Traliva.$api);
    }
    $d.$logics = [];//сюда будут сохраняться экземпляры LogicsStateSubscriber, чтобы у них вызывать метод $initializeGui()

    $d.$publisher = new $StatePublisher();
    $d.$publisher.$setState($o.$states.$initState);
    if ($Traliva.$debug){
        $d.$__debug = {
            $publisher: new $StatePublisherNoDebug()
        };
        $3 = {
            $show_states: false
        };
        if ($Traliva.$debug.$hasOwnProperty('$url')){
            $3.$url = $Traliva.$debug.$url;
        }
        $d.$__debug.$publisher.$setState($3);

        $d.$__debug.$wRoot = new $Strip($Traliva.$Strip__Orient__vert);
        var $__wDebugPanel = new $Strip($Traliva.$Strip__Orient__hor, $d.$__debug.$wRoot);
            $__wDebugPanel.$_div.className = '$traliva__debug_panel';
            var $__wDebugPanelBnStates = new $Widget($__wDebugPanel);
            $__wDebugPanel.$addItem($__wDebugPanelBnStates, '128px');
            $d.$__debug.$publisher.$registerSubscriber(new $Button($__wDebugPanelBnStates, {$valueVarName: '$show_states', $color: '#48f', $title: 'Состояние'}));
            if ($Traliva.$debug.hasOwnProperty('$url')){
                var $__wDebugPanelUrl = new $Widget($__wDebugPanel);
                $__wDebugPanel.$addItem($__wDebugPanelUrl);
                if ($o.hasOwnProperty('$states') && $o.$states.hasOwnProperty('$tree'))
                    $d.$__debug.$publisher.$registerSubscriber(new $DebugPanelUrlWidget($__wDebugPanelUrl));
                else
                    $__wDebugPanelUrl.$setContent($Traliva.$createElement('<p class="$traliva__debug_panel__error">URL: дерево переходов не задано</p>'));
            }
        $d.$__debug.$wRoot.$addItem($__wDebugPanel, '32px');
        var $__wDebugCanvas = new $Stack($d.$__debug.$wRoot);
        $d.$__debug.$wRoot.$addItem($__wDebugCanvas);
        $3 = new $Widget($__wDebugCanvas);
        $__wDebugCanvas.$addItem($3);
        $d.$wRoot = $3;
        if ($Traliva.$debug.hasOwnProperty('$state')){
            var $__wDebugStates = new $Strip($Traliva.$Strip__Orient__vert, $__wDebugCanvas);
            var $__wDebugStatesExtender = new $Widget($__wDebugStates);
            $__wDebugStates.$addItem($__wDebugStatesExtender, '64px');
            var $__wDebugStatesStates = new $Widget($__wDebugStates);
            $__wDebugStates.$addItem($__wDebugStatesStates);
            $d.$__debug.$publisher.$registerSubscriber(new $DebugStatesWidget($__wDebugStates, $__wDebugStatesExtender, $__wDebugStatesStates));
            $__wDebugCanvas.$addItem($__wDebugStates);
        }
        $d.$__debug.$publisher.$registerSubscriber(new $DebugConsole());
    }
    else
        $d.$wRoot = new $Widget();
    if ($o.$states.hasOwnProperty('$tree')){
        $d.$stateToUriMapper = new $StateToUriMapper({
            $initPath: $o.$states.$initPath,
            $initState: $o.$states.$initState,
            $tree: $o.$states.$tree,
            $stringifyState: $o.$states.$stringifyState
        });
        $d.$publisher.$registerSubscriber($d.$stateToUriMapper);
    }
    
    $d.$wRoot.$_div.className = '$wRoot';//
    $d.$curLayout = undefined;
    $d.$wRoot.$_onResized = function($d, $f){return function($w,$h){
        var $lay = $d.$o.$get_layout($w,$h,$d.$o.$target);
        $Widget.prototype.$_onResized.call($d.$wRoot, $w, $h);
        $f($lay);
        for ($0 = 0 ; $0 < $d.$logics.length ; $0++){
            $d.$logics[$0].$initializeGui($d.$o.$target, $lay);
        }
    };}($d, $switchToLayout);

    for ($0 = 0 ; $0 < $o.$states.$stateSubscribers.length ; $0++){
        $1 = $o.$states.$stateSubscribers[$0];
        #USAGE_BEGIN#debug##
        console.log('Создаётся экземпляр подписчика ' + $1.name);
        #USAGE_END#debug##
        if (typeof $1 === 'function')
            $3 = new $1();
        else
            $3 = (new $1[0]()).$substate($1[1]);
        $d.$logics.push($3);
        $d.$publisher.$registerSubscriber($3);
    }
    if ($o.hasOwnProperty('$extender')){
        $d.$extender = {
            $o: undefined,
            $w: {}, // WidgetStateSubscriber
            $widgets: {}, // _WidgetBase
            $extender: undefined
        };
        var $3 = new $Догрузчик($o.$extender.$getUrl, $d.$extender);
        if ($o.$extender.hasOwnProperty('$substate'))
            $3 = $3.$useSubstate($o.$extender.$substate);
        $d.$publisher.$registerSubscriber($3);
    }
};
'======================================';
