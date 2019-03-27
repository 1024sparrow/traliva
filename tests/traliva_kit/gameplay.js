'use strict';
//=========== STRIP ==============
// -- class ss__Strip --
var ss__Strip__Orient__hor = 1,
    ss__Strip__Orient__vert = 2;
function ss__Strip(ss__p_orient, ss__p_parentWidget, ss__p_attr){
	this.ss____orient = ss__p_orient;
	this.ss____items = [];
	this.ss____sizes = [];
	this.ss____w;
	this.ss____h;

	this.ss___eTable = document.createElement('table');
	this.ss___eTable.style.border = 'none';
	this.ss___eTable.cellSpacing = '0';
	if (this.ss____orient == ss__Strip__Orient__hor){
		this.ss___eRowSingle = this.ss___eTable.insertRow(0);
	}
	ss__Traliva.ss___WidgetBase.call(this, ss__p_parentWidget, ss__p_attr);
};
ss__Strip.prototype = Object.create(ss__Traliva.ss___WidgetBase.prototype);
ss__Strip.prototype.constructor = ss__Strip;
ss__Strip.prototype.ss___createContentElem = function(){
	return this.ss___eTable;
};
ss__Strip.prototype.ss___onResized = function(ss__w,ss__h){
	this.ss____w = ss__w;
	this.ss____h = ss__h;
	this.ss____updateSizes();
};
ss__Strip.prototype.ss___onChildVisibilityChanged = function(ss__wChild){
	this.ss____updateSizes();
};
ss__Strip.prototype.ss____updateSizes = function(){
	var ss__totalForParts = (this.ss____orient == ss__Strip__Orient__hor) ? this.ss____w : this.ss____h;
	if (ss__totalForParts < 0)
		return;
	var ss__totalParts = 0;
	for (var ss__0 = 0 ; ss__0 < this.ss____items.length ; ss__0++){
        if (!this.ss____items[ss__0].ss__isVisible())
            continue;
		if (this.ss____sizes[ss__0].ss__unit == 'px'){
			ss__totalForParts -= this.ss____sizes[ss__0].ss__value;
		}
		else if (this.ss____sizes[ss__0].ss__unit == 'part'){
			ss__totalParts += this.ss____sizes[ss__0].ss__value;
		}
	}
	for (var ss__0 = 0 ; ss__0 < this.ss____items.length ; ss__0++){
        if (!this.ss____items[ss__0].ss__isVisible())
            continue;
		var ss__tmpSize = undefined;
		if (this.ss____sizes[ss__0].ss__unit == 'px'){
			ss__tmpSize = this.ss____sizes[ss__0].ss__value;
		}
		else if (this.ss____sizes[ss__0].ss__unit == 'part'){
			ss__tmpSize = this.ss____sizes[ss__0].ss__value * ss__totalForParts / ss__totalParts;
		}
		if (!ss__tmpSize){
			console.log('epic fail');
			continue;
		}

		var ss__1 = this.ss____items[ss__0];
		if (this.ss____orient == ss__Strip__Orient__hor)
			ss__1.ss__resize(ss__tmpSize,this.ss____h);
		else
			ss__1.ss__resize(this.ss____w, ss__tmpSize);
	}
};
ss__Strip.prototype.ss__addItem = function(ss__p_itemWidget, ss__p_size){
	if (typeof ss__p_itemWidget != 'object'){
		console.log('epic fail');
		return;
	}
	if (!(ss__p_itemWidget instanceof ss__Traliva.ss___WidgetBase)){
		console.log('epic fail');
		return;
	}
	var ss__size = this.ss___transformStringSize(ss__p_size);

	var ss__eCell;
	if (this.ss____orient == ss__Strip__Orient__hor){
		ss__eCell = this.ss___eRowSingle.insertCell(this.ss___eRowSingle.cells.length);
	}
	else {
		var ss__eRow = this.ss___eTable.insertRow(this.ss___eTable.rows.length);
		ss__eCell = ss__eRow.insertCell(0);
	}
	ss__eCell.appendChild(ss__p_itemWidget.ss___div);
	ss__eCell.style.padding = '0';
	this.ss____items.push(ss__p_itemWidget);
	this.ss____sizes.push(ss__size);
};
var ss__Strip__reSize = /^(\d+)(\s*)((px)|(part))/;
ss__Strip.prototype.ss___transformStringSize = function(ss__str){
	//Почему невалидное значение по умолчанию - чтобы для программиста не прошло незамеченным.
	var ss__retVal = {ss__value:undefined, ss__unit:undefined};
	if (ss__str){
		//работа с регулярными выражениями
		var ss__0 = ss__str.match(ss__Strip__reSize);
		if (ss__0){
			ss__retVal.ss__value = parseInt(ss__0[1]);
			ss__retVal.ss__unit = ss__0[3];
		}
		else{
			console.log('error: incorrect size parameter (incorrect string)');
		}
	}
	else{
		ss__retVal.ss__value = 1;
		ss__retVal.ss__unit = 'part';
	}
	//console.log(JSON.stringify(ss__retVal));
	return ss__retVal;
};

