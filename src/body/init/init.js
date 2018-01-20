// Функция, разворачивающая сокращённую форму записи в полную
function fillParam(o){
    //not implemented
    var t;
    if (!o.hasOwnProperty('get_layout')){
        o.get_layout = function(){return 'a'};
        t = o.layouts;
        o.layouts = {a:t};
    }
    if (!o.hasOwnProperty('states')){
        o.states = {
            initState: {}
        }
    }
    if (!o.states.hasOwnProperty('stateSubscribers'))
        o.states.stateSubscribers = [];

    if (!o.hasOwnProperty('widgets'))
        o.widgets = {};
}

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
    if (layId){ // создаём новый лэйаут
        var content = construct_layout(d.wRoot, d.o.layouts[layId], d.o.widgets, d.w);
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
    console.log('начинаю инициализацию');
    fillParam(o);
    var d = Traliva.__d = {};
    d.o = o;
    d.w = {};//widgets (WidgetStateSubscriber)
    d.widgets = {};//key: widgetId, value: widget (_WidgetBase)

    var i, tmp, cand;

    d.publisher = new StatePublisher();
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
                d.__debug.publisher.registerSubscriber(new DebugPanelUrlWidget(__wDebugPanelUrl));
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
    
    d.wRoot._div.className = 'wRoot';//
    d.curLayout = undefined;
    d.wRoot._onResized = function(d, f){return function(w,h){
        var lay = d.o.get_layout(w,h,d.o.target);
        Widget.prototype._onResized.call(d.wRoot, w, h);
        f(lay);
    };}(d, switchToLayout);

    if (o.states.hasOwnProperty('tree')){
        d.publisher.registerSubscriber(new StateToUriMapper({
            initPath: o.states.initPath,
            initState: o.states.initState,
            tree: o.states.tree,
            stringifyState: o.states.stringifyState
        }));
    }
    else if (o.states.hasOwnProperty('initState'))
        d.publisher.setState(o.states.initState);
    for (i = 0 ; i < o.states.stateSubscribers.length ; i++){
        tmp = o.states.stateSubscribers[i];
        if (typeof tmp === 'function')
            cand = new tmp();
        else
            cand = (new tmp[0]()).substate(tmp[1]);
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
