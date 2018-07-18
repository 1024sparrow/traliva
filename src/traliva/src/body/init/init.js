// Функция переключения лэйаутов
function switchToLayout(layId){
    //console.log('switch to layout ' + layId);
    var d = Traliva.__d;
    if (d.layout === layId)
        return;
    if (!d.o.layouts.hasOwnProperty(layId)){
        console.log('Указанный лэйаут не описан');
        layId = undefined;
    }
    //if (d.layout){ // чистим за старым лэйаутом
        // если при этом не валиден layId (который подчищает за предыдущим виджеты),
        // то это косяк разработчика - оставляем последний валидный лэйаут

        // а если layId валиден, то construct_layout подчищает за предыдущим лэйаутом

        // итого: здесь мы ничего не делаем
    //}
    //отписываем все текущие виджеты
    var i;
    if (layId){ // создаём новый лэйаут
        for (i in Traliva.widgets){
            delete Traliva.widgets[i];
        }
        var content = construct_layout(d.wRoot, d.o.layouts[layId], undefined, d.o.widgets, d.w);
        if (content){
            d.wRoot.setContent(content);
        }
    }
    d.layout = layId;
}

Traliva.init = function(o){
    if (Traliva.hasOwnProperty('__d')){
        console.log('Пресечена попытка повторного вызова Traliva.init().');
        return;
    }

    var i, tmp, cand;

    console.log('начинаю инициализацию');
    tmp = fillParam(o);
    if (typeof tmp === 'string'){
        console.error('В Traliva.init() передан некорректный объект: ' + tmp);
        return;
    }
    Traliva.widgets = {};//сюда будут записываться указатели на сгенерированые виджеты для доступа из кода, описанного в o.states.stateSubscribers, по идентификатору виджета
    var d = Traliva.__d = {};
    d.o = o;
    d.w = {};//widgets (WidgetStateSubscriber)
    d.widgets = {};//key: widgetId, value: widget (_WidgetBase)
    if (o.hasOwnProperty('initApi')){
        Traliva.api = {};
        o.initApi(o.target, Traliva.api);
    }
    d.logics = [];//сюда будут сохраняться экземпляры LogicsStateSubscriber, чтобы у них вызывать метод initializeGui()

    d.publisher = new StatePublisher();
    d.publisher.setState(o.states.initState);
    if (Traliva.debug){
        d.__debug = {
            publisher: new StatePublisherNoDebug()
        };
        cand = {
            show_states: false
        };
        if (Traliva.debug.hasOwnProperty('url')){
            cand.url = Traliva.debug.url;
        }
        d.__debug.publisher.setState(cand);

        d.__debug.wRoot = new Strip(Traliva.Strip__Orient__vert);
        var __wDebugPanel = new Strip(Traliva.Strip__Orient__hor, d.__debug.wRoot);
            __wDebugPanel._div.className = 'traliva__debug_panel';
            var __wDebugPanelBnStates = new Widget(__wDebugPanel);
            __wDebugPanel.addItem(__wDebugPanelBnStates, '128px');
            d.__debug.publisher.registerSubscriber(new Button(__wDebugPanelBnStates, {valueVarName: 'show_states', color: '#48f', title: 'Состояние'}));
            if (Traliva.debug.hasOwnProperty('url')){
                var __wDebugPanelUrl = new Widget(__wDebugPanel);
                __wDebugPanel.addItem(__wDebugPanelUrl);
                if (o.hasOwnProperty('states') && o.states.hasOwnProperty('tree'))
                    d.__debug.publisher.registerSubscriber(new DebugPanelUrlWidget(__wDebugPanelUrl));
                else
                    __wDebugPanelUrl.setContent(Traliva.createElement('<p class="traliva__debug_panel__error">URL: дерево переходов не задано</p>'));
            }
        d.__debug.wRoot.addItem(__wDebugPanel, '32px');
        var __wDebugCanvas = new Stack(d.__debug.wRoot);
        d.__debug.wRoot.addItem(__wDebugCanvas);
        cand = new Widget(__wDebugCanvas);
        __wDebugCanvas.addItem(cand);
        d.wRoot = cand;
        if (Traliva.debug.hasOwnProperty('state')){
            var __wDebugStates = new Strip(Traliva.Strip__Orient__vert, __wDebugCanvas);
            var __wDebugStatesExtender = new Widget(__wDebugStates);
            __wDebugStates.addItem(__wDebugStatesExtender, '64px');
            var __wDebugStatesStates = new Widget(__wDebugStates);
            __wDebugStates.addItem(__wDebugStatesStates);
            d.__debug.publisher.registerSubscriber(new DebugStatesWidget(__wDebugStates, __wDebugStatesExtender, __wDebugStatesStates));
            __wDebugCanvas.addItem(__wDebugStates);
        }
        d.__debug.publisher.registerSubscriber(new DebugConsole());
    }
    else
        d.wRoot = new Widget();
    if (o.states.hasOwnProperty('tree')){
        d.stateToUriMapper = new StateToUriMapper({
            initPath: o.states.initPath,
            initState: o.states.initState,
            tree: o.states.tree,
            stringifyState: o.states.stringifyState
        });
        d.publisher.registerSubscriber(d.stateToUriMapper);
    }
    
    d.wRoot._div.className = 'wRoot';//
    d.curLayout = undefined;
    d.wRoot._onResized = function(d, f){return function(w,h){
        var lay = d.o.get_layout(w,h,d.o.target);
        Widget.prototype._onResized.call(d.wRoot, w, h);
        f(lay);
        for (var i = 0 ; i < d.logics.length ; i++){
            d.logics[i].initializeGui(d.o.target, lay);
        }
    };}(d, switchToLayout);

    for (i = 0 ; i < o.states.stateSubscribers.length ; i++){
        tmp = o.states.stateSubscribers[i];
        console.log('Создаётся экземпляр подписчика ' + tmp.name);
        if (typeof tmp === 'function')
            cand = new tmp();
        else
            cand = (new tmp[0]()).substate(tmp[1]);
        d.logics.push(cand);
        d.publisher.registerSubscriber(cand);
    }
    if (o.hasOwnProperty('extender')){
        d.extender = {
            o: undefined,
            w: {}, // WidgetStateSubscriber
            widgets: {}, // _WidgetBase
            extender: undefined
        };
        var cand = new Догрузчик(o.extender.getUrl, d.extender);
        if (o.extender.hasOwnProperty('substate'))
            cand = cand.useSubstate(o.extender.substate);
        d.publisher.registerSubscriber(cand);
    }
};