ss__Strip.prototype.ss__addSplitter = function(){
	if (!this.ss____sizes.length){
		//Проверка сильно усложнится, когда будет добавлена поддержка сокрытия элементов
		console.log('impossible insert splitter into the start of a strip');
		return;
	}
	var splitter = new ss__Traliva.Widget(this);
	//Если стиль не установлен, то будет цвета подложки (сейчас это тёмно-серый #444)
	//splitter.setContent(undefined, '#f00');//установка цвета по умолчанию
	splitter._content.className = 'b__splitter';
	splitter._content.style.cursor =
		(this.ss____orient == ss__Strip__Orient__hor) ? 'col-resize' : 'row-resize';
	splitter._content.addEventListener('mousedown', onMouseDown);
	var splitterItemIndex = this.ss____sizes.length;
	this.ss__addItem(splitter, '8px');
	splitter._splitterClientPos;
	
	var strip = this;
	splitter.__lastPos;
	function onMouseDown(e){
		splitter._content.removeEventListener('mousedown', onMouseDown);
		if (strip.ss____sizes.length < (splitterItemIndex + 2)){
			console.log('impossible insert splitter into the end of a strip');
			return;
		}
		splitter._splitterClientPos = (strip.ss____orient == ss__Strip__Orient__hor) ?
			e.clientX : e.clientY;
		strip._content.addEventListener('mousemove', onMouseMove);
		strip._content.addEventListener('mouseup', onMouseUp);
		splitter.__lastPos =
			(strip.ss____orient == ss__Strip__Orient__hor) ? e.clientX : e.clientY;
		splitter.__lastPos -= splitter._splitterClientPos;
		splitter.__prevInitSize = Object.create(strip.ss____sizes[splitterItemIndex - 1]);
		splitter.__nextInitSize = Object.create(strip.ss____sizes[splitterItemIndex + 1]);
	}
	function onMouseUp(e){
		strip._content.removeEventListener('mousemove', onMouseMove);
		strip._content.removeEventListener('mouseup', onMouseUp);
		splitter._content.addEventListener('mousedown', onMouseDown);
		applyPosition(splitter.__lastPos);
	}
	function onMouseMove(e){
		var nowPos = (strip.ss____orient == ss__Strip__Orient__hor) ? e.clientX : e.clientY;
		nowPos = nowPos - splitter._splitterClientPos;
		applyPosition(nowPos);
		splitter.__lastPos = nowPos;
	}
	function applyPosition(nowPos){
		//var dx = nowPos - splitter.__lastPos;
		console.log(nowPos);
		// копируем, потому что после изменений, возможно, придётся отказаться от них
		//var prevSize = Object.create(strip.ss____sizes[splitterItemIndex - 1]);
		//var nextSize = Object.create(strip.ss____sizes[splitterItemIndex + 1]);
		var prevSize = strip.ss____sizes[splitterItemIndex - 1];
		var nextSize = strip.ss____sizes[splitterItemIndex + 1];
		console.log(JSON.stringify(prevSize));
		
		var a = prevSize.ss__unit == 'px';
		var b = nextSize.ss__unit == 'px';
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
			var candidate = nowPos - targetInit.ss__value;
			if (a){
				var candidate = splitter.__prevInitSize.ss__value + nowPos;
				if (candidate >= 50){
					var i = {};
					i[splitterItemIndex - 1] = candidate + 'px';
					strip.ss__setItemSize(i);
				}
			}
			else{
				//console.log(1);//boris here
			}
		}
	}
};
ss__Strip.prototype.ss__setItemSize = function(ss__sizeMap){//usage example: wRoot.ss__setItemSize({0:'2part'});
	for (var ss__0 in ss__sizeMap){
		if (ss__0 >= this.ss____sizes){
			console.log('epic fail');
			continue;
		}
		var ss__1 = this.ss___transformStringSize(ss__sizeMap[ss__0]);
		this.ss____sizes[ss__0] = ss__1;
	}
	this.ss____updateSizes();
};
// -- end class ss__Strip --

