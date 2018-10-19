'use strict';
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
        ss__self._onClicked();
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
TextEdit.prototype.processStateChanges = function(s){
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
        ss__2 = document.ss__createElement('ss__option');
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
        if (s.selectComponent.current != -1){
            var state = JSON.parse(s.teState);
            var w = new ss__Traliva.ss__Widget(this._wWidget);
            this._wWidget.ss__setContent(w);
            this._oWidget = new ss__TralivaKit[s.selectComponent.current](w, JSON.parse(s.teOptions));
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
        if (this._oWidget)
            this._oWidget.ss__processStateChanges(JSON.parse(s.teState));
        s.bnApply = false;
        this.ss___registerStateChanges();
    }
}

var wRoot = new ss__Traliva.ss__Strip(ss__Traliva.ss__Strip__Orient__hor);

var wH1 = new ss__Traliva.ss__Strip(ss__Traliva.ss__Strip__Orient__vert, wRoot);
    var wSelectComponent = new ss__Traliva.ss__Widget(wH1);
    wH1.ss__addItem(wSelectComponent, '48px');
    var wOptionsTitle = new ss__Traliva.ss__Widget(wH1);
    wH1.ss__addItem(wOptionsTitle, '48px');
    var wOptions = new ss__Traliva.ss__Widget(wH1);
    wH1.ss__addItem(wOptions);
wRoot.ss__addItem(wH1);

var wH2 = new ss__Traliva.ss__Strip(ss__Traliva.ss__Strip__Orient__vert, wRoot);
    var wButtons = new ss__Traliva.ss__Strip(ss__Traliva.ss__Strip__Orient__hor, wH2);
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
        variants:[],
        variants_changed: true,
        current: -1
    },
    teOptions:'{}',
    teState:'{}',
    //componentState: {}
};
var i, list = ss__TralivaKit.list();
for (i = 0 ; i < list.length ; i++){
    state.selectComponent.variants.push({id:list[i],title:list[i]});
}

var publisher = new ss__Traliva.ss__StatePublisher();

publisher.ss__registerSubscriber(new Label(wOptionsTitle, {
    ss__bg: '#444',
    color: '#ffa',
    text: 'Опции:'
}));
publisher.ss__registerSubscriber(new Label(wStateTitle, {
    ss__bg: '#048',
    color: '#ffa',
    text: 'Состояние:'
}));

publisher.ss__setState(state);
publisher.ss__registerSubscriber(new Button(wBnCreate, {
    title: 'Создать',
    activeVarName: 'bnCreate'
}));
publisher.ss__registerSubscriber(new Button(wBnApplyState, {
    title: 'Применить',
    activeVarName: 'bnApply'
}));
publisher.ss__registerSubscriber(new TextEdit(wOptions, {
    ss__bg: '#444',
    color: '#fff',
    textVarName: 'teOptions'
}));
publisher.ss__registerSubscriber(new TextEdit(wState, {
    ss__bg: '#048',
    color: '#fff',
    textVarName: 'teState'
}));
publisher.ss__registerSubscriber(new ComboBox(wSelectComponent, {}).ss__useSubstate('selectComponent'));
publisher.ss__registerSubscriber(new Logics(wH3));
