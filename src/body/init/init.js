// Функция, разворачивающая сокращённую форму записи в полную
function fillParam(o){
    //not implemented
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
};