// -- class ss__Stack --
function ss__Stack(ss__p_parentWidget, ss__p_attr){
	this.ss____items = [];
	this.ss____zIndexCounter = 1;
    this.ss___w = undefined;
    this.ss___h = undefined;

	this.ss___eStack = document.createElement('div');
	this.ss___eStack.style.position = 'relative';
	ss__Traliva.ss___WidgetBase.call(this, ss__p_parentWidget, ss__p_attr);
};
ss__Stack.prototype = Object.create(ss__Traliva.ss___WidgetBase.prototype);
ss__Stack.prototype.constructor = ss__Stack;
ss__Stack.prototype.ss___createContentElem = function(){
	return this.ss___eStack;
};
ss__Stack.prototype.ss___onResized = function(ss__w,ss__h){
    this.ss___w = ss__w;
    this.ss___h = ss__h;
	for (var ss__0 = 0 ; ss__0 < this.ss____items.length ; ss__0++){
		var ss__item = this.ss____items[ss__0];
		ss__item.ss__resize(ss__w,ss__h);
	}
};
ss__Stack.prototype.ss__addItem = function(ss__p_itemWidget){
	if (typeof ss__p_itemWidget != 'object'){
		console.log('epic fail');
		return;
	}
	if (!(ss__p_itemWidget instanceof ss__Traliva.ss___WidgetBase)){
		console.log('epic fail');
		return;
	}
	ss__p_itemWidget.ss___div.style.position = 'absolute';
	ss__p_itemWidget.ss___div.style.zIndex = this.ss____zIndexCounter;
	ss__p_itemWidget.ss___div.style.left = '0';
	ss__p_itemWidget.ss___div.style.top = '0';
	this.ss___eStack.appendChild(ss__p_itemWidget.ss___div);
	this.ss____items.push(ss__p_itemWidget);
    if (this.ss___w)
        ss__p_itemWidget.ss__resize(this.ss___w, this.ss___h);

	this.ss____zIndexCounter++;
};
ss__Stack.prototype.ss__removeItem = function(ss__p_index){
    if (ss__p_index >= this.ss____items.length){
        console.log('epic fail');
        return;
    }
    this.ss___eStack.removeChild(this.ss____items[ss__p_index].ss___div);
    this.ss____items.splice(ss__p_index, 1);
};
ss__Stack.prototype.ss___onChildVisibilityChanged = function(ss__wChild){
    var ss__0, ss__1, ss__2;//ss__1 - top level widget index
    for (ss__0 = 0 ; ss__0 < this.ss____items.length ; ss__0++){
        if (this.ss____items[ss__0].ss__isVisible())
            ss__1 = ss__0;
    }
    for (ss__0 = 0 ; ss__0 < this.ss____items.length ; ss__0++){
        ss__2 = this.ss____items[ss__0];
        ss__2.ss__setMouseEventsBlocked(ss__0 !== ss__1);
    }
};

