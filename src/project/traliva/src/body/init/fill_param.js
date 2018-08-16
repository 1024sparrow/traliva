'---------------init/fill_param.js---------------';
function $checkConstructorForInheritance($p_validating, $p_validatingFor){
    //return (new $p_validating()) instanceof $p_validatingFor;

    var $0;
    for ($0 = $p_validating.prototype ; $0 ; $0 = $0.constructor.prototype.__proto__){
        if ($0.constructor === $p_validatingFor)
            return true;
    }
    return false;
}

// Функция, разворачивающая сокращённую форму записи в полную
function $fillParam($0){
    var $1, $2, $3;

    // сначала проверим корректность $Traliva.debug
    if ($Traliva.hasOwnProperty('$debug')){
        if (typeof $Traliva.$debug !== 'object')
            return '';
    }

    if (typeof $0 !== 'object'){
        return 'В $Traliva.$init() необходимо передать объект. Для начала укажите свойство "$get_layout"(функция) или "$layouts"(объект)';
    }
    if (!$0.hasOwnProperty('$get_layout')){
        $0.$get_layout = function(){return '$0'};
        $2 = $0.$layouts;
        if (!(typeof $2 === 'string' || ((typeof $2 === 'object') && ($2.hasOwnProperty('$type')))))
            return 'Если свойство "$get_layout" опущено, то в свойстве "$layouts" ожидается лэйаут - либо строковый идентификатор виджета, либо объект с обязательным свойством "$type"';
        $0.$layouts = {$0:$2};
    }
    if (!$0.hasOwnProperty('$states')){
        $0.$states = {
            $initState: {}
        }
    }
    if ($0.$states.hasOwnProperty('$stateSubscribers')){
        for ($1 = 0 ; $1 < $0.$states.$stateSubscribers.length ; $1++){
            if (!$checkConstructorForInheritance($0.$states.$stateSubscribers[$1], $Traliva.$LogicsStateSubscriber))
                return 'Класс "' + $0.$states.$stateSubscribers[$1].name + '", указанный в $states.$stateSubscribers, не наследуется от $Traliva.$LogicsStateSubscriber';
        }
    }
    else
        $0.$states.$stateSubscribers = [];
    if (!$0.$states.hasOwnProperty('$initState'))
        $0.$states.$initState = {};
    if ($0.$states.hasOwnProperty('$tree')){
        if (!$0.$states.$initPath || !$0.$states.$stringifyState)
            return 'Если вы указали свойство "$tree", то должны также указать и свойства "$initPath" и "$stringifyState"';
    }

    if ($0.hasOwnProperty('$widgets')){
        for ($1 in $0.$widgets){
            if (typeof $0.$widgets[$1] === 'function'){//конструктор
                $2 = $0.$widgets[$1];
                $3 = '$widgets.' + $1;
            }
            else if ((typeof $0.$widgets[$1] !== 'object') || (!($0.$widgets[$1].$constructor))){
                return 'Объект, указанный в $widgets.' + $1 + ', должен содержать свойство "$constructor"';
            }
            else{
                $2 = $0.$widgets[$1].$constructor;
                $3 = '$widgets.$constructor.' + $1;
            }
            if (!$checkConstructorForInheritance($2, $Traliva.$WidgetStateSubscriber))
                return 'Класс "' + $0.$widgets[$1].name + '", указанный в ' + $3 + ', не наследуется от $Traliva.$WidgetStateSubscriber';
        }
    }
    else{
        $0.$widgets = {};
    }
}
'======================================';
