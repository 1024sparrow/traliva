function checkConstructorForInheritance(p_validating, p_validatingFor){
    //return (new p_validating()) instanceof p_validatingFor;

    var i;
    var counter = 0;
    for (i = p_validating.prototype ; i ; i = i.constructor.prototype.__proto__){
        if (i.constructor === p_validatingFor)
            return true;
    }
    return false;
}

// Функция, разворачивающая сокращённую форму записи в полную
function fillParam(o){
    var i, t, t1;

    // сначала проверим корректность Traliva.debug
    if (Traliva.hasOwnProperty('debug')){
        if (typeof Traliva.debug !== 'object')
            return '';
    }

    if (typeof o !== 'object'){
        return 'В Traliva.init() необходимо передать объект. Для начала укажите свойство "get_layout"(функция) или "layouts"(объект)';
    }
    if (!o.hasOwnProperty('get_layout')){
        o.get_layout = function(){return 'a'};
        t = o.layouts;
        if (!(typeof t === 'string' || ((typeof t === 'object') && (t.hasOwnProperty('type')))))
            return 'Если свойство "get_layout" опущено, то в свойстве "layouts" ожидается лэйаут - либо строковый идентификатор виджета, либо объект с обязательным свойством "type"';
        o.layouts = {a:t};
    }
    if (!o.hasOwnProperty('states')){
        o.states = {
            initState: {}
        }
    }
    if (o.states.hasOwnProperty('stateSubscribers')){
        for (i = 0 ; i < o.states.stateSubscribers.length ; i++){
            if (!checkConstructorForInheritance(o.states.stateSubscribers[i], Traliva.LogicsStateSubscriber))
                return 'Класс "' + o.states.stateSubscribers[i].name + '", указанный в states.stateSubscribers, не наследуется от Traliva.LogicsStateSubscriber';
        }
    }
    else
        o.states.stateSubscribers = [];
    if (o.states.hasOwnProperty('tree')){
        if (!o.states.initPath || !o.states.stringifyState)
            return 'Если вы указали свойство "tree", то должны также указать и свойства "initPath" и "stringifyState"';
        if (o.states.initState)
            return 'Если вы указали свойство "tree", то указывать свойство "initState" не нужно';
    }
    else if (!o.states.hasOwnProperty('initState'))
        return 'В свойстве "states" вы должны указать или "initState", или "tree", "initPath" и "stringifyState". Ну или уберите свойство "states"';

    if (o.hasOwnProperty('widgets')){
        for (i in o.widgets){
            if (typeof o.widgets[i] === 'function'){//конструктор
                t = o.widgets[i];
                t1 = 'widgets.' + i;
            }
            else if ((typeof o.widgets[i] !== 'object') || (!(o.widgets[i].constructor))){
                return 'Объект, указанный в widgets.' + i + ', должен содержать свойство "constructor"';
            }
            else{
                t = o.widgets[i].constructor;
                t1 = 'widgets.constructor.' + i;
            }
            if (!checkConstructorForInheritance(t, Traliva.WidgetStateSubscriber))
                return 'Класс "' + o.widgets[i].name + '", указанный в ' + t1 + ', не наследуется от Traliva.WidgetStateSubscriber';
        }
    }
    else{
        o.widgets = {};
    }
}