/*registerHelp('Label', {
            title: 'Виджет Label - тупо отображает текст',
            options:{
                ss__text: 'если задано, этот текст будет отображаться, а свойство ss__textVarName будет проигнорировано. По умолч. - не задано (опирается на объект состояния)',
                ss__textVarName: 'имя свойства, в котором записан текст для отображения',
                ss__color: 'цвет текста',
                ss__border: 'если свойство указано, будет добавлена рамочка, false для рамочки без закругления цветом текста, {ss__color: ... , ss__radius: ...}, если хотите задать радиус скругления рамочки и/или цвет рамочки'
            }
        });*/

function Label(ss__p_wContainer, ss__p_options){
    ss__Traliva.ss__WidgetStateSubscriber.call(this, ss__p_wContainer, ss__p_options);
    if (ss__p_options.hasOwnProperty('ss__text')){
        this.ss__textVarName = undefined;
        this.ss__text = ss__p_options.ss__text;
    }
    else{
        this.ss__textVarName = ss__p_options.ss__textVarName || 'ss__text';
        this.ss__text = '';
    }
    //this.e = document.ss__createElement('div');
    var e = ss__Traliva.ss__createElement('<div class="ss__traliva_kit__label" traliva="e">'+this.ss__text+'</div>', this);
    if (ss__p_options.hasOwnProperty('ss__color')){
        this.e.style.color = ss__p_options.ss__color;
        if (ss__p_options.hasOwnProperty('ss__border')){
            this.e.style.border = '1px solid ' + ss__p_options.ss__border.ss__color || ss__p_options.ss__color;
            if (ss__p_options.ss__border && ss__p_options.ss__border.hasOwnProperty('ss__radius')){
                this.e.style.borderRadius = ss__p_options.ss__border.ss__radius;
            }
        }
    }
    //this.e.style.margin = '6px';
    //this.e.style.padding = '10px';
    //this.e.className = 'ss__traliva_kit__label';
    ss__p_wContainer.ss___onResized = (function(e){return function(ss__w,ss__h){
        e.style.width = (ss__w - 32) + 'px';
        e.style.height = (ss__h - 32) + 'px';
    };})(this.e);
    //this.e.innerHTML = this.ss__text;
    this.e.style.textAlign = 'center';
    ss__p_wContainer.ss__setContent(e);
}
Label.prototype = Object.create(ss__Traliva.ss__WidgetStateSubscriber.prototype);
Label.prototype.constructor = Label;
Label.prototype.ss__processStateChanges = function(s){
    if (!s){
        console.error('epic fail');
        return;
    }
    if (this.ss__textVarName !== undefined){
        if (s[this.ss__textVarName] !== this.ss__text){
            this.ss__text = s[this.ss__textVarName] || '';
            this.e.innerHTML = this.ss__text;
        }
    }
}
/*registerHelp('Button', {
            title: 'Виджет Button',
            options:{
                ss__icon: 'если задано (формат задания - см. ss__Traliva.ss__background()), будет установлена иконка. Текст кнопки будет отображаться как тултип (опция ss__title). Размер картинки - фиксированный по размеру картинки.',
                ss__title:'если задано, этот текст будет отображаться, а свойство ss__titleVarName будет проигнорировано. По умолч. - не задано (опирается на объект состояния)',
                ss__titleVarName:'имя свойства, в котором записан текст кнопки (если изменится значение такого свойства у объекта состояния, кнопка изменит свой текст). По умолч. \'ss__title\'',
                ss__activeVarName:'имя свойства(boolean), значение которого будет меняться при нажатии на кнопку. По умолч. \'ss__active\'',
                ss__color: 'цвет текста',
                ss__hover_color: 'цвет фона при наведении мышью',
                ss__hover_icon: 'иконка при наведении мышью. Работает только, если указана опция \'ss__icon\'',
                ss__active_icon: 'иконка, которая устанавливается в случае, коогда кнопка нажата',
                ss__border: 'если свойство указано, будет заданы специфические параметры рамочки, false для рамочки без закругления цветом текста, {ss__color: ... , ss__radius: ...}, если хотите задать радиус скругления рамочки и/или цвет рамочки',
                //disabled_color:
                ss__disabled_icon: 'иконка на случай, когда кнопка "выключена" ("серая")'
            },
            stateObj:{
                ss__enabled: 'Если false, то кнопка "серая" и не реагирует на наведение и клики мышью. По умолчанию - true.'
            }
        });*/

