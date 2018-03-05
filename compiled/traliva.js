'use strict'

/*
 * traliva <https://github.com/1024sparrow/traliva>
 * JavaScript фреймворк для разработки клиентской части (front-end) web-приложений.
 * JavaScript framework for front-end developing.
 * 
 * Авторское право (c) 2017-2018, Борис Васильев.
 * Публикуется под лицензией MIT.
 *
 * Copyright (c) 2017-2018, Boris Vasilyev.
 * Released under the MIT license.
 */

var Traliva;
if (Traliva)
	console.log('epic fail');
else {
    (function(){
	Traliva = {
        history: history
    };
    //(function(){
/***** class StatePublisher **************************
 *
 * Не допускайте подписывания одного и того же подписчика более одного раза!
 *
 * PREVENT MORE THEN ONCE SUBSCRIBING THE SAME SUBSCRIBER!
 *****************************************************
 */
var StatePublisher = function(){
	this.__state = {};//empty state by default untill be set
	this.__subscribers = [];
    this.__recursionLevel = 0;// <-- количество вложенных вызовов processStateChanges.
    //                      фиксируем для того, чтобы остановить гонку состояний раньше,
    //                      чем это сделает браузер
};
StatePublisher.prototype.state = function(){
	return this.__state;
};
StatePublisher.prototype.setState = function(state){//parameter is an Object
	this.__state = state;
    if (!this._nodebug)
        console.log('set state: '+JSON.stringify(state));
	for (var i = 0 ; i < this.__subscribers.length ; i++){
		var subscr = this.__subscribers[i];
        subscr.__d.state = state;
        //console.log('%csetState: '+JSON.stringify(this.__state), 'color: #f00');//<--
        var s = subscr.__getSubstate(state);
		subscr._state = s;
        if (Traliva.debug && Traliva.debug.state)
            this.__debugState(subscr, s);
		subscr.processStateChanges(s, true);
        //console.log('%c> setState: '+JSON.stringify(this.__state), 'color: #f00');//<--
	}
};
StatePublisher.prototype.registerSubscriber = function(subscr){
    if (Traliva.debug && Traliva.debug.state)
        console.log('%cregister '+subscr.constructor.name, 'color:#ffa');
	subscr.__m_publisher = this;
    try{
        subscr.__d.state = this.__state;
    }
    catch(e){
        console.error('В конструкторе класса подписчика \'' + subscr.constructor.name + '\'вы забыли вызвать конструктор базового класса');
    }
    //console.log('%csetState: '+JSON.stringify(this.__state), 'color: #f00');//<--
    var s = subscr.__getSubstate(this.__state);
	subscr._state = s;
    if (Traliva.debug && Traliva.debug.state)
        this.__debugState(subscr, s);
	subscr.processStateChanges(s, true);
	this.__subscribers.push(subscr);
    //console.log('%c> setState: '+JSON.stringify(this.__state), 'color: #f00');//<--
};
StatePublisher.prototype.unregisterSubscriber = function(subscr){
    if (Traliva.debug && Traliva.debug.state)
        console.log('%cunregister '+subscr.constructor.name, 'color:#ffa');
	var index = this.__subscribers.indexOf(subscr);
	if (index > -1)
		this.__subscribers.splice(index, 1);
	else
		console.log("epic fail");
};
StatePublisher.prototype._processStateChanges = function(sender, p_fromProcessStateChanges){
	this.__state = sender.__d.state;
    if (p_fromProcessStateChanges){
        if (this.__recursionLevel > 128){
            throw 'Предотвращена гонка состояний.';
        }
        this.__recursionLevel++;
    }
    else {
        this.__recursionLevel = 0;
    }
	for (var i = 0 ; i < this.__subscribers.length ; i++){
		var subscr = this.__subscribers[i];
		if (subscr == sender)
			continue;
        subscr.__d.state = this.__state;
        //console.log('%csetState: '+JSON.stringify(this.__state), 'color: #f00');//<--
        var s = subscr.__getSubstate(this.__state);
		subscr._state = s;
        if (Traliva.debug && Traliva.debug.state)
            this.__debugState(subscr, s);
        //console.log('%c> setState: '+JSON.stringify(this.__state), 'color: #f00');//<--
		subscr.processStateChanges(s, false);
	}
    //if (Traliva.debug && Traliva.debug.state){
    //    console.log('--');
    //}
};
StatePublisher.prototype.__debugState = function(p_subscriber, p_state, p_action){
    if (this._nodebug)
        return;
    if (p_action)
        console.log('%c' + p_action + ' ' + p_subscriber.constructor.name + ': ' + JSON.stringify(p_state), 'color:#ffa');
    else{
        console.log('%cprocess ' + p_subscriber.constructor.name + ': ' + JSON.stringify(p_state), 'color:#ffa');
        Traliva.__d.__debug.debugStatesStatesWidget.processState(p_subscriber, this.__state);
    }
};
function StatePublisherNoDebug(){
    StatePublisher.call(this);
    this._nodebug = true;
}
StatePublisherNoDebug.prototype = Object.create(StatePublisher.prototype);
StatePublisherNoDebug.prototype.constructor = StatePublisherNoDebug;

Traliva.StatePublisher = StatePublisher;

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

Traliva.StateSubscriber = StateSubscriber;

/****** class StateDebugWidget ***********************
 */
var StateDebugWidget = function(divId){
    StateSubscriber.call(this);
	var eDiv = (typeof divId == 'string') ? document.getElementById(divId) : divId;
	this.__eTextEdit = document.createElement("textarea");
	this.__eTextEdit.setAttribute("rows", "16");
	this.__eTextEdit.setAttribute("cols", "64");
	this.__eTextEdit.value = "";
	var eBn = document.createElement("button");
	(function(button, textEdit, stateDebugWidget){
		button.onclick = function(){
			//stateDebugWidget._state = {stub:"stub"};//JSON.parse(textEdit.value);
			stateDebugWidget._state = JSON.parse(textEdit.value);
			stateDebugWidget._registerStateChanges();
		};
	})(eBn, this.__eTextEdit, this);
	var eBnText = document.createTextNode("Apply JSON");
	eBn.appendChild(eBnText);
	eDiv.appendChild(this.__eTextEdit);
	eDiv.appendChild(eBn);
};
StateDebugWidget.prototype = Object.create(StateSubscriber.prototype);
StateDebugWidget.prototype.constructor = StateDebugWidget;
StateDebugWidget.prototype.processStateChanges = function(s){
	this.__eTextEdit.value = JSON.stringify(s, undefined, 2);
};

Traliva.StateDebugWidget = StateDebugWidget;

/****** class StateToUriMapper ***********************
Регистрировать у StatePublisher-а в первую очередь - этот подписчик задаёт исходное состояние веб-приложения. Если нужно будет зарегистрировать несколько Маперов, то такой задачи передо мной не стояло, и вопрос остаётся открытым.
*/
function StateToUriMapper(statesObj){
    StateSubscriber.call(this);
    this._statesObj = statesObj;
    var uri = window.location.href;
    var a = uri.indexOf('//');
    var ac = 2;//два слэша
    if (uri[0] == '/'){
        a++;
        ac++;
    }
    var b = uri.indexOf('/', a + ac);
    b += statesObj.initPath.length;
    this.initPath = uri.substr(0, b);
    this._debugMode = false;
    if (this.initPath.substr(0, 7) === 'file://'){
        if (Traliva.__d.o.hasOwnProperty('states') && Traliva.__d.o.states.hasOwnProperty('tree')){
            this.debugMode = true;
            this.initPath = '';
        }
        else
            console.error('Запуск маппера URL в состояние из файловой системы возможен только при активированном режиме отладки \'url\'');
    }
    //console.log(this.initPath);
    this.isVirgin = true;
    this._isStateChangeProcessing = false;

    this._prevAr = [];
}
StateToUriMapper.prototype = Object.create(StateSubscriber.prototype);
StateToUriMapper.prototype.constructor = StateToUriMapper;
StateToUriMapper.prototype.processStateChanges = function(s){
    if (this.isVirgin){
        if (!this.debugMode){
            window.onpopstate = (function(self){return function(){
                self._state = self.updateState();
                self._registerStateChanges();
            };})(this);
        }
        this._state = this.updateState();
        this._registerStateChanges();
    }

    var cand = this.initPath;
    this._isStateChangeProcessing = true;
    var ifReplaceBoolRetVal = {b:true};
    cand += this._statesObj.stringifyState(this._state, ifReplaceBoolRetVal);
    if (cand !== (this.debugMode ? Traliva.history._current() : window.location.href)){
        if (this.isVirgin || ifReplaceBoolRetVal.b)
            Traliva.history.replaceState({}, '', cand);
        else
            Traliva.history.pushState({}, '', cand);
    }
    //if (this.isVirgin){
    if (true){
        //После того как сетевой путь был продлён согласно дефолтному состоянию, надо сохранить массив, чтобы мы как быдто по этому полному пути зашли.
        var tmp = this.debugMode ? Traliva.history._current() : window.location.href;
        var tmp = tmp.substr(this.initPath.length);
        if (tmp[tmp.length - 1] === '/')
            tmp = tmp.slice(0, tmp.length - 1);
        this._prevAr = tmp.length > 0 ? tmp.split('/') : [];
    }
    this._isStateChangeProcessing = false;
    this.isVirgin = false;
}
//вызывается только в режиме отладки
StateToUriMapper.prototype.updateForUrl = function(p_url){
    this._state = this.updateState();
    this._registerStateChanges();
}
StateToUriMapper.prototype.updateState = function(){
    //if (this._isStateChangeProcessing)
    //    return;

    var tmp = this.debugMode ? Traliva.history._current() : window.location.href;
    tmp = tmp.substr(this.initPath.length);
    console.log('qq: '+tmp);
    if (tmp[tmp.length - 1] == '/')
        tmp = tmp.slice(0, tmp.length - 1);
    var i, i1, i2, tmpOld, p, pOld, ok, cand;
    var ar = tmp.length > 0 ? tmp.split('/') : [];
    var prevArCandidate = ar.slice();

    var treeRefOld = this._statesObj.tree;
    var treeRef = this._statesObj.tree;
    var nodeDescr, nodeDescrOld;
    var p, pOld;
    //console.log('init new: '+JSON.stringify(ar));
    //console.log('init old: '+JSON.stringify(this._prevAr));
    while(ar.length){
        p = null;
        pOld = null;
        tmp = ar.shift();
        tmpOld = this._prevAr.length ? this._prevAr.shift() : null;
        //console.log(tmp+' -- '+JSON.stringify(treeRef));
        nodeDescr = treeRef ? (treeRef.hasOwnProperty(tmp) ? treeRef[tmp] : null) : null;
        if (!nodeDescr){
            console.log('e');
            ar = [];
            //break;//некорректный url страницы
            return {};
        }
        nodeDescrOld = tmpOld ? (treeRefOld.hasOwnProperty(tmpOld) ? treeRefOld[tmpOld] : null) : null;

        if (!tmpOld)
            break;//запускаем цепочку деструкции от конца this._prevAr и конструкции от начала ar
        if (tmp === tmpOld){
            //Если есть параметры, сравниваем параметры.
            //Если есть различия в параметрах, запускаем цепочку деструкции от конца this._prevAr
            ok = false;//нет различий (или нет параметров, или в них нет различий)
            if (nodeDescr.hasOwnProperty('params') && nodeDescr.params > 0){
                p = [];
                pOld = [];
                for (i = 0 ; i < nodeDescr.params ; i++){
                    i1 = ar.shift();
                    i2 = this._prevAr.shift();
                    p.push(i1);
                    pOld.push(i2);
                    if (i1 != i2)
                        ok = true;
                }
                if (ok)
                    break;
            }
        }
        else
            break;//Запускаем цепочку деструкции от конца this._prevAr
        //console.log('treeRef: '+JSON.stringify(treeRef));
        treeRef = treeRef.hasOwnProperty(tmp) ? (treeRef[tmp].hasOwnProperty('children') ? treeRef[tmp].children : null) : null;
        if (treeRefOld)
            treeRefOld = treeRefOld.hasOwnProperty(tmp) ? (treeRefOld[tmp].hasOwnProperty('children') ? treeRefOld[tmp].children : null) : null;
        //console.log('treeRef('+tmp+'): '+JSON.stringify(treeRef));
    }
    var destructQueue = [];
    //boris here: цикл деструкции: заполняем очередь задач, и затем выполняем эту очередь задач
    //console.log('new: '+tmp+' - '+JSON.stringify(ar));
    //console.log('old: '+tmpOld+' - '+JSON.stringify(this._prevAr));
    for (i = 0 ; i < this._prevAr.length ; i++){
        console.log('-- '+this._prevAr[i]);
        //boris here
    }
    while (this._prevAr.length){
        tmp = this._prevAr.shift();
        tmp = treeRefOld ? (treeRefOld.hasOwnProperty(tmp) ? treeRefOld[tmp] : null) : null;
        if (!tmp){
            console.log('ef');
            return {};
        }
        if (tmp.hasOwnProperty('params') && tmp.params > 0){
            p = [];
            for (i = 0 ; i < tmp.params ; i++){
                if (this._prevAr.length == 0){
                    console.log('ef');
                    return {};
                }
                this._prevAr.shift();
            }
        }
        if (tmp.hasOwnProperty('out'))
            destructQueue.push((function(a,b){return function(){a.out(b);};})(tmp, this._statesObj.initState));
        treeRefOld = tmp.hasOwnProperty('children') ? tmp.children : null;
    }
    while(destructQueue.length){
        destructQueue.pop()();
    }

    if (!nodeDescr){
        if (!treeRef)
            return {};
        //if (ar.length == 0)
        //    return {};
        if (treeRef.hasOwnProperty('_default'))
            treeRef._default.processor(this._statesObj.initState);
        return this._statesObj.initState;
    }
    if (p)
        nodeDescr.change(this._statesObj.initState, p, pOld);
    else
        ar.unshift(tmp);
    while(ar.length){
        tmp = ar.shift();
        //console.log(tmp);
        tmp = treeRef ? (treeRef.hasOwnProperty(tmp) ? treeRef[tmp] : null) : null;
        if (!tmp){
            console.log('ef');
            return {};
        }
        //p = [];
        if (tmp.hasOwnProperty('params') && tmp.params > 0){
            p = [];
            for (i = 0 ; i < tmp.params ; i++){
                if (ar.length == 0){
                    console.log('ef');
                    return {};
                }
                p.push(ar.shift());
            }
            tmp.in(this._statesObj.initState, p);
        }
        else
            tmp.in(this._statesObj.initState);
        treeRef = tmp.hasOwnProperty('children') ? tmp.children : null;
    }
    if (treeRef && treeRef.hasOwnProperty('_default')){
        treeRef._default.processor(this._statesObj.initState);
    }



    //console.log(this._statesObj.initPath);
    //console.log(this.initPath);
    //this._prevAr = ar;
    this._prevAr = prevArCandidate;
    return this._statesObj.initState;
}

Traliva.StateToUriMapper = StateToUriMapper;
//})();

    //(function(){
/*
p_scroll - (ориг. p_ifCutTails"обрубать концы" - bool-флаг; обрезать ли содержимое, если не умещается в отведённой области; если false, то в случае, когда контент не умещается, появляются полосы прокрутки)
p_sroll - политика скрола. Строка. Возможные значения - 'v', 'h', 'vh' и ''(или undefined, по умолчанию)
Если в каком-то направлении нет автопрокрутки, в том направлении вступает в силу подгон размеров содержимого под размер виджета.
//
*/
function _WidgetBase(p_parentWidget, p_scroll){
    this.__onscrollOkFunc;
    this.__isVisible = true;
    this.__isMouseEventsBlocked = false;
    this.__wParent;//undefined if parent is not instance of _WidgetBase
    this._scroll = p_scroll;
	//Обрубать хвосты по умолчанию (style.overflow='hidden')
	var ifCutTails = (typeof p_scroll == 'undefined') ? true : p_scroll;

	if (p_parentWidget && p_parentWidget instanceof HTMLDivElement)
		this._div = p_parentWidget;
	else{
		this._div = document.createElement('div');
        this.__wParent = p_parentWidget;
    }

    if ((!p_scroll) || (p_scroll === ''))
        this._div.style.overflow = 'hidden';
    else if (p_scroll === 'vh')
        this._div.style.overflow = 'auto';
    else if (p_scroll === 'v'){
        this._div.style.overflowX = 'hidden';
        this._div.style.overflowY = 'auto';
    }
    else if (p_scroll === 'h'){
        this._div.style.overflowX = 'auto';
        this._div.style.overflowY = 'hidden';
    }
    else
        console.log('error: incorrect \'p_scroll\' passed: '+p_scroll);

	this._div.onscroll = (function(self){
		return function(e){
            //console.log(e.target);
            //console.log(self._div);
            //if (self._div.scrollHeight > self._div.offsetHeight)
    		//	self._onScrolled(self._div.scrollTop);
            self._onScrolled(self._div.scrollTop);
		};
	})(this);
    this._div.style.padding = '0px';

	this._content = this._createContentElem();
	this._div.appendChild(this._content);
	if (!this._content)
		console.log('epic fail');
	if (p_parentWidget){
		if (p_parentWidget instanceof HTMLDivElement){
			//console.log(p_parentWidget.constructor.name);
			(function(self){
				setInterval(function(){
					var w = p_parentWidget.clientWidth;
					var h = p_parentWidget.clientHeight;
					if (!self.hasOwnProperty('_WidgetBase')){
						self._WidgetBase = {w : w, h : h};
						self._onResized(w, h);
					}
					else{
						if (w != self._WidgetBase.w || h != self._WidgetBase.h){
							self._WidgetBase.w = w;
							self._WidgetBase.h = h;
							self._onResized(w, h);
						}
					}
				}, 20);
			})(this);
		}
		else if (!(p_parentWidget instanceof _WidgetBase)){
			console.log('class ' + this.constructor.name +
				': incorrect parent passed to constructor: ' + p_parentWidget.constructor.name +
				'. Available types to use: HTMLDivElement and Traliva._WidgetBase.');
		}
	}
	else{
		var eBody = document.getElementsByTagName('body')[0];
		eBody.style.overflow = "hidden";
		eBody.style.margin = '0';
		//this._div.style.background='#444';
		this._div.style.margin = '0';
		eBody.appendChild(this._div);

		(function(self){
			var f = function(){
				var w = window.innerWidth;
				var h = window.innerHeight;
				self.resize(w,h);
			}
			if(window.attachEvent) {
				window.attachEvent('onresize', f);
				window.attachEvent('onload', f);
	 		}
			else if(window.addEventListener) {
				window.addEventListener('resize', f, true);
				window.addEventListener('load', f, true);
			}
			else{
				console.log('epic fail.')
			}
		})(this);
	}
	this._divInitialDisplayProperty = this._div.style.display;
}
_WidgetBase.prototype.isMouseEventsBlocked = function(){
    return this.__isMouseEventsBlocked;
}
_WidgetBase.prototype.__blockScrollHandler = function(e){
    e.preventDefault();
}
_WidgetBase.prototype.setMouseEventsBlocked = function(b){
    if (b != this.__isMouseEventsBlocked){
        if (b){
            this.__onscrollOkFunc = this._div.onscroll;
            this._div.onscroll = this.__blockScrollHandler;
        }
        else{
            this._div.onscroll = this.__onscrollOkFunc;
            this.__onscrollOkFunc = undefined;
            //за то время, что виджет был отключен, у него могли быть определены обработчики.
            //сейчас те обработчики будут потеряны - используйте onScrolled вместо подписывания на событие скроллинга
        }
        //this._div.style.pointerEvents = b ? 'none' : 'auto';
        this.__isMouseEventsBlocked = b;
    }
}
_WidgetBase.prototype._createContentElem = function(){
	console.log('this method must be reimplemented');
	var retVal = document.createElement('div');
	retVal.style.background = '#f00';
	return retVal;
}
_WidgetBase.prototype.resize = function(w, h){
	this._div.style.height = h + 'px';
	this._div.style.maxHeight = h + 'px';
	this._div.style.minHeight = h + 'px';
	this._div.style.width = w + 'px';
	this._div.style.maxWidth = w + 'px';
	this._div.style.minWidth = w + 'px';

	//Это была очень крупная ошибка. Оставил закомментированным, чтобы напоминало о том, что так нельзя.
	/*this._content.style.height = h + 'px';
	this._content.style.maxHeight = h + 'px';
	this._content.style.minHeight = h + 'px';
	this._content.style.width = w + 'px';
	this._content.style.maxWidth = w + 'px';
	this._content.style.minWidth = w + 'px';*/
	this._onResized(w, h);
    //if (this._div.scrollHeight > this._div.clientHeight){
    /*if (this._content.scrollHeight > h){
        this._div.onscroll = (function(self){
            return function(e){
                console.log(e.target);
                console.log(self._div);
                if (self._div.scrollHeight > self._div.offsetHeight)
                    self._onScrolled(self._div.scrollTop);
            };
        })(this);
    }*/
}
_WidgetBase.prototype.setVisible = function(p_visible){
    if (p_visible !== this.__isVisible){
    	this._div.style.display = p_visible ? this._divInitialDisplayProperty : 'none';
        this.__isVisible = p_visible;
        //должны оповерстить родительские элементы об изменении видимости дочернего элемента
        if (this.__wParent)
            this.__wParent._onChildVisibilityChanged(this);
    }
}
_WidgetBase.prototype._onChildVisibilityChanged = function(wChild){}
_WidgetBase.prototype.isVisible = function(){return this.__isVisible;}
_WidgetBase.prototype._onResized = function(w, h){
	console.log('this method must be reimplemented: update content or child elements sizes for <this._content> for given in parameters new size');
}
_WidgetBase.prototype._onScrolled = function(pos){
	// reimplement this method if you need
}
_WidgetBase.prototype._onVisibilityChanged = function(childWidget, p_visible){
}
var WidgetBase__reSize = /^(\d+)(\s*)((px)|(part))$/;
_WidgetBase.prototype._transformStringSize = function(str){
	//Почему невалидное значение по умолчанию - чтобы для программиста не прошло незамеченным.
	var retVal = {value:undefined, unit:undefined};
	if (str){
		//работа с регулярными выражениями
		var res = str.match(WidgetBase__reSize);
		if (res){
			retVal.value = parseInt(res[1]);
			retVal.unit = res[3];
		}
		else{
			console.log('error: incorrect size parameter (incorrect string)');
		}
	}
	else{
		retVal.value = 1;
		retVal.unit = 'part';
	}
	//console.log(JSON.stringify(retVal));
	return retVal;
}

Traliva._WidgetBase = _WidgetBase;

//=========== WIDGET ==============
//Если собираетесь устанавливать Виджет, а не DOM-элемент, в качестве содержимого,
//не указывайте второй параметр (или указывайте true), чтобы не получилось скрола внутри скрола
function Widget(p_parentWidget, p_attr){
	this._contentDiv = document.createElement('div');
	this.__w;
	this.__h;
	this.__contentWidget;
	_WidgetBase.call(this, p_parentWidget, p_attr);
    if (Traliva.hasOwnProperty('debug') && Traliva.debug.uninitialized_colored){
        (function(self){
            StubWidget__stubWidgetCount++;
            var e = document.createElement('div');
            e.className = 'traliva__stub_widget ' + StubWidget__getBgByNum(StubWidget__stubWidgetCount);
            e.style.height = '100%';
            self.setContent(e);
        })(this);
    }

    //this._div.className = 'widget_div';//
}
Widget.prototype = Object.create(_WidgetBase.prototype);
Widget.prototype.constructor = Widget;
Widget.prototype._onResized = function(w, h){
	this.__w = w;
	this.__h = h;
	if (this.__contentWidget)
		this.__contentWidget.resize(w,h);
    // boris here: вызвать родительскую реализацию этого метода
    //_WidgetBase.ptototype.

//{{ Подгон размера под содержимое, если не указан автоскроллинг
    var v, h;
    h = v = true;
    /*if (this._scroll === 'v')
        h = true;
    if (this._scroll === 'h')
        v = true;
    if (this._scroll === 'vh')
        h = v = false;*/
    if (v){
        this._content.style.height = h + 'px';
        this._content.style.maxHeight = h + 'px';
        this._content.style.minHeight = h + 'px';
    }
    if (h){
        this._content.style.width = w + 'px';
        this._content.style.maxWidth = w + 'px';
        this._content.style.minWidth = w + 'px';
    }
//}} Подгон размера под содержимое, если не указан автоскроллинг
}
Widget.prototype._createContentElem = function(){
	return this._contentDiv;
}
Widget.prototype.setContent = function(p_div, p_bgColor){
	this.__contentWidget = undefined;
	if (p_div && (typeof p_div == 'object')){
		this._div.removeChild(this._contentDiv);//здесь мы должны убрать предыдущий DIV
		if (p_div instanceof HTMLElement){//dom element
			p_div.style.margin = '0';
			this._contentDiv = p_div;

			this._content = this._contentDiv;
			this._div.appendChild(this._content);
			if (this.__w)
				this._onResized(this.__w, this.__h);
		}
		else if (p_div instanceof _WidgetBase){//widget
			this._contentDiv = p_div._div;
			this._content = this._contentDiv;
			this._div.appendChild(this._content);
			this.__contentWidget = p_div;
			if (this.__w)
				p_div.resize(this.__w, this.__h);
		}
		else{
			console.log('epic fail: '+p_div.constructor.name);
			console.log(p_div);
		}	
	}
	//this._div.style.background = p_bgColor ? p_bgColor : 'rgba(0,0,0,0)';
	if (p_bgColor)
		this._div.style.background = p_bgColor;
}
/*Widget.prototype.setContent = function(content){
	if (typeof content == 'string'){//color
		this._div.style.background = content;
	}
	else if (typeof content == 'object'){
		if (content.constructor.name == 'HTMLParagraphElement'){//dom element
			content.style.margin = '0';
			this._contentDiv = content;

			this._content = this._contentDiv;
			this._div.appendChild(this._content);
			if (this.__w)
				this._onResized(this.__w, this.__h);
		}
		else if (content instanceof _WidgetBase){//widget
		}
		else
			console.log('epic fail');
	}
	else{
		console.log('epic fail');
	}
}*/

Traliva.Widget = Widget;

//=========== STRIP ==============
Traliva.Strip__Orient__hor = 1;
Traliva.Strip__Orient__vert = 2;
function Strip(p_orient, p_parentWidget, p_attr){
	this.__orient = p_orient;
	this.__items = [];
	this.__sizes = [];
	this.__w;
	this.__h;

	this._eTable = document.createElement('table');
	this._eTable.style.border = 'none';
	this._eTable.cellSpacing = '0';
	if (this.__orient == Traliva.Strip__Orient__hor){
		this._eRowSingle = this._eTable.insertRow(0);
	}
	_WidgetBase.call(this, p_parentWidget, p_attr);
}
Strip.prototype = Object.create(_WidgetBase.prototype);
Strip.prototype.constructor = Strip;
Strip.prototype._createContentElem = function(){
	return this._eTable;
}
Strip.prototype._onResized = function(w,h){
	this.__w = w;
	this.__h = h;
	this.__updateSizes();
}
Strip.prototype._onChildVisibilityChanged = function(wChild){
	this.__updateSizes();
}
Strip.prototype.__updateSizes = function(){
	var totalForParts = (this.__orient == Traliva.Strip__Orient__hor) ? this.__w : this.__h;
	if (totalForParts < 0)
		return;
	var totalParts = 0;
	for (var i = 0 ; i < this.__items.length ; i++){
        if (!this.__items[i].isVisible())
            continue;
		if (this.__sizes[i].unit == 'px'){
			totalForParts -= this.__sizes[i].value;
		}
		else if (this.__sizes[i].unit == 'part'){
			totalParts += this.__sizes[i].value;
		}
	}
	for (var i = 0 ; i < this.__items.length ; i++){
        if (!this.__items[i].isVisible())
            continue;
		var tmpSize = undefined;
		if (this.__sizes[i].unit == 'px'){
			tmpSize = this.__sizes[i].value;
		}
		else if (this.__sizes[i].unit == 'part'){
			tmpSize = this.__sizes[i].value * totalForParts / totalParts;
		}
		if (!tmpSize){
			console.log('epic fail');
			continue;
		}

		var item = this.__items[i];
		if (this.__orient == Traliva.Strip__Orient__hor)
			item.resize(tmpSize,this.__h);
		else
			item.resize(this.__w, tmpSize);
	}
}
Strip.prototype.addItem = function(p_itemWidget, p_size){
	if (typeof p_itemWidget != 'object'){
		console.log('epic fail');
		return;
	}
	if (!(p_itemWidget instanceof _WidgetBase)){
		console.log('epic fail');
		return;
	}
	var size = this._transformStringSize(p_size);

	var eCell;
	if (this.__orient == Traliva.Strip__Orient__hor){
		eCell = this._eRowSingle.insertCell(this._eRowSingle.cells.length);
	}
	else {
		var eRow = this._eTable.insertRow(this._eTable.rows.length);
		eCell = eRow.insertCell(0);
	}
	eCell.appendChild(p_itemWidget._div);
	eCell.style.padding = '0';
	this.__items.push(p_itemWidget);
	this.__sizes.push(size);
}
Strip.prototype.addSplitter = function(){
	if (!this.__sizes.length){
		//Проверка сильно усложнится, когда будет добавлена поддержка сокрытия элементов
		console.log('impossible insert splitter into the start of a strip');
		return;
	}
	var splitter = new Traliva.Widget(this);
	//Если стиль не установлен, то будет цвета подложки (сейчас это тёмно-серый #444)
	//splitter.setContent(undefined, '#f00');//установка цвета по умолчанию
	splitter._content.className = 'b__splitter';
	splitter._content.style.cursor =
		(this.__orient == Traliva.Strip__Orient__hor) ? 'col-resize' : 'row-resize';
	splitter._content.addEventListener('mousedown', onMouseDown);
	var splitterItemIndex = this.__sizes.length;
	this.addItem(splitter, '8px');
	splitter._splitterClientPos;
	
	var strip = this;
	splitter.__lastPos;
	function onMouseDown(e){
		splitter._content.removeEventListener('mousedown', onMouseDown);
		if (strip.__sizes.length < (splitterItemIndex + 2)){
			console.log('impossible insert splitter into the end of a strip');
			return;
		}
		splitter._splitterClientPos = (strip.__orient == Traliva.Strip__Orient__hor) ?
			e.clientX : e.clientY;
		strip._content.addEventListener('mousemove', onMouseMove);
		strip._content.addEventListener('mouseup', onMouseUp);
		splitter.__lastPos =
			(strip.__orient == Traliva.Strip__Orient__hor) ? e.clientX : e.clientY;
		splitter.__lastPos -= splitter._splitterClientPos;
		splitter.__prevInitSize = Object.create(strip.__sizes[splitterItemIndex - 1]);
		splitter.__nextInitSize = Object.create(strip.__sizes[splitterItemIndex + 1]);
	}
	function onMouseUp(e){
		strip._content.removeEventListener('mousemove', onMouseMove);
		strip._content.removeEventListener('mouseup', onMouseUp);
		splitter._content.addEventListener('mousedown', onMouseDown);
		applyPosition(splitter.__lastPos);
	}
	function onMouseMove(e){
		var nowPos = (strip.__orient == Traliva.Strip__Orient__hor) ? e.clientX : e.clientY;
		nowPos = nowPos - splitter._splitterClientPos;
		applyPosition(nowPos);
		splitter.__lastPos = nowPos;
	}
	function applyPosition(nowPos){
		//var dx = nowPos - splitter.__lastPos;
		console.log(nowPos);
		// копируем, потому что после изменений, возможно, придётся отказаться от них
		//var prevSize = Object.create(strip.__sizes[splitterItemIndex - 1]);
		//var nextSize = Object.create(strip.__sizes[splitterItemIndex + 1]);
		var prevSize = strip.__sizes[splitterItemIndex - 1];
		var nextSize = strip.__sizes[splitterItemIndex + 1];
		console.log(JSON.stringify(prevSize));
		
		var a = prevSize.unit == 'px';
		var b = nextSize.unit == 'px';
		/*
		Если слева в пикселях, а справа нет, то меняем размер только у левого
		Если справа в пикселях, а слева нет, то
			из общего размера вычитаем 
		Если с обоих сторон в пикселях, то меняем оба значения
		Если с обоих сторон в частях, то меняем оба значения
		*/
		if (a != b){
			//var target = a ? prevSize : nextSize;
			var targetInit = a ? splitter.__prevInitSize : splitter.__nextInitSize;
			var candidate = nowPos - targetInit.value;
			if (a){
				var candidate = splitter.__prevInitSize.value + nowPos;
				if (candidate >= 50){
					var i = {};
					i[splitterItemIndex - 1] = candidate + 'px';
					strip.setItemSize(i);
				}
			}
			else{
				//console.log(1);//boris here
			}
		}
	}
}
Strip.prototype.setItemSize = function(sizeMap){//usage example: wRoot.setItemSize({0:'2part'});
	for (var i in sizeMap){
		if (i >= this.__sizes){
			console.log('epic fail');
			continue;
		}
		var candidate = this._transformStringSize(sizeMap[i]);
		this.__sizes[i] = candidate;
	}
	this.__updateSizes();
}

Traliva.Strip = Strip;

function Stack(p_parentWidget, p_attr){
	this.__items = [];
	this.__zIndexCounter = 1;
    this._w = undefined;
    this._h = undefined;

	this._eStack = document.createElement('div');
	this._eStack.style.position = 'relative';
	_WidgetBase.call(this, p_parentWidget, p_attr);
}
Stack.prototype = Object.create(_WidgetBase.prototype);
Stack.prototype.constructor = Stack;
Stack.prototype._createContentElem = function(){
	return this._eStack;
}
Stack.prototype._onResized = function(w,h){
    this._w = w;
    this._h = h;
	for (var i = 0 ; i < this.__items.length ; i++){
		var item = this.__items[i];
		item.resize(w,h);
	}
}
Stack.prototype.addItem = function(p_itemWidget){
	if (typeof p_itemWidget != 'object'){
		console.log('epic fail');
		return;
	}
	if (!(p_itemWidget instanceof _WidgetBase)){
		console.log('epic fail');
		return;
	}
	p_itemWidget._div.style.position = 'absolute';
	p_itemWidget._div.style.zIndex = this.__zIndexCounter;
	p_itemWidget._div.style.left = '0';
	p_itemWidget._div.style.top = '0';
	this._eStack.appendChild(p_itemWidget._div);
	this.__items.push(p_itemWidget);
    if (this._w)
        p_itemWidget.resize(this._w, this._h);

	this.__zIndexCounter++;
}
Stack.prototype.removeItem = function(p_index){
    if (p_index >= this.__items.length){
        console.log('epic fail');
        return;
    }
    this._eStack.removeChild(this.__items[p_index]._div);
    this.__items.splice(p_index, 1);
}
Stack.prototype._onChildVisibilityChanged = function(wChild){
    var i, t, tmp;//t - top level widget index
    for (i = 0 ; i < this.__items.length ; i++){
        if (this.__items[i].isVisible())
            t = i;
    }
    for (i = 0 ; i < this.__items.length ; i++){
        tmp = this.__items[i];
        tmp.setMouseEventsBlocked(i !== t);
    }
}

Traliva.Stack = Stack;
//})();

    function DebugConsole(){
    StateSubscriber.call(this);
}
DebugConsole.prototype = Object.create(StateSubscriber.prototype);
DebugConsole.prototype.constructor = DebugConsole.prototype;
DebugConsole.prototype.processStateChanges = function(s){
    console.log('%cDEBUG:%c ' + JSON.stringify(s), 'color: #afa', 'color: #f80');
}

function Button(p_wContainer, p_options){// options: title, color('#f00'), valueVarName - имя свойства, в которое сохранять значение
    StateSubscriber.call(this);
    var e = Traliva.createElement('<div class="traliva__debug_panel__bn" traliva="bnStates">' + p_options.title + '</div>', this);
    /*p_wContainer._onResized = (function(e){function(w,h){
        e.style.width = w + 'px';
        e.style.height = h + 'px';
    };})(this.bnStates);*/
    //e.className = 'traliva__debug_panel__bn';
    //e.style.margin = '6px';
    this.bnStates.style.border = '1px solid ' + p_options.color;
    this.bnStates.style.color = p_options.color;
    this.bnStates.addEventListener('click', function(self, opt){return function(){
        self._state[opt.valueVarName] = !self._state[opt.valueVarName];
        self._registerStateChanges();
    };}(this, p_options));
    p_wContainer.setContent(e);
    //p_wContainer._div.style.margin = '6px 2px';
}
Button.prototype = Object.create(Traliva.StateSubscriber.prototype);
Button.prototype.constructor = Button;
Button.prototype.processStateChanges = function(s){
}

function DebugPanelUrlWidget(p_wContainer){
    p_wContainer._div.className = 'debug_panel';
    StateSubscriber.call(this);
    //p_wContainer._div.style.background = '#f00';
    this._bnBack = new Widget(p_wContainer);
    this._bnBack._div.className = 'traliva__debug_panel__bn_back';
    this._bnBack._div.addEventListener('click', (function(h){return function(){
        h._goBack();
    };})(Traliva.history));
    this._bnForward = new Widget(p_wContainer);
    this._bnForward._div.className = 'traliva__debug_panel__bn_forward';
    this._bnForward._div.addEventListener('click', (function(h){return function(){
        h._goNext();
    };})(Traliva.history));
    this._leUrl = new Widget(p_wContainer);
    var scope = {};
    var leUrl = Traliva.createElement('<input type="text" traliva="le"></input>', scope, '__debug_panel_url');//boris here
    this._leUrl._onResized = function(w, h){
        scope.le.style.width = (w - 12) + 'px';
        scope.le.style.height = (h - 12) + 'px';
    };
    var a = 'http://' + Traliva.debug.url;
    scope.le.value = a + '/';
    Traliva.history._updateUrl = (function(p_prefix, p_le){return function(p_url){
        console.log('%cURL изменён: ' + p_prefix + p_url, 'color: #ffa');
        p_le.value = p_prefix + p_url;
    };})(a, scope.le);
    this._leUrl.setContent(leUrl);
    this._bnEnter = new Widget(p_wContainer);
    this._bnEnter._div.className = 'traliva__debug_panel__bn_enter';
    this._bnEnter._div.addEventListener('click', (function(h, le, p_prefix){return function(){
        var cand = le.value;
        if (cand[cand.length - 1] !== '/')
            cand += '/';
        if (cand.indexOf(p_prefix) < 0)
            h._goCurrent();
        else{
            h.pushState({}, '', cand.slice(p_prefix.length));
        }
    };})(Traliva.history, scope.le, a));

    this._layout = new Strip(Traliva.Strip__Orient__hor, p_wContainer);
    this._layout.addItem(this._bnBack, '32px');
    this._layout.addItem(this._bnForward, '32px');
    this._layout.addItem(this._leUrl);
    this._layout.addItem(this._bnEnter, '32px');
    p_wContainer.setContent(this._layout);
}
DebugPanelUrlWidget.prototype = Object.create(StateSubscriber.prototype);
DebugPanelUrlWidget.prototype.constructor = DebugPanelUrlWidget;
DebugPanelUrlWidget.prototype.processStateChanges = function(s){
}

function DebugStatesWidget(p_wContainer, p_wExtender, p_wStates){
    p_wContainer._div.className = 'debug_states';
    StateSubscriber.call(this);
    this._wContainer = p_wContainer;
    this._wContainer.setVisible(false);
    this._enabled = false;
    p_wContainer._div.className = 'traliva__debug_panel__states';

    this.DebugStatesWidget = {
        publisher: new StatePublisherNoDebug()
    };
    this.DebugStatesWidget.publisher.registerSubscriber(new DebugStatesExtenderWidget(p_wExtender));
    var tmp = new DebugStatesStatesWidget(p_wStates);
    Traliva.__d.__debug.debugStatesStatesWidget = tmp;
    this.DebugStatesWidget.publisher.registerSubscriber(tmp);
}
DebugStatesWidget.prototype = Object.create(StateSubscriber.prototype);
DebugStatesWidget.prototype.constructor = DebugStatesWidget;
DebugStatesWidget.prototype.processStateChanges = function(s){
    if (s.show_states !== this._enabled){
        this._wContainer.setVisible(s.show_states);
        this._enabled = s.show_states;
    }
    this.DebugStatesWidget.publisher.setState(s);
}

function DebugStatesStatesWidget(p_wContainer){
    p_wContainer._div.className = 'debug_states_states';
    StateSubscriber.call(this);
    p_wContainer._div.className = 'traliva__debug_panel__states_states';
    var wStrip = new Strip(Traliva.Strip__Orient__hor, p_wContainer);
    var wLeft = new Widget(p_wContainer);
    this.eState = document.createElement('textarea');
    this.eState.spellcheck = false;
    this.eState.style.resize = 'none';
    this.eState.style.background = 'rgba(0,0,0,0.1)';
    this.eState.style.border = 'none';
    this.eState.style.color = '#48f';
    this.eState.value = JSON.stringify(Traliva.__d.publisher.state(), undefined, 2);
    wLeft.setContent(this.eState);
    wLeft._onResized = (function(e){return function(w,h){
        e.style.width = w + 'px';
        e.style.height = h + 'px';
    };})(this.eState);
    var wRight = new Strip(Traliva.Strip__Orient__vert, wStrip);
    var wBnApply = new Widget(wRight);
    //wBnApply._div.className = 'traliva__debug_panel__apply_state_button';
    wBnApply.setContent(Traliva.createElement('<div class="traliva__debug_panel__apply_state_button">Применить</div>'));
    wBnApply._div.addEventListener('click', (function(self){return function(){
        var s;
        try{
            s = JSON.parse(self.eState.value);
            self.lastValidState = s;
        }
        catch(e){
            alert('Ошибка: '+e);
            if (confirm('Откатить изменения?'))
                self.eState.value = JSON.stringify(self.lastValidState, undefined, 2);
        }
        if (s)
            Traliva.__d.publisher.setState(s);
    }})(this));
    wRight.addItem(wBnApply, '48px');
    wRight.addItem(new Widget(wRight));
    wStrip.addItem(wLeft);
    wStrip.addItem(wRight, '128px');
    p_wContainer.setContent(wStrip);
}
DebugStatesStatesWidget.prototype = Object.create(StateSubscriber.prototype);
DebugStatesStatesWidget.prototype.constructor = DebugStatesStatesWidget;
DebugStatesStatesWidget.prototype.processStateChanges = function(s){
    //this.eState.value = JSON.stringify(s, undefined, 2);
}
DebugStatesStatesWidget.prototype.processState = function(p_subscriber, p_state){
    this.lastValidState = p_state;
    this.eState.value = JSON.stringify(p_state, undefined, 2);
}

function DebugStatesExtenderWidget(p_wContainer){
    p_wContainer._div.className = 'debug_states_extender';
    StateSubscriber.call(this);
    p_wContainer._div.className = 'traliva__debug_panel__states_extender';
}
DebugStatesExtenderWidget.prototype = Object.create(StateSubscriber.prototype);
DebugStatesExtenderWidget.prototype.constructor = DebugStatesExtenderWidget;
DebugStatesExtenderWidget.prototype.processStateChanges = function(s){
}


function WidgetStateSubscriber(p_wContainer, p_options){
    StateSubscriber.call(this);
    this.__WidgetStateSubscriber = {
        wContainer: p_wContainer
    };
    if (p_options && p_options.hasOwnProperty('bg'))
        p_wContainer._div.style.background = p_options.bg;
}
WidgetStateSubscriber.prototype = Object.create(StateSubscriber.prototype);
WidgetStateSubscriber.prototype.constructor = WidgetStateSubscriber;
WidgetStateSubscriber.prototype.processStateChanges = function(){
};
WidgetStateSubscriber.prototype.destroy = function(){};//уничтожить созданный ранее DOM-элемент

Traliva.WidgetStateSubscriber = WidgetStateSubscriber;

function LogicsStateSubscriber(p_wContainer){
    StateSubscriber.call(this);
    this.__WidgetStateSubscriber = {
        wContainer: p_wContainer
    }
}
LogicsStateSubscriber.prototype = Object.create(StateSubscriber.prototype);
LogicsStateSubscriber.prototype.constructor = LogicsStateSubscriber;
LogicsStateSubscriber.prototype.initializeGui = function(p_target, p_layout){
};

Traliva.LogicsStateSubscriber = LogicsStateSubscriber;

function StubWidget__getBgByNum(N){
    var colorCount = 7;
    var directionCount = 5;
    var imageCount = 6;

    var c, // color index
        d, // direction index
        i; // image index
    c = N % colorCount;
    N -= c;
    d = N % directionCount;
    N -= d;
    i = N % imageCount;
    return 'bg-'+c+'-'+d+'-'+i;
}

var StubWidget__stubWidgets = {};//stubWidgetId's set
var StubWidget__stubWidgetCount = 0;
function StubWidget(p_wContainer, p_id){
    WidgetStateSubscriber.call(this, p_wContainer);
    var e = document.createElement('div');
    e.innerHTML = '<div class="traliva__stub_widget__text">id: "'+p_id+'"</div>';
    p_wContainer.setContent(e);

    var bg;
    if (StubWidget__stubWidgets.hasOwnProperty(p_id))
        bg = StubWidget__stubWidgets[p_id];
    else{
        bg = StubWidget__getBgByNum(StubWidget__stubWidgetCount);
        StubWidget__stubWidgets[p_id] = bg;
        StubWidget__stubWidgetCount++;
    }
    p_wContainer._div.className = 'traliva__stub_widget ' + bg;
}
StubWidget.prototype = Object.create(WidgetStateSubscriber.prototype);
StubWidget.prototype.constructor = StubWidget;
StubWidget.prototype.processStateChanges = function(){}
WidgetStateSubscriber.prototype.destroy = function(){};//уничтожить созданный ранее DOM-элемент

Traliva.StubWidget = StubWidget;

function SlotWidget(p_parentWidget, p_attr){
	Stack.call(this, p_parentWidget, p_attr);
    this._layerMap = {};
}
SlotWidget.prototype = Object.create(Stack.prototype);
SlotWidget.prototype.constructor = SlotWidget;

//{{ Защита от вызова методов, которые вызывать не нужно
SlotWidget.prototype.addItem = function(){
    console.log('epic fail');
};
SlotWidget.prototype.removeItem = function(){
    console.log('epic fail');
};
//}}

SlotWidget.prototype.setContent = function(p_id, p_wContent){
    if (this._layerMap.hasOwnProperty(p_id)){
        console.log('epic fail');// перезапись виджетов этот виджет не предполагает
        return;
    }
    Stack.prototype.addItem.call(this, p_wContent);
    this._layerMap[p_id] = {
        index: this.__items.length - 1,
        widget: p_wContent
    };
}
SlotWidget.prototype.removeContent = function(p_id){
    if (!this._layerMap.hasOwnProperty(p_id)){
        console.log('epic fail');
        return;
    }
    var index = this._layerMap[p_id].index;
    delete this._layerMap[p_id];
    Stack.prototype.removeItem.call(this, index);
    var i, tmp;
    for (i in this._layerMap){
        tmp = this._layerMap[i];
        if (tmp.index > index){
            tmp.index--;
        }
    }
}
SlotWidget.prototype.widget = function(p_id){
    if (!this._layerMap.hasOwnProperty(p_id)){
        console.log('epic fail');
        return;
    }
    return this._layerMap[p_id].widget;
}

Traliva.SlotWidget = SlotWidget;

// p_widgets - конструкторы виджетов
// p_widgetScope - здесь мы сохраняем наши виджеты
// в случае аварийного выхода (некорректные параметры) мы заботимся о корректном освобождении памяти и о снятии ненужных подписчиков
function construct_layout(p_wParent, p_oLayout, p_defaultBackground, p_widgets, p_widgetScope, p_innerCall){
    console.log('construct_layout: ' + JSON.stringify(p_oLayout));

    var i, cand, w, type = typeof p_oLayout, tmp;
    var retVal;
    var used = p_innerCall || {};// множество использованных в новом лэйауте id-шников
    if (!p_oLayout){
        // (пружинка)
    }
    if (type === 'string'){
        /*if (p_widgetScope.hasOwnProperty(p_oLayout)){
            console.log('error: идентификаторы пользовательских виджетов должны иметь уникальные значения');
            return;// возможно, это зря. Особо не думал.
        }*/
        if (p_oLayout.hasOwnProperty('id')){
            if (Traliva.widgets.hasOwnProperty(p_oLayout.id))
                console.error('Обнаружено дублирование идентификаторов виджетов. Идентификатор конфликта - ' + p_oLayout.id);
        }
        if (p_widgetScope.hasOwnProperty(p_oLayout))
            retVal = p_widgetScope[p_oLayout].__WidgetStateSubscriber.wContainer;
        else{
            retVal = new Widget(p_wParent);
            if (p_widgets.hasOwnProperty(p_oLayout)){
                // вызываем конструктор..
                i = p_widgets[p_oLayout];
                if (typeof i === 'function')
                    cand = new i(retVal);
                else{
                    tmp = i.options;
                    if (tmp && tmp.hasOwnProperty('bg') && (tmp.bg.length === 0))
                        tmp.bg = p_defaultBackground;
                    cand = new i.constructor(retVal, tmp);
                    if (i.hasOwnProperty('substate'))
                        cand = cand.useSubstate(i.substate);
                    //cand = new i[0](retVal).substate(i[1]);// согласно спецификации, если не конструктор, то массив из конструктора и (чего-то, описывающего подсостояние)
                }
            }
            else{
                // создаём виджет-заглушку
                //console.log('создаётся виджет-заглушка для элемента лейаута с id = \''+p_oLayout+'\'');
                cand = new StubWidget(retVal, p_oLayout);
            }
            //retVal.setContent(cand);cand - не виджет, а его представитель из мира Подписчиков
            Traliva.__d.widgets[p_oLayout] = retVal;
            p_widgetScope[p_oLayout] = cand;
            Traliva.__d.publisher.registerSubscriber(cand);
        }
        used[p_oLayout] = 1;
    }
    else if (type === 'object'){
        if (!p_oLayout.hasOwnProperty('type'))
            console.error('error: incorrect layout description: \'type\' must be');
        type = p_oLayout.type;
        if (type === 'strip'){
            if (!p_oLayout.hasOwnProperty('orient'))
                console.error('error: layout must have property \'orient\'');
            var orient;
            if (p_oLayout.orient === 'h')
                orient = Traliva.Strip__Orient__hor;
            else if (p_oLayout.orient === 'v')
                orient = Traliva.Strip__Orient__vert;
            else
                console.error('error: incorrect value of a strip orientation. Possible values: \'h\',\'v\'.');
            retVal = new Strip(orient, p_wParent, p_oLayout.scroll);
            if (p_oLayout.hasOwnProperty('items')){
                for (i = 0 ; i < p_oLayout.items.length ; i++){
                    //console.log('item '+i);
                    cand = p_oLayout.items[i];
                    if (typeof cand === 'string'){
                        cand = {widget: cand};
                    }
                    if (cand.widget){
                        w = construct_layout(retVal, cand.widget, p_oLayout.bg || p_defaultBackground, p_widgets, p_widgetScope, p_innerCall || used);
                    }
                    else{
                        w = new Widget(retVal);
                    }
                    if (!w)
                        console.error('oops');// error ocurred in internal self calling
                    console.log('widget added to layout');
                    retVal.addItem(w, cand.size);
                }
            }
        }
        else if (type === 'stack'){
            retVal = new Stack(p_wParent, p_oLayout.scroll);
            for (i = 0 ; i < p_oLayout.items.length ; i++){
                cand = p_oLayout.items[i];
                if (typeof cand === 'string' || cand.hasOwnProperty('type'))
                    cand = {widget: cand};
                w = construct_layout(retVal, cand.widget, p_oLayout.bg || p_defaultBackground, p_widgets, p_widgetScope, p_innerCall || used);
                if (!w)
                    console.error('oops'); // error ocurred in internal self calling
                retVal.addItem(w);
            }
        }
        else{
            console.error('error: incorrect type of a layout item');
        }
    }
    if (p_oLayout.hasOwnProperty('bg')){
        cand = (p_oLayout.bg.length) ? p_oLayout.bg : p_defaultBackground;
        if (cand)
            retVal._div.style.background = cand;
    }

    if (!p_innerCall){
        // уничтожаем те виджеты, id которых не попали в used
        for (i in p_widgetScope){
            if (!used.hasOwnProperty(i)){
                Traliva.__d.publisher.unregisterSubscriber(p_widgetScope[i]);
                w = p_widgetScope[i].destroy(); // w - DOM-элемент...
                delete p_widgetScope[i];
            }
        }
    }
    if (p_oLayout.hasOwnProperty('id')){
        Traliva.widgets[p_oLayout.id] = retVal;
    }
    return retVal; // возврат из функции должен быть здесь
}

function HistorySubstitute(){
    this._initState = JSON.parse(JSON.stringify(p_initState));
    this.__copy = function(o){return JSON.parse}
}

// Альтернативная версия Истории, используемая только в случае режима отладки 'url'
Traliva.history = {
    __paths: ['/'],
    __currentIndex: 0,
    replaceState: function(p_a, p_b, p_path){
        console.log('%creplaceState(url) --> '+p_path, 'color: #faa');
        this.__paths[this.__currentIndex] = p_path;
        this._updateUrl(p_path)
    },
    pushState: function(p_a, p_b, p_path){
        console.log('%cpushState(url) --> '+p_path, 'color: #faa');
        this.__currentIndex++;
        if (this.__currentIndex < this.__paths.length)
            this.__paths[this.__currentIndex] = p_path;
        else
            this.__paths.push(p_path);
        this._updateUrl(p_path)
    },
    _goNext: function(){
        if ((this.__currentIndex + 1) < this.__paths.length){
            this.__currentIndex++;
            this._updateUrl(this.__paths[this.__currentIndex])
        }
    },
    _goBack: function(){
        if (this.__currentIndex > 0){
            this.__currentIndex--;
            this._updateUrl(this.__paths[this.__currentIndex])
        }
    },
    _goCurrent: function(){
        this._updateUrl(this.__paths[this.__currentIndex]);
    },
    _current: function(){
        return this.__paths[this.__currentIndex];
    },
    // сюда в классе виджета,отображающего URL в отладочной панели, должна быть записана функция, обновляющая URL в отладочной панели.
    _updateUrl: function(){console.log('oops..');}
}

/* Предполагается, что использоваться будет с подсостоянием */
//function Догрузчик(p_getUrl, p_parent, p_scope){
function Догрузчик(p_getUrl, p_scope){
    StateSubscriber.call(this);
    this._extId = undefined;
    this._getUrl = p_getUrl;
    this._scope = p_scope;
}
Догрузчик.prototype = Object.create(StateSubscriber.prototype);
Догрузчик.prototype.constructor = Догрузчик;
Догрузчик.prototype.processStateChanges = function(s){
    if (s === this._extId)
        return;
    console.log('Меняю id на ' + s);

    if (this._extId){
        // деинициализация старого "продолжения"
    }

    var url = this._getUrl(s);

    (function(self, url){
    Traliva.ajax({
        sourcePath: url,
        readyFunc: function(result){
            console.log('loaded ok');
            var EXTERNAL = {};
            try{
                eval(result);
            }
            catch(e){
                var err = e.constructor('Ошибка возникла во время исполнения загруженного скрипта (url=\''+ url + '\'): ' + e.message);
                err.lineNumber = e.lineNumber + 4 - err.lineNumber; // 4 - количество строк, прошедших от вызова eval()
                throw err;
                return;
            }
            self.ok(EXTERNAL);
        },
        errorFunc: function(isNetworkProblem){
            console.log('loaded not ok');
        }
    });
    })(this, url);

    this._extId = s;
}
Догрузчик.prototype.ok = function(o){
    console.log(JSON.stringify(o));
    //if (Traliva.__d.w.hasOwnProperty())
    var i,t,content,d = Traliva.__d, slotWidget;
    for (i in d.w){
        console.log(i + '-- '+d.w[i]);//
    }
    for (i in o.layouts){
        console.log('downloaded layout id: '+i);//
        //continue;//

        slotWidget = d.widgets[i];
        if (!slotWidget){
            console.log('epic fail: ' + i);
            continue;
        }
        content = construct_layout(slotWidget, o.layouts[i], o.widgets, this._scope);//
        if (content){
            slotWidget.setContent(content);
        }
        console.log('test: ' + typeof content);//
    }

    //states
    if (o.hasOwnProperty('states')){
        this._scope.states = o.states;
    }

    //extender
    if (o.hasOwnProperty('extender')){
        this._scope.extender = o.extender;
    }
}
Догрузчик.prototype.fail = function(p_reason){
    console.log('error: ' + p_reason);
}

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
    if (o.states.hasOwnProperty('tree')){
        d.stateToUriMapper = new StateToUriMapper({
            initPath: o.states.initPath,
            initState: o.states.initState,
            tree: o.states.tree,
            stringifyState: o.states.stringifyState
        });
        d.publisher.registerSubscriber(d.stateToUriMapper);
    }
    else if (o.states.hasOwnProperty('initState'))
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


    (function(){
/*
function ajax - take data from server (always asynchroniusly!). Realized partially (just simplest realization).
return value - none
if called without parameter will be printed short help in console
parameter is an object with the following fields:
	type		name		description
	+===		+===		+==========
	string		sourcePath	network path to load data from
	function	readyFunc(result) take result in this function
	function	errorFunc(isNetworkProblem)
					parameter of this function is Boolean
					("true" if caused of timeout or network connection breakup)
					default is write error to console
	int		timeout		timeout in milliseconds. default is 3000.
	string		dataToPost	if set, method is "post" instead of default "get". This data will be sent to server.
	string		mimetype	mimetype of content. default is "text/plain"
Caution: if some fields in parameter "p" absense, it will be added as undefined. Take this into account if you would use that object later.
*/
function ajax(p){
	if (!p){
		console.log("Traliva.ajax(p). Available fileds for p: sourcePath, readyFunc(result), errorFunc(isNetworkProblem), timeout, dataToPost, mimetype*.");
		return;
	}
	var sourcePath = p.sourcePath;
	var readyFunc = p.readyFunc;
	var errorFunc = p.errorFunc;
	var timeout = p.timeout;
	var dataToPost = p.dataToPost;
	var mimetype = p.mimetype;//unsupported yet: only text
	var addonHttpHeaders = p.addonHttpHeaders;
/*
xhttp.setRequestHeader("Content-Type", "application/json");
xhttp.setRequestHeader('Content-Type', 'text/plain')
*/

	var xhttp=new XMLHttpRequest();
	xhttp.addEventListener(
		'load',
		function(e){
			if (readyFunc)
				readyFunc(xhttp.responseText);
		}
	);
	xhttp.addEventListener(
		'error',
		function(e){
			if (errorFunc)
				errorFunc(true);//
		}
	);
	xhttp.addEventListener(
		'abort',
		function(){
			if (errorFunc)
				errorFunc(false);
		}
	);
	xhttp.addEventListener(
		'timeout',
		function(){
			if (errorFunc)
				errorFunc(true);
		}
	);
	if (dataToPost)
		xhttp.open("POST", sourcePath, true);
	else
		xhttp.open("GET", sourcePath, true);
//	xhttp.setRequestHeader('Content-Type', 'text/plain');
	if (addonHttpHeaders){
		for (var i in addonHttpHeaders){
			xhttp.setRequestHeader(i, addonHttpHeaders[i]);
		}
	}
	if (timeout)
		xhttp.timeout = timeout;
	xhttp.send(dataToPost);
}

Traliva.ajax = ajax;
/*
Эта функция устанавливает переданному DOM-элементу p_e CSS-стиль исходя из параметра p_o.
Параметр p_o - строка, содержащая путь (сетевой!) до картинки, или объект, описывающий картинку в спрайте.
В случае строки, содержащей путь до картинки, элементу p_e будет установлен встроенный стиль CSS "background".
В случае использования спрайта элементу p_e будут установлены встроенные стили CSS "background", "width" и "height".
Формат описания картинки в спрайте:
{
    path: 'путь/до/описателя/спрайта',
    id: 'идентификатор картинки в описателе спрайта'
}.
Описатель спрайта представляет собой JSON-файл. У файла пишется расширение ".sprite". Этот файл имеет следующий формат:
{
    "image": "путь/до/картинки",
    "rows": [
        {
            "h": высота_строки_спрайта_в_пикселях,
            "items":[
                {
                    "id": "идентификатор_первой_картинки",
                    "w": ширина_в_пикселях,
                    "h": высота_в_пикселях(если отличается от высоты строки)
                },
                ...
              ]
        },
        {...},
        ...
    ]
}
*/
var background__cache = {};
function background(p_e, p_o){
    if (typeof p_o === 'string'){
        p_e.style.background = 'url("' + p_o + '") 0 0 no-repeat';
    }
    else{
        var apply = function(p_e, p_o, p_id){ // p_o - содержимое файла .sprite в виде JS-объекта
            var iX, iY, x, y = 0, row, item;
            for (iY = 0 ; iY < p_o.rows.length ; iY++){
                row = p_o.rows[iY];
                x = 0;
                for (iX = 0 ; iX < row.items.length ; iX++){
                    item = row.items[iX];
                    if (item.id === p_id){
                        if (x > 0)
                            x = '-' + x + 'px';
                        if (y > 0)
                            y = '-' + y + 'px';
                        p_e.style.background = 'url("' + p_o.image + '") ' + x + ' ' + y;
                        p_e.style.width = item.w + 'px';
                        p_e.style.height = (item.h || row.h) + 'px';
                        return;
                    }
                    x += item.w;
                }
                y += row.h;
            }
        };
        if (background__cache.hasOwnProperty(p_o.path)){
            apply(p_e, background__cache[p_o.path], p_o.id);
        }
        else{
            ajax({
                sourcePath: p_o.path,
                readyFunc: (function(cache, spritePath, elem, applyFunc, id){return function(result){
                    var o = JSON.parse(result); // здесь не перехватывается исключение в случае некорректного JSON
                    cache[spritePath] = o;
                    applyFunc(elem, o, id);
                };})(background__cache, p_o.path, p_e, apply, p_o.id),
                errorFunc: function(){
                    console.error('не удалось установить фон для элемента - не найден файл "' + p_o.path + '"');
                }
            });
        }
    }
}

Traliva.background = background;

Traliva.checkVisible = function(e) {
	var rect = e.getBoundingClientRect();
	var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
	return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

Traliva.createElement = function(p_html, p_variables, p_classname){
    var retVal = document.createElement('div');
    if (p_classname)
        retVal.className = p_classname;
    retVal.innerHTML = p_html;

    var i, parent, list, stack;
    if (p_variables){
        stack = [retVal];
        while (stack.length){
            parent = stack.pop();
            list = parent.attributes;
            for (i = 0 ; i < list.length ; i++){
                if (list[i].name === 'traliva'){
                    p_variables[list[i].value] = parent;
                    break;
                }
            }
            list = parent.children;
            for (i = 0 ; i < list.length ; i++){
                stack.push(list[i]);
            }
        }
    }
    return retVal;
}

})();

    })();
}

