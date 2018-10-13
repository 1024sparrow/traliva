/****** class StateSubscriber ************************
 */

var $StateSubscriber = function(){
	//this._state = {};//empty state by default untill be set
    this.$__d = {
        $substateMapper: undefined,
        $substateMapperType: undefined,
        $state: {}
    };
    this._state = this.$__d.$state;//undefined untill be set
};

/*
Этот метод будет вызываться при любом изменении объекта состояния (не только косающихся подсостояния данного подписчика, если такое задано). Реализация данного метода должна начинаться с проверки, изменились ли те элементы объекта состояния, которые используются в данном подписчике.
*/
#USAGE_BEGIN#release##
$StateSubscriber.prototype.$processStateChanges = function($0, $1){
    //$0 - state
    //$1 - ifResetStateChain
	console.log("critical error: method $processStateChanges must be reimplemented! class '"+this.constructor.name+"'");
	console.log("Class name: "+this.constructor);//
};
#USAGE_END#release##

$StateSubscriber.prototype.$_registerStateChanges = function(){
	if (this.$__m_publisher)
	{
		this.$__m_publisher.$_processStateChanges(this, true);
		//console.log("xml subscriber : $_registerStateChanges -> ok");
	}
	//else
	//	console.log("xml subscriber : $_registerStateChanges -> aborted");
};

$StateSubscriber.prototype.$useSubstate = function($0){
    //$0 - substateMapper
    /*
        Ссылаться можно только на объект! Или на массив. Но не на число или строку.
        Предполагается, что этот метод будет вызван до регистрации у издателя, так что обработчик изменения состояния не вызывается.
        substateMapper - функция, строка или объект.
        * функция - принимает параметром объект Состояния, должна вернуть объект подсостояния (или undefined). Будет вызываться при каждом изменении состояния (всего).
        * строка - путь до объекта подсостояния в объекте состояния, с разделением '/'. Применимо только в том случае, если 1) путь неизменен и 2) вся цепочка родителей от подсостояния к состоянию состоит из Объектов (без массивов). Тем не менее, это самый удобный путь при быстром клепании GUI из готовых блоков.
        * объект - самый вычислительно эффективный способa. Такая вот статическая привязка. Применим только если объект не перезадаётся (мы указываем ссылку на конкретный объект - если в то же место будет установлен другой объект (а не модифицирован предыдущий), то подписчик перестанет получать события об изменении соотв. подсостояния)
    */
    this.$__d.$substateMapper = $0;
    this.$__d.$substateMapperType = typeof $0;
    return this;
};

$StateSubscriber.prototype.$__getSubstate = function($0){
    //$0 - state
    //$1 - retVal
    //$2 - tmp
    //$3 - t
    if (!this.$__d.$substateMapper)
        return this.$__d.$state;
    //Здесь ни в коем случае нельзя создавать объект. Мы должны вернуть или ссылку на объект, или undefined.
    var $1;//undefined
    if (this.$__d.$substateMapperType === 'string'){
        $1 = this.$__d.$state;
        var $2 = this.$__d.$substateMapper.split('/');
        while ($2.length){
            var $3 = $2.shift();
            if (!$1.hasOwnProperty($3))
                return undefined;
            $1 = $1[$3];
        }
    }
    else if (this.$__d.$substateMapperType === 'object'){
        $1 = this.$__d.$substateMapper;
    }
    else if (this.$__d.$substateMapperType === 'function'){
        $1 = this.$__d.$substateMapper(this.$__d.$state);
    }
    return $1;
};

// -- end of class $StateSubscriber