function Button(ss__p_wContainer, ss__p_options){
    ss__Traliva.ss__WidgetStateSubscriber.call(this, ss__p_wContainer, ss__p_options);
    this.ss__options = ss__p_options;
    if (ss__p_options.hasOwnProperty('ss__icon')){
        this.ss__icon = true;
    }
    if (ss__p_options.hasOwnProperty('ss__title')){
        this.ss__titleVarName = undefined;
        this.ss__title = ss__p_options.ss__title;
    }
    else{
        this.ss__titleVarName = (ss__p_options.hasOwnProperty('ss__titleVarName')) ? ss__p_options.ss__titleVarName : 'ss__title';
        this.ss__title = '';
    }
    this.ss__activeVarName = (ss__p_options.hasOwnProperty('ss__activeVarName')) ? ss__p_options.ss__activeVarName : 'ss__active';
    this.ss__active = false;
    var e = ss__Traliva.ss__createElement('<div traliva="e"></div>', this);
    if (this.ss__icon){
        this.e.style.ss__border = 'none';
        ss__Traliva.ss__background(this.e, ss__p_options.ss__icon);
        if (this.ss__title)
            this.e.ss__title = this.ss__title;
        if (typeof ss__p_options.ss__icon === 'string'){
            ss__p_wContainer.ss___onResized = (function(ss__elem){return function(ss__w, ss__h){
                ss__elem.style.width = ss__w + 'px';
                ss__elem.style.height = ss__h + 'px';
            };})(this.e);
        }
    }
    else{
        if (this.ss__title)
            this.e.innerHTML = this.ss__title;
        this.e.className = 'ss__traliva_kit__bn';
        if (ss__p_options.hasOwnProperty('ss__color')){
            this.e.style.ss__color = ss__p_options.ss__color;
            this.e.style.ss__border = '1px solid '+ss__p_options.ss__color;
            if (ss__p_options.hasOwnProperty('ss__border')){
                this.e.style.ss__border = '1px solid ' + ss__p_options.ss__border.ss__color || ss__p_options.ss__color;
                if (ss__p_options.ss__border && ss__p_options.ss__border.hasOwnProperty('ss__radius')){
                    this.e.style.borderRadius = ss__p_options.ss__border.ss__radius;
                }
            }
        }
    }
    if (this.ss__icon){
        if (ss__p_options.hasOwnProperty('ss__hover_icon')){
            this.e.addEventListener('mouseover', (function(o,e,f){return function(){f(e,o);};})(ss__p_options.ss__hover_icon, this.e, ss__Traliva.ss__background));
            this.e.addEventListener('mouseleave', (function(o,e,f){return function(){f(e,o);};})(ss__p_options.ss__icon, this.e, ss__Traliva.ss__background));
        }
    }
    else{
        if (ss__p_options.hasOwnProperty('ss__hover_color')){
            this.e.addEventListener('mouseover', (function(c){return function(){this.style.background = c;};})(ss__p_options.ss__hover_color))
            this.e.addEventListener('mouseleave', (function(c){return function(){this.style.background = 'rgba(0,0,0,0)';};})())
        }
    }
    this.e.addEventListener('click', function(ss__self){return function(){
        ss__self.ss___onClicked();
    };}(this));
    ss__p_wContainer.ss__setContent(e);
}
Button.prototype = Object.create(ss__Traliva.ss__WidgetStateSubscriber.prototype);
Button.prototype.constructor = Button;
Button.prototype.ss__processStateChanges = function(s){
    if (!s){
        console.error('epic fail');
        return;
    }
    if (this.ss__titleVarName !== undefined){
        if (s[this.ss__titleVarName] !== this.ss__title){
            this.ss__title = s[this.ss__titleVarName] || '';
            if (this.ss__icon)
                this.e.ss__title = this.ss__title;
            else
                this.e.innerHTML = this.ss__title;
        }
    }
    if (s[this.ss__activeVarName] !== this.ss__active){
        this.ss__active = s[this.ss__activeVarName];
        if (this.ss__icon)
            ;//
        else
            this.e.className = this.ss__active ? 'ss__traliva_kit__bn ss__active' : 'ss__traliva_kit__bn';
    }
}
Button.prototype.ss___onClicked = function(){
    this.ss__active = !this.ss__active;
    this.ss___state[this.ss__activeVarName] = this.ss__active;
    if (this.ss__icon){
        if (this.ss__options.hasOwnProperty('ss__active_icon')){
            ss__Traliva.ss__background(this.e, this.ss__options[this.ss__active ? 'ss__active_icon' : 'ss__icon']);
        }
    }
    else{
        this.e.className = this.ss__active ? 'ss__traliva_kit__bn ss__active' : 'ss__traliva_kit__bn';
    }
    this.ss___registerStateChanges();
}
/*registerHelp('TextEdit', {
    title: 'поле редактирования текста',
    //descr: '',
    options:{
        ss__color: 'Цвет текста. По умолчанию, жёлтый',
        ss__textVarName: 'имя свойства, хранящего текст. По умолчанию, \'ss__text\'',
        ss__changedVarName: 'Если не задано, в режиме реального времени мониторится изменение текста. Если указано значение типа Строка, то свойство с таким именем в объекте состояния трактуется как Boolean, характеризующий, надо ли обновить (т.е. изменился ли) текст на виджете.',
        ss__shared: 'true, если снятие флага changed(или как вы там его назвали?) в объекте состояния не надо делать(пользователь устанавливает данные и флаг changed, затем снимает флаг changed)\n\
     false, если хотите, чтобы виджет сам снимал флаг changed после того, как изменения данных были отображены в виджете.\n\
     по умолчанию, false. Применим только в случае, когда задан ss__changedVarName.'
    },
    //stateObj:{}
});*/

