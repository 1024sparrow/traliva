'use strict'

/*
 * traliva <https://github.com/1024sparrow/traliva>
 * JavaScript фреймворк для разработки клиентской части (front-end) web-приложений.
 * JavaScript framework for front-end developing.
 * 
 * Авторское право (c) 2017, Борис Васильев.
 * Публикуется под лицензией MIT.
 *
 * Copyright (c) 2017, Boris Vasilyev.
 * Released under the MIT license.
 */

var B;
if (B)
	console.log('epic fail');
else {
	B = {};
    (function(){
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
};
StatePublisher.prototype.state = function(){
	return this.__state;
};
StatePublisher.prototype.setState = function(state){//parameter is an Object
	this.__state = state;
	for (var i = 0 ; i < this.__subscribers.length ; i++){
		var subscr = this.__subscribers[i];
        subscr.__d.state = state;
        var s = subscr.__getSubstate(state);
		subscr._state = s;
        //console.log('process '+subscr.constructor.name + JSON.stringify(s));
		subscr.processStateChanges(s, true);
	}
};
StatePublisher.prototype.registerSubscriber = function(subscr){
    //console.log('register '+subscr.constructor.name);
	subscr.__m_publisher = this;
    subscr.__d.state = this.__state;
    var s = subscr.__getSubstate(this.__state);
	subscr._state = s;
    //console.log('process '+subscr.constructor.name + JSON.stringify(s));
	subscr.processStateChanges(s, true);
	this.__subscribers.push(subscr);
};
StatePublisher.prototype.unregisterSubscriber = function(subscr){
	var index = this.__subscribers.indexOf(subscr);
	if (index > -1)
		this.__subscribers.splice(index, 1);
	else
		console.log("epic fail");
};
StatePublisher.prototype._processStateChanges = function(sender){
	this.__state = sender.__d.state;
	for (var i = 0 ; i < this.__subscribers.length ; i++){
		var subscr = this.__subscribers[i];
		if (subscr == sender)
			continue;
        subscr.__d.state = this.__state;
        var s = subscr.__getSubstate(this.__state);
		subscr._state = s;
        //console.log('process '+subscr.constructor.name + JSON.stringify(s));
		subscr.processStateChanges(s, false);
	}
};

B.StatePublisher = StatePublisher;

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
	//console.log("Class name: "+this.constructor);
};
StateSubscriber.prototype._registerStateChanges = function(){
	if (this.__m_publisher)
	{
		this.__m_publisher._processStateChanges(this);
//		console.log("xml subscriber : _registerStateChanges -> ok");
	}
//	else
//		console.log("xml subscriber : _registerStateChanges -> aborted");
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

B.StateSubscriber = StateSubscriber;

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

B.StateDebugWidget = StateDebugWidget;

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
    if (this.initPath.substr(0, 7) == 'file://'){
        console.log('Активирован режим локального файла.');
        var i = b;
        while(i >= 0){
            b = i;
            i = uri.indexOf('/', i+1);
        }
        this.initPath = uri.substr(0, b + 1);
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
        window.onpopstate = (function(self){return function(){
            self._state = self.updateState();
            self._registerStateChanges();
        };})(this);
        this._state = this.updateState();
        this._registerStateChanges();
    }

    var cand = this.initPath;
    this._isStateChangeProcessing = true;
    var ifReplaceBoolRetVal = {b:true};
    cand += this._statesObj.stringifyState(this._state, ifReplaceBoolRetVal);
    if (cand != window.location.href){
        if (this.isVirgin || ifReplaceBoolRetVal.b)
            history.replaceState({}, '', cand);
        else
            history.pushState({}, '', cand);
    }
    //if (this.isVirgin){
    if (true){
        //После того как сетевой путь был продлён согласно дефолтному состоянию, надо сохранить массив, чтобы мы как быдто по этому полному пути зашли.
        var tmp = window.location.href.substr(this.initPath.length);
        if (tmp[tmp.length - 1] == '/')
            tmp = tmp.slice(0, tmp.length - 1);
        this._prevAr = tmp.length > 0 ? tmp.split('/') : [];
    }
    this._isStateChangeProcessing = false;
    this.isVirgin = false;
}
StateToUriMapper.prototype.updateState = function(){
    //if (this._isStateChangeProcessing)
    //    return;

    var tmp = window.location.href.substr(this.initPath.length);
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

B.StateToUriMapper = StateToUriMapper;
})();

    (function(){
function _WidgetBase(p_parentWidget, p_ifCutTails){
    this.__onscrollOkFunc;
    this.__isVisible = true;
    this.__isMouseEventsBlocked = false;
    this.__wParent;//undefined if parent is not instance of _WidgetBase
	//Обрубать хвосты по умолчанию (style.overflow='hidden')
	var ifCutTails = (typeof p_ifCutTails == 'undefined') ? true : p_ifCutTails;

	if (p_parentWidget && p_parentWidget instanceof HTMLDivElement)
		this._div = p_parentWidget;
	else{
		this._div = document.createElement('div');
        this.__wParent = p_parentWidget;
    }
	this._div.style.overflow = ifCutTails ? 'hidden' : 'auto';
    if (typeof ifCutTails === 'boolean')
        this._div.style.overflow = ifCutTails ? 'hidden' : 'auto';
    else if (typeof ifCutTails === 'string'){
        var tmp = ifCutTails.indexOf('h') >= 0;
        this._div.style.overflowX = tmp ? 'auto' : 'hidden';
        tmp = ifCutTails.indexOf('v') >= 0;
        this._div.style.overflowY = tmp ? 'auto' : 'hidden';
    }
    else
        console.log('epic fail: incorrect parameter passed');

	this._div.onscroll = (function(self){
		return function(e){
            //console.log(e.target);
            //console.log(self._div);
            //if (self._div.scrollHeight > self._div.offsetHeight)
    		//	self._onScrolled(self._div.scrollTop);
            self._onScrolled(self._div.scrollTop);
		};
	})(this);

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
				'. Available types to use: HTMLDivElement and B._WidgetBase.');
		}
	}
	else{
		var eBody = document.getElementsByTagName('body')[0];
		eBody.style.overflow = "hidden";
		eBody.style.margin = '0';
		this._div.style.background='#444';
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

B._WidgetBase = _WidgetBase;

//=========== WIDGET ==============
//Если собираетесь устанавливать Виджет, а не DOM-элемент, в качестве содержимого,
//не указывайте второй параметр (или указывайте true), чтобы не получилось скрола внутри скрола
function Widget(p_parentWidget, p_ifCutTails){
	this._contentDiv = document.createElement('div');
	this.__w;
	this.__h;
	this.__contentWidget;
	_WidgetBase.call(this, p_parentWidget, p_ifCutTails);
}
Widget.prototype = Object.create(_WidgetBase.prototype);
Widget.prototype.constructor = Widget;
Widget.prototype._onResized = function(w, h){
	this.__w = w;
	this.__h = h;
	if (this.__contentWidget)
		this.__contentWidget.resize(w,h);
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
	this._div.style.background = p_bgColor ? p_bgColor : 'rgba(0,0,0,0)';
	//if (p_bgColor)
	//	this._div.style.background = p_bgColor;
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

B.Widget = Widget;

//=========== STRIP ==============
B.Strip__Orient__hor = 1;
B.Strip__Orient__vert = 2;
function Strip(p_orient, p_parentWidget, p_ifCutTails){
	this.__orient = p_orient;
	this.__items = [];
	this.__sizes = [];
	this.__w;
	this.__h;

	this._eTable = document.createElement('table');
	this._eTable.style.border = 'none';
	this._eTable.cellSpacing = '0';
	if (this.__orient == B.Strip__Orient__hor){
		this._eRowSingle = this._eTable.insertRow(0);
	}
	_WidgetBase.call(this, p_parentWidget, p_ifCutTails);
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
	var totalForParts = (this.__orient == B.Strip__Orient__hor) ? this.__w : this.__h;
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
		if (this.__orient == B.Strip__Orient__hor)
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
	if (this.__orient == B.Strip__Orient__hor){
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
	var splitter = new B.Widget(this);
	//Если стиль не установлен, то будет цвета подложки (сейчас это тёмно-серый #444)
	//splitter.setContent(undefined, '#f00');//установка цвета по умолчанию
	splitter._content.className = 'b__splitter';
	splitter._content.style.cursor =
		(this.__orient == B.Strip__Orient__hor) ? 'col-resize' : 'row-resize';
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
		splitter._splitterClientPos = (strip.__orient == B.Strip__Orient__hor) ?
			e.clientX : e.clientY;
		strip._content.addEventListener('mousemove', onMouseMove);
		strip._content.addEventListener('mouseup', onMouseUp);
		splitter.__lastPos =
			(strip.__orient == B.Strip__Orient__hor) ? e.clientX : e.clientY;
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
		var nowPos = (strip.__orient == B.Strip__Orient__hor) ? e.clientX : e.clientY;
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

B.Strip = Strip;

function Stack(p_parentWidget, p_ifCutTails){
	this.__items = [];
	this.__zIndexCounter = 1;
    this._w = undefined;
    this._h = undefined;

	this._eStack = document.createElement('div');
	this._eStack.style.position = 'relative';
	_WidgetBase.call(this, p_parentWidget, p_ifCutTails);
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
    //boris here: должны отресайзить добавляемый виджет
    if (this._w)
        p_itemWidget.resize(this._w, this._h);

	this.__zIndexCounter++;
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

B.Stack = Stack;
})();

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
		console.log("B.ajax(p). Available fileds for p: sourcePath, readyFunc(result), errorFunc(isNetworkProblem), timeout, dataToPost, mimetype*.");
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

B.ajax = ajax;

B.checkVisible = function(e) {
	var rect = e.getBoundingClientRect();
	var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
	return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

})();

}

