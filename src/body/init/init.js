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
    //отписываем все текущие виджеты
    var newWidget;
    if (layId){
        var content = construct_layout(d.o.layouts[layId], d.o.widgets, d.w);
        if (content){
            d.w.root.setContent(content, '#f00');
        }
    }
    d.w.root.setContent(newWidget);
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
    d.w.root = new Widget();
    d.curLayout = undefined;
    d.w.root._onResized = function(d, f){return function(w,h){
        var lay = d.o.get_layout(w,h,d.o.target);
        f(lay);
    };}(d, switchToLayout);
};