function TextEdit(ss__p_wContainer, ss__p_options){
    this.ss__text;
    ss__Traliva.ss__WidgetStateSubscriber.call(this, ss__p_wContainer, ss__p_options);
    this.ss___options = ss__p_options;
    if (!ss__p_options.hasOwnProperty('ss__textVarName'))
        this.ss___options.ss__textVarName = 'ss__text';
    ss__p_wContainer.ss__setContent(ss__Traliva.ss__createElement('<textarea spellcheck="false" traliva="e"></textarea>', this));
    this.e.style.resize = 'none';
    this.e.style.border = 'none';//'1px solid #ffa';
    this.e.style.color = ss__p_options.ss__color || '#ffa';
    this.e.addEventListener('change', (function(ss__self, ss__1){return function(){
        ss__self.ss___state[ss__self.ss___options.ss__textVarName] = ss__self.e.value;
        if (ss__1)
            ss__self.ss___state[ss__1] = true;
        ss__self.ss___registerStateChanges();
    };})(this, ss__p_options.ss__changedVarName));
    if (ss__p_options.hasOwnProperty('ss__bg'))
        this.e.style.background = ss__p_options.ss__bg;
    ss__p_wContainer.ss___onResized = (function(e){return function(ss__w, ss__h){
        e.style.width = (ss__w-0) + 'px';
        e.style.height = (ss__h-0) + 'px';
    };})(this.e);
}
TextEdit.prototype = Object.create(ss__Traliva.ss__WidgetStateSubscriber.prototype);
TextEdit.prototype.constructor = TextEdit;
TextEdit.prototype.ss__processStateChanges = function(s){
    if (!s){
        console.error('epic fail');
        return;
    }
    if (this.ss___options.hasOwnProperty('ss__changedVarName')){
        if (s[this.ss___options.ss__changedVarName]){
            this.e.value = s[this.ss___options.ss__textVarName] || '';
            if (!this.ss___options.ss__shared){
                delete s[ss__changedVarName];
                this.ss___registerStateChanges();
            }
        }
    }
    else{
        if (this.ss___text !== s[this.ss___options.ss__textVarName]){
            this.e.value = s[this.ss___options.ss__textVarName] || '';
            this.ss___text = s[this.ss___options.ss__textVarName];
        }
    }
    // ...
}
/*registerHelp('ComboBox', {
    ss__title: 'выпадающий список',
    //descr: '',
    ss__options:{
        ss__variants: 'список вариантов (исходный).'
    },
    ss__stateObj:{
        ss__variants: 'список вариантов. Каждый должен быть представлен объектом с полями ss__id и ss__title',
        ss__variants_changed: '(boolean) флаг о том, что список вариантов изменился, и список отображаемых вариантов необходимо обновить',
        ss__shared: '(boolean) если true, то компонент не будет сам снимать флаг о том, что данные изменились (внешнее снятие флага)',
        ss__current: 'id текущего элемента. Особое значение - \'-1\' - означает, что элемент не выбран.'
    }
});*/

