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
