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
            initState: {},
            initPath: '/'
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
    d.w = {};//widgets

    d.wRoot = new Widget();
    d.wRoot._div.className = 'wRoot';//
    d.curLayout = undefined;
    d.wRoot._onResized = function(d, f){return function(w,h){
        var lay = d.o.get_layout(w,h,d.o.target);
        Widget.prototype._onResized.call(d.wRoot, w, h);
        f(lay);
    };}(d, switchToLayout);

    d.publisher = new StatePublisher();
    if (o.hasOwnProperty('tree')){
        d.publisher.registerSubscriber(new StateToUriMapper({
            initPath: o.initPath,
            initState: o.initState,
            tree: o.tree,
            stringifyState: o.stringifyState
        }));
    }
    var i, tmp, cand;
    for (i = 0 ; i < o.states.stateSubscribers.length ; i++){
        tmp = o.states.stateSubscribers[i];
        if (typeof tmp === 'function')
            cand = new tmp();
        else
            cand = (new tmp[0]()).substate(tmp[1]);
        d.publisher.registerSubscriber(cand);
    }
};