function ComboBox(ss__p_wContainer, ss__p_options){
    ss__Traliva.ss__WidgetStateSubscriber.call(this, ss__p_wContainer, ss__p_options);
    this.ss___options = ss__p_options;
    this.ss___wContainer = ss__p_wContainer;
    if (ss__p_options.hasOwnProperty('ss__variants')){
        this.ss___setupContainer(ss__p_options.ss__variants, -1);
    }
    else{
        // "нет вариантов" - отображаем пустой список (сейчас это просто отсутвие виджета)
    }
}
ComboBox.prototype = Object.create(ss__Traliva.ss__WidgetStateSubscriber.prototype);
ComboBox.prototype.constructor = ComboBox;
ComboBox.prototype.ss__processStateChanges = function(s){
    if (!s){
        console.error('epic fail');
        return;
    }
    if (s.ss__variants_changed){
        this.ss___setupContainer(s.ss__variants, (s.ss__current === undefined) ? -1 : s.ss__current);
        if (!this.ss___options.ss__shared){
            s.ss__variants_changed = false;
            this.ss___registerStateChanges();
        }
    }
    else{
        if (this.ss___current !== s.ss__current){
            if (this.e)
                this.e.value = s.ss__current;
            this.ss___current = s.ss__current;
        }
    }
}
ComboBox.prototype.ss___setupContainer = function(ss__p_variants, ss__p_current){
    //элемент select не поддерживает изменение вариантов, поэтому мы полностью заменяем select
    var ss__1, ss__2, ss__3;
    this.ss___wContainer.ss__setContent(ss__Traliva.ss__createElement('<select traliva="e"></select>', this));
    for (ss__1 = 0 ; ss__1 < ss__p_variants.length ; ss__1++){
        ss__2 = document.createElement('option');
        ss__2.value = ss__p_variants[ss__1].ss__id;
        ss__3 = document.createTextNode(ss__p_variants[ss__1].ss__title);
        ss__2.appendChild(ss__3);
        this.e.appendChild(ss__2);
    }
    this.e.value = ss__p_current;
    this.e.addEventListener('change', (function(ss__self){return function(){
        ss__self.ss___state.ss__current = ss__self.e.value;
        ss__self.ss___current = ss__self.e.value;
        ss__self.ss___registerStateChanges();
    };})(this))
    this.ss___current = ss__p_current;
    this.ss___wContainer.ss___onResized = (function(e){return function(ss__w, ss__h){
        e.style.width = ss__w + 'px';
        e.style.height = ss__h + 'px';
    };})(this.e);
}

function Logics(p_wWidget){
    ss__Traliva.ss__StateSubscriber.call(this);
    this._wWidget = p_wWidget;
}
Logics.prototype = Object.create(ss__Traliva.ss__StateSubscriber.prototype);
Logics.prototype.constructor = Logics;
Logics.prototype.ss__processStateChanges = function(s){
    if (s.bnCreate){
        if (s.selectComponent.ss__current != -1){
            var state = JSON.parse(s.teState);
            var w = new ss__Traliva.ss__Widget(this._wWidget);
            this._wWidget.ss__setContent(w);
            this._oWidget = new ss__TralivaKit[s.selectComponent.ss__current](w, JSON.parse(s.teOptions));
            this._oWidget.ss___state = state;
            this._oWidget.ss___registerStateChanges = (function(self){return function(){
                self.ss___state.teState = JSON.stringify(this.ss___state);
                self.ss___registerStateChanges();
            };})(this);
            this._oWidget.ss__processStateChanges(state);
        }

        s.bnCreate = false;
        this.ss___registerStateChanges();
    }
    if (s.bnApply){
        if (this._oWidget){
            this._oWidget.ss___state = JSON.parse(s.teState);
            this._oWidget.ss__processStateChanges(JSON.parse(s.teState));
            console.log('применено: ' + s.teState);//
        }
        s.bnApply = false;
        this.ss___registerStateChanges();
    }
}

