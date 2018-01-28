/****** class StateSubscriber ************************
 */

var StateSubscriber = function(){
	//this._state = {};//empty state by default untill be set
    this.__d = {
        substateMapper: undefined,
        substateMapperType: undefined,
        state: {}
    }
    this._state = this.__d.state;//undefined untill be set
};
/*
Этот метод будет вызываться при любом изменении объекта состояния (не только косающихся подсостояния данного подписчика, если такое задано). Реализация данного метода должна начинаться с проверки, изменились ли те элементы объекта состояния, которые используются в данном подписчике.
*/
StateSubscriber.prototype.processStateChanges = function(state, ifResetStateChain){
	console.log("critical error: method processStateChanges must be reimplemented! class '"+this.constructor.name+"'");
	console.log("Class name: "+this.constructor);//
};
StateSubscriber.prototype._registerStateChanges = function(){
	if (this.__m_publisher)
	{
		this.__m_publisher._processStateChanges(this, true);
		//console.log("xml subscriber : _registerStateChanges -> ok");
	}
	//else
	//	console.log("xml subscriber : _registerStateChanges -> aborted");
};
StateSubscriber.prototype.useSubstate = function(substateMapper){
    /*
        Ссылаться можно только на объект! Или на массив. Но не на число или строку.
        Предполагается, что этот метод будет вызван до регистрации у издателя, так что обработчик изменения состояния не вызывается.
        substateMapper - функция, строка или объект.
        * функция - принимает параметром объект Состояния, должна вернуть объект подсостояния (или undefined). Будет вызываться при каждом изменении состояния (всего).
        * строка - путь до объекта подсостояния в объекте состояния, с разделением '/'. Применимо только в том случае, если 1) путь неизменен и 2) вся цепочка родителей от подсостояния к состоянию состоит из Объектов (без массивов). Тем не менее, это самый удобный путь при быстром клепании GUI из готовых блоков.
        * объект - самый вычислительно эффективный способa. Такая вот статическая привязка. Применим только если объект не перезадаётся (мы указываем ссылку на конкретный объект - если в то же место будет установлен другой объект (а не модифицирован предыдущий), то подписчик перестанет получать события об изменении соотв. подсостояния)
    */
    this.__d.substateMapper = substateMapper;
    this.__d.substateMapperType = typeof substateMapper;
    return this;
};
StateSubscriber.prototype.__getSubstate = function(state){
    if (!this.__d.substateMapper)
        return this.__d.state;
    //Здесь ни в коем случае нельзя создавать объект. Мы должны вернуть или ссылку на объект, или undefined.
    var retVal;//undefined
    if (this.__d.substateMapperType === 'string'){
        retVal = this.__d.state;
        var tmp = this.__d.substateMapper.split('/');
        while (tmp.length){
            var t = tmp.shift();
            if (!retVal.hasOwnProperty(t))
                return undefined;
            retVal = retVal[t];
        }
    }
    else if (this.__d.substateMapperType === 'object'){
        retVal = this.__d.substateMapper;
    }
    else if (this.__d.substateMapperType === 'function'){
        retVal = this.__d.substateMapper(this.__d.state);
    }
    return retVal;
};