var wRoot = new ss__Strip(ss__Strip__Orient__hor);

var wH1 = new ss__Strip(ss__Strip__Orient__vert, wRoot);
    var wSelectComponent = new ss__Traliva.ss__Widget(wH1);
    wH1.ss__addItem(wSelectComponent, '48px');
    var wOptionsTitle = new ss__Traliva.ss__Widget(wH1);
    wH1.ss__addItem(wOptionsTitle, '48px');
    var wOptions = new ss__Traliva.ss__Widget(wH1);
    wH1.ss__addItem(wOptions);
wRoot.ss__addItem(wH1);

var wH2 = new ss__Strip(ss__Strip__Orient__vert, wRoot);
    var wButtons = new ss__Strip(ss__Strip__Orient__hor, wH2);
        var wBnCreate = new ss__Traliva.ss__Widget(wButtons);
        wButtons.ss__addItem(wBnCreate);
        var wBnApplyState = new ss__Traliva.ss__Widget(wButtons);
        wButtons.ss__addItem(wBnApplyState);
    wH2.ss__addItem(wButtons, '48px');
    var wStateTitle = new ss__Traliva.ss__Widget(wH2);
    wH2.ss__addItem(wStateTitle, '48px');
    var wState = new ss__Traliva.ss__Widget(wH2);
    wH2.ss__addItem(wState);
wRoot.ss__addItem(wH2);

var wH3 = new ss__Traliva.ss__Widget(wRoot);
wRoot.ss__addItem(wH3);

//var 
wSelectComponent.ss__setContent(undefined, '#f00');
wOptions.ss__setContent(undefined, '#ff0');
//wBnCreate.ss__setContent(undefined, '#0ff');#
//wBnApplyState.ss__setContent(undefined, '#00f');#
wH3.ss__setContent(undefined, '#f0f');
//wState.ss__setContent(undefined, '#fa0');

var state = {
    bnCreate: false,
    bnApply: false,
    selectComponent:{
        ss__variants:[],
        ss__variants_changed: true,
        ss__current: -1
    },
    teOptions:'{}',
    teState:'{}',
    //componentState: {}
};
var i, list = ss__TralivaKit.list();
for (i = 0 ; i < list.length ; i++){
    console.log('--', list[i]);
    state.selectComponent.ss__variants.push({ss__id:list[i],ss__title:list[i]});
}

var publisher = new ss__Traliva.ss__StatePublisher();

publisher.ss__registerSubscriber(new Label(wOptionsTitle, {
    ss__bg: '#444',
    ss__color: '#ffa',
    ss__text: 'Опции:'
}));
publisher.ss__registerSubscriber(new Label(wStateTitle, {
    ss__bg: '#048',
    ss__color: '#ffa',
    ss__text: 'Состояние:'
}));

publisher.ss__setState(state);
publisher.ss__registerSubscriber(new Button(wBnCreate, {
    ss__title: 'Создать',
    ss__activeVarName: 'bnCreate'
}));
publisher.ss__registerSubscriber(new Button(wBnApplyState, {
    ss__title: 'Применить',
    ss__activeVarName: 'bnApply'
}));
publisher.ss__registerSubscriber(new TextEdit(wOptions, {
    ss__bg: '#444',
    ss__color: '#fff',
    ss__textVarName: 'teOptions'
}));
publisher.ss__registerSubscriber(new TextEdit(wState, {
    ss__bg: '#048',
    ss__color: '#fff',
    ss__textVarName: 'teState'
}));
publisher.ss__registerSubscriber(new ComboBox(wSelectComponent, {}).ss__useSubstate('selectComponent'));
publisher.ss__registerSubscriber(new Logics(wH3));
