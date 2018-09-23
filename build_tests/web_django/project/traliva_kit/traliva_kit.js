'use strict';
var TralivaKit;
if (TralivaKit)
    console.log('epic fail: TralivaKit is not empty');
else{
    TralivaKit = {__d:{help:{}}};
(function(p_namespace){

/*
Формат объекта справки:
title(text)
descr(text)
options(object) - Принимаемые опции. object: key - option name value - textual description
stateObj(object) - формат объекта состояния
children(object) - у справки могут быть дочерние страницы (с более подробным описанием тех или иных аспектов).
*/
function registerHelp(p_className, p_o){
    p_namespace.__d.help[p_className] = p_o;
}
//
p_namespace.help = function(o){
    var i, o;
    if (arguments.length === 0){
        console.log('Для справки по контретному классу виджета передайте в help() параметром имя класса. Доступные классы виджетов:');
        for (i in p_namespace.__d.help){
            console.log('* ' + i + ' - ' + p_namespace.__d.help[i].title);
        }
    }
    else{
        for (i = 0 ; i < arguments.length ; i++){
            if (i)
                o = o.children[arguments[i]];
            else{
                o = p_namespace.__d.help[arguments[i]];
                if (!o.hasOwnProperty('options'))
                    o.options = {};
                if (!o.options.hasOwnProperty('bg')){
                    o.options.bg = '(опция от базового класса) цвет фона (подложки). Если не задано, подложки не будет. Если задана пустая строка, фон подложки будет взят такой же, как у ближайшего родителя, у которого фон подложки задан (или не будет задан, если такой родитель найден не будет).';
                }
            }
            if (!o){
                console.log('Некорректный параметр для справки: '+arguments[i]);
                return;
            }
        }
        console.log('%c' + o.title, 'color: #ffa');
        if (o.descr)
            console.log('%c' + o.descr, 'color: #48f');
        if (o.options){
            console.log('%cПринимаемые опции:', 'color: #ffa');
            for (i in o.options){
                console.log('%c* ' + i + ' - ' + o.options[i], 'color: #48f');
            }
        }
        if (o.stateObj){
            console.log('%cФормат объекта состояния:', 'color: #ffa');
            for (i in o.stateObj){
                console.log('%c* ' + i + ' - ' + o.stateObj[i], 'color: #48f');
            }
        }
    }
}



registerHelp('Label', {
            title: 'Виджет Label - тупо отображает текст',
            options:{
                text: 'если задано, этот текст будет отображаться, а свойство textVarName будет проигнорировано. По умолч. - не задано (опирается на объект состояния)',
                textVarName: 'имя свойства, в котором записан текст для отображения',
                color: 'цвет текста',
                border: 'если свойство указано, будет добавлена рамочка, false для рамочки без закругления цветом текста, {color: ... , radius: ...}, если хотите задать радиус скругления рамочки и/или цвет рамочки'
            }
        });
function Label(p_wContainer, p_options){
    Traliva.WidgetStateSubscriber.call(this, p_wContainer, p_options);
    if (p_options.hasOwnProperty('text')){
        this.textVarName = undefined;
        this.text = p_options.text;
    }
    else{
        this.textVarName = p_options.textVarName || 'text';
        this.text = '';
    }
    //this.e = document.createElement('div');
    var e = Traliva.createElement('<div class="traliva_kit__label" traliva="e">'+this.text+'</div>', this);
    if (p_options.hasOwnProperty('color')){
        this.e.style.color = p_options.color;
        if (p_options.hasOwnProperty('border')){
            this.e.style.border = '1px solid ' + p_options.border.color || p_options.color;
            if (p_options.border && p_options.border.hasOwnProperty('radius')){
                this.e.style.borderRadius = p_options.border.radius;
            }
        }
    }
    //this.e.style.margin = '6px';
    //this.e.style.padding = '10px';
    //this.e.className = 'traliva_kit__label';
    p_wContainer._onResized = (function(e){return function(w,h){
        e.style.width = (w - 32) + 'px';
        e.style.height = (h - 32) + 'px';
    };})(this.e);
    //this.e.innerHTML = this.text;
    this.e.style.textAlign = 'center';
    p_wContainer.setContent(e);
}
Label.prototype = Object.create(Traliva.WidgetStateSubscriber.prototype);
Label.prototype.constructor = Label;
Label.prototype.processStateChanges = function(s){
    if (!s){
        console.error('epic fail');
        return;
    }
    if (this.textVarName !== undefined){
        if (s[this.textVarName] !== this.text){
            this.text = s[this.textVarName] || '';
            this.e.innerHTML = this.text;
        }
    }
}

p_namespace.Label = Label;

registerHelp('Button', {
            title: 'Виджет Button',
            options:{
                icon: 'если задано (формат задания - см. Traliva.background()), будет установлена иконка. Текст кнопки будет отображаться как тултип (опция title). Размер картинки - фиксированный по размеру картинки.',
                title:'если задано, этот текст будет отображаться, а свойство titleVarName будет проигнорировано. По умолч. - не задано (опирается на объект состояния)',
                titleVarName:'имя свойства, в котором записан текст кнопки (если изменится значение такого свойства у объекта состояния, кнопка изменит свой текст). По умолч. \'title\'',
                activeVarName:'имя свойства(boolean), значение которого будет меняться при нажатии на кнопку. По умолч. \'active\'',
                color: 'цвет текста',
                hover_color: 'цвет фона при наведении мышью',
                hover_icon: 'иконка при наведении мышью. Работает только, если указана опция \'icon\'',
                active_icon: 'иконка, которая устанавливается в случае, коогда кнопка нажата',
                border: 'если свойство указано, будет заданы специфические параметры рамочки, false для рамочки без закругления цветом текста, {color: ... , radius: ...}, если хотите задать радиус скругления рамочки и/или цвет рамочки',
                //disabled_color:
                disabled_icon: 'иконка на случай, когда кнопка "выключена" ("серая")'
            },
            stateObj:{
                enabled: 'Если false, то кнопка "серая" и не реагирует на наведение и клики мышью. По умолчанию - true.'
            }
        });
function Button(p_wContainer, p_options){
    Traliva.WidgetStateSubscriber.call(this, p_wContainer, p_options);
    this.options = p_options;
    if (p_options.hasOwnProperty('icon')){
        this.icon = true;
    }
    if (p_options.hasOwnProperty('title')){
        this.titleVarName = undefined;
        this.title = p_options.title;
    }
    else{
        this.titleVarName = (p_options.hasOwnProperty('titleVarName')) ? p_options.titleVarName : 'title';
        this.title = '';
    }
    this.activeVarName = (p_options.hasOwnProperty('activeVarName')) ? p_options.activeVarName : 'active';
    this.active = false;
    var e = Traliva.createElement('<div traliva="e"></div>', this);
    if (this.icon){
        this.e.style.border = 'none';
        Traliva.background(this.e, p_options.icon);
        if (this.title)
            this.e.title = this.title;
        if (typeof p_options.icon === 'string'){
            p_wContainer._onResized = (function(elem){return function(w, h){
                elem.style.width = w + 'px';
                elem.style.height = h + 'px';
            };})(this.e);
        }
    }
    else{
        if (this.title)
            this.e.innerHTML = this.title;
        this.e.className = 'traliva_kit__bn';
        if (p_options.hasOwnProperty('color')){
            this.e.style.color = p_options.color;
            this.e.style.border = '1px solid '+p_options.color;
            if (p_options.hasOwnProperty('border')){
                this.e.style.border = '1px solid ' + p_options.border.color || p_options.color;
                if (p_options.border && p_options.border.hasOwnProperty('radius')){
                    this.e.style.borderRadius = p_options.border.radius;
                }
            }
        }
    }
    if (this.icon){
        if (p_options.hasOwnProperty('hover_icon')){
            this.e.addEventListener('mouseover', (function(o,e,f){return function(){f(e,o);};})(p_options.hover_icon, this.e, Traliva.background));
            this.e.addEventListener('mouseleave', (function(o,e,f){return function(){f(e,o);};})(p_options.icon, this.e, Traliva.background));
        }
    }
    else{
        if (p_options.hasOwnProperty('hover_color')){
            this.e.addEventListener('mouseover', (function(c){return function(){this.style.background = c;};})(p_options.hover_color))
            this.e.addEventListener('mouseleave', (function(c){return function(){this.style.background = 'rgba(0,0,0,0)';};})())
        }
    }
    this.e.addEventListener('click', function(self){return function(){
        self._onClicked();
    };}(this));
    p_wContainer.setContent(e);
}
Button.prototype = Object.create(Traliva.WidgetStateSubscriber.prototype);
Button.prototype.constructor = Button;
Button.prototype.processStateChanges = function(s){
    if (!s){
        console.error('epic fail');
        return;
    }
    if (this.titleVarName !== undefined){
        if (s[this.titleVarName] !== this.title){
            this.title = s[this.titleVarName] || '';
            if (this.icon)
                this.e.title = this.title;
            else
                this.e.innerHTML = this.title;
        }
    }
    if (s[this.activeVarName] !== this.active){
        this.active = s[this.activeVarName];
        if (this.icon)
            ;//
        else
            this.e.className = this.active ? 'traliva_kit__bn active' : 'traliva_kit__bn';
    }
}
Button.prototype._onClicked = function(){
    this.active = !this.active;
    this._state[this.activeVarName] = this.active;
    if (this.icon){
        if (this.options.hasOwnProperty('active_icon')){
            Traliva.background(this.e, this.options[this.active ? 'active_icon' : 'icon']);
        }
    }
    else{
        this.e.className = this.active ? 'traliva_kit__bn active' : 'traliva_kit__bn';
    }
    this._registerStateChanges();
}

p_namespace.Button = Button;

registerHelp('LineEdit', {
            title: 'Виджет строка ввода',
            options:{
                placeholder:'строка подсказки вроде "введите ..(что-то)"',
                requireVarName: 'имя свойства(boolean), true которого означает, что нужно записать в объект состояния значение этого текстового поля. Если не задано, в объекте состояния значения будет обновляться при каждом изменении текста',
                textVarName:'текст в поле редактирования. Это значение как для задания предустановленного значения, так и для считывания другими компонентами введённого пользователем текста',
                color:'цвет текста и рамочки',
                hover_color:'цвет фона при наведении мышью'
            }
        });
function LineEdit(p_wContainer, p_options){
    Traliva.WidgetStateSubscriber.call(this, p_wContainer, p_options);
    this.requireVarName;

    p_wContainer.setContent(Traliva.createElement('<input type="text" traliva="e" class="traliva_kit__lineedit"></input>', this));
    p_wContainer._onResized = (function(self){
        return function(w,h){
            self.e.style.width = (w - 32) + 'px';
        }
    })(this);
    if (p_options.hasOwnProperty('placeholder'))
        this.e.placeholder = p_options.placeholder;
    if (p_options.hasOwnProperty('color')){
        this.e.style.color = p_options.color;
        this.e.style.border = '1px solid ' + p_options.color;
    }
    if (p_options.hasOwnProperty('hover_color')){
        this.e.addEventListener('mouseover', (function(c){return function(){this.style.background = c;};})(p_options.hover_color))
        this.e.addEventListener('mouseleave', (function(c){return function(){this.style.background = 'rgba(0,0,0,0)';};})())
    }
    if (p_options.hasOwnProperty('textVarName'))
        this.textVarName = p_options.textVarName;
    else
        console.error('LineEdit: textVarName - обязательное поле для задания в options');
    if (p_options.hasOwnProperty('requireVarName')){
        this.requireVarName = p_options.requireVarName;
    }
    else{
        this.e.addEventListener('input', (function(self){return function(){
            self._state[self.textVarName] = self.e.value;
            self._registerStateChanges();
        }})(this));
        // event 'change' fires only on focus off
    }
}
LineEdit.prototype = Object.create(Traliva.WidgetStateSubscriber.prototype);
LineEdit.prototype.constructor = LineEdit;
LineEdit.prototype.processStateChanges = function(s){
    if (this.requireVarName){
        // опция выдачи строго по запросу не протестирована.
        // надеюсь, при запуске ошибок не возникнет
        if (s[this.requireVarName]){
            s[this.requireVarName] = false;
            s[this.textVarName] = this.e.value;
            this._registerStateChanges();
        }
    }
    if (this.e.value !== s[this.textVarName])
        this.e.value = s[this.textVarName];
}

p_namespace.LineEdit = LineEdit;

registerHelp('FileSelect', {
            title:'Виджет Поле выбора файла из файловой системы пользователя',
            // Traliva.api.get_filepath(p_file) - должна быть, возвращает путь к файлу.
            options:{
                valueVarName:'имя свойства объекта состояния, где хранится значение выбранного файла',
                filter:'по каким расширениям фильтровать. Пример: ".mp3, .mpeg, .wav, .ogg"',
                color:'цвет',
                hover_color:'цвет при наведении мышью'
            }
        });
function FileSelect(p_wContainer, p_options){
    Traliva.WidgetStateSubscriber.call(this, p_wContainer, p_options);
    p_wContainer.setContent(Traliva.createElement('<input type="file" traliva="e" class="traliva_kit__fileselect"></input>', this));
//wAddBn.setContent(Traliva.createElement('<input type="file" accept=".mp3, .mpeg, .wav, .ogg" traliva="bn_add" class="bn stage2_bn_add"></input>'));
    this.valueVarName = p_options.valueVarName;
    this.e.addEventListener('change', (function(self){return function(){
        var files = self.e.files;
        files = files.length ? files[0] : undefined;
        var tmppath = window.URL.createObjectURL(files);
        self._state[self.valueVarName] = tmppath;
        self._registerStateChanges();
    };})(this));
    
    if (p_options.hasOwnProperty('filter')){
        this.e.accept = p_options.filter;
    }
    if (p_options.hasOwnProperty('color')){
        this.e.style.color = p_options.color;
        this.e.style.border = '1px solid ' + p_options.color;
    }
    if (p_options.hasOwnProperty('hover_color')){
        this.e.addEventListener('mouseover', (function(c){return function(){this.style.background = c;};})(p_options.hover_color))
        this.e.addEventListener('mouseleave', (function(c){return function(){this.style.background = 'rgba(0,0,0,0)';};})())
    }
    /*p_wContainer._onResized = (function(self){
        return function(w,h){
            self.e.style.width = (w - 18) + 'px';
        }
    })(this);*/
}
FileSelect.prototype = Object.create(Traliva.WidgetStateSubscriber.prototype);
FileSelect.prototype.constructor = FileSelect;
FileSelect.prototype.processStateChanges = function(s){
    //boris here: применить изменения в выбранном файле
}

p_namespace.FileSelect = FileSelect;

registerHelp('SimpleList', {
            title:'Класс SimpleList',
            descr:'Список элементов, с возможностью выбора какого-то одного элемента(выделяемость настраивается с помощью options)',
            options:{
                selectable: 'по умолчанию false',
                getText: 'если у вас список объектов, то вам потребуется функция, которая даёт текст для отображения в элементе списка. По умолчанию, элементы списка трактуются как строки',
                shared: 'true, если снятие флага changed в объекте состояния не надо делать(пользователь устанавливает данные и флаг changed, затем снимает флаг changed)\n\
     false, если хотите, чтобы виджет сам снимал флаг changed после того, как изменения данных были отображены в виджете.\n\
     по умолчанию, true. Так что сами сбрасывайте флаг changed, или задайте опцию "shared: false"',
                color: 'цвет элемента списка',
                selected_color: 'цвет выделенного элемента списка',
                hover_color: 'цвет фона строки при наведении мышью'
            },
            stateObj:{
                current: 'порядковый номер в массиве',
                list: 'массив строк (заголовкой на вывод)',
                changed: 'флаг, сигнализирующий виджету, что отображение данных надо обновить. Если задано, то объект со свойствами \'removed\', \'added\' и \'changed\'(значения - порядковые индексы элементов). Именно в таком порядке и следует обрабатывать изменения. Если изменений нет, то следует писать false или undefined.'
            }
        });
function SimpleList(p_wContainer, p_options){
    Traliva.WidgetStateSubscriber.call(this, p_wContainer, p_options);
    p_wContainer.setContent(Traliva.createElement('<table class="traliva_kit__simplelist" traliva="table"></table>', this));
    this.options = p_options;
    this._len = 0;
    this._initialized = false;
    if (p_options.selectable){
        this.table.addEventListener('click', (function(self){return function(e){
            self._onClicked(e.target);
        };})(this));
    }
    if (p_options.hasOwnProperty('color')){
        this.table.style.color = p_options.color;
    }
    this._current = -1;//порядковый индекс
    this._elements = [];
}
SimpleList.prototype = Object.create(Traliva.WidgetStateSubscriber.prototype);
SimpleList.prototype.constructor = SimpleList;
SimpleList.prototype.processStateChanges = function(s){
    if (!this._initialized){
        this._update();
        this._initialized = true;
    }
    if (s.changed){
        this._update();
        if (this.options.shared === false){
            s.changed = false;
            this._registerStateChanges();
        }
    }
    if (this.options.selectable){
        if (s.current !== this._current){
            this._updateSelection(s.current);
        }
    }
}
SimpleList.prototype._update = function(){
    var i, eRow, eCell, t;

    for (i = this._state.list.length ; i < this._len ; i++){
        this.table.deleteRow(-1);
    }
    for (i = this._len ; i < this._state.list.length ; i++){
        eRow = this.table.insertRow();
        eRow.insertCell();
    }
    this._len = this._state.list.length;
    var rows = this.table.rows;
    this._elements = [];
    for (i = 0 ; i < rows.length ; i++){
        //eRow = this._state.list[i];
        eRow = rows[i];
        eCell = eRow.cells[0];
        while (eCell.firstChild){
            eCell.removeChild(eCell.firstChild);
        }
        t = document.createElement('div');
        t.innerHTML = this.options.getText ? this.options.getText(this._state.list[i]) : this._state.list[i];
        //eCell.innerHTML = '<div>' + (this.options.getText ? this.options.getText(this._state.list[i]) : this._state.list[i]) + '</div>';
        eCell.appendChild(t);
        this._elements.push(t);
    }
}
SimpleList.prototype._updateSelection = function(p_index){
    var i, e;
    for (i = 0 ; i < this._elements.length ; i++){
        if (i === this._current){
            e = this._elements[i];
            e.className = '';
            if (this.options.hasOwnProperty('color'))
                e.style.color = this.options.color;
            else
                e.style.color = '#48f';
        }
        if (i === p_index){
            e = this._elements[i];
            e.className = 'selected';
            if (this.options.hasOwnProperty('selected_color'))
                e.style.color = this.options.selected_color;
            else{
                e.style.color = '#f80';
            }
        }
    }
    this._current = p_index;
}
SimpleList.prototype._onClicked = function(p_e){
    var i;
    for (i = 0 ; i < this._elements.length ; i++){
        if (p_e === this._elements[i]){
            if (i === this._current)
                return;
            else{
                this._updateSelection(i);
                this._state.current = i;
                this._registerStateChanges();
                break;
            }
        }
    }
}

p_namespace.SimpleList = SimpleList;

registerHelp('TreeList', {
    title: 'Простое дерево, выполненное в виде списка (с элементом "перейти на уровень выше")',
    //descr: '',
    options:{
        selectable: 'должно ли иметь место понятие "текущий элемент"',
        color: 'цвет',
        selected_color: 'цвет текущего элемента',
        hover_color: 'цвет фона при наведении курсора мыши'
    },
    stateObj:{
        data: 'список корневых элементов. Каждый элемент представлен объектом со следующими свойствами: id (если selectable), title(строка), children(список дочерних элементов)',
        current: 'id текущего элемента. Если не указан, но виджет является selectable, текущим устанавливается первый корневой элемент'
    }
});
function TreeList(p_wContainer, p_options){
    Traliva.WidgetStateSubscriber.call(this, p_wContainer, p_options);
    this.__TreeList = {
        publisher: new Traliva.StatePublisher(),
        state: {list:[{title:'1111'},{title:'2222'}]}
    };
    this.__TreeList.publisher.setState(this.__TreeList.state);
    this.__TreeList.publisher.registerSubscriber(
        new TralivaKit.SimpleList(
            p_wContainer,
            {
                getText: function(p){return p.title;},
                selectable: p_options.selectable,
                color: p_options.color,
                selected_color: p_options.selected_color,
                hover_color: p_options.hover_color
            }
        )
    );
    // ...
}
TreeList.prototype = Object.create(Traliva.WidgetStateSubscriber.prototype);
TreeList.prototype.constructor = TreeList;
TreeList.prototype.processStateChanges = function(s){
    if (!s){
        console.error('epic fail');
        return;
    }
    // ...
}

p_namespace.TreeList = TreeList;

registerHelp('TextEdit', {
    title: 'поле редактирования текста',
    //descr: '',
    options:{
        color: 'Цвет текста. По умолчанию, жёлтый',
        textVarName: 'имя свойства, хранящего текст. По умолчанию, \'text\'',
        changedVarName: 'Если не задано, в режиме реального времени мониторится изменение текста. Если указано значение типа Строка, то свойство с таким именем в объекте состояния трактуется как Boolean, характеризующий, надо ли обновить (т.е. изменился ли) текст на виджете.',
        shared: 'true, если снятие флага changed(или как вы там его назвали?) в объекте состояния не надо делать(пользователь устанавливает данные и флаг changed, затем снимает флаг changed)\n\
     false, если хотите, чтобы виджет сам снимал флаг changed после того, как изменения данных были отображены в виджете.\n\
     по умолчанию, false. Применим только в случае, когда задан changedVarName.'
    },
    //stateObj:{}
});
function TextEdit(p_wContainer, p_options){
    Traliva.WidgetStateSubscriber.call(this, p_wContainer, p_options);
    this._options = p_options;
    if (!p_options.hasOwnProperty('textVarName'))
        this._options.textVarName = 'text';
    p_wContainer.setContent(Traliva.createElement('<textarea spellcheck="false" traliva="e"></textarea>', this));
    this.e.style.resize = 'none';
    this.e.style.border = 'none';//'1px solid #ffa';
    this.e.style.color = p_options.color || '#ffa';
    this.e.addEventListener('change', (function(self, tt){return function(){
        self._state[self._options.textVarName] = self.e.value;
        if (tt)
            self._state[tt] = true;
        self._registerStateChanges();
    };})(this, p_options.changedVarName));
    if (p_options.hasOwnProperty('bg'))
        this.e.style.background = p_options.bg;
    p_wContainer._onResized = (function(e){return function(w, h){
        e.style.width = (w-0) + 'px';
        e.style.height = (h-0) + 'px';
    };})(this.e);
}
TextEdit.prototype = Object.create(Traliva.WidgetStateSubscriber.prototype);
TextEdit.prototype.constructor = TextEdit;
TextEdit.prototype.processStateChanges = function(s){
    if (!s){
        console.error('epic fail');
        return;
    }
    if (this._options.hasOwnProperty('changedVarName')){
        if (s[this._options.changedVarName]){
            this.e.value = s[this._options.textVarName] || '';
            if (!this._options.shared){
                delete s[changedVarName];
                this._registerStateChanges();
            }
        }
    }
    else{
        if (this._text !== s[this._options.textVarName]){
            this.e.value = s[this._options.textVarName] || '';
            this._text = s[this._options.textVarName];
        }
    }
    // ...
}

p_namespace.TextEdit = TextEdit;

registerHelp('ComboBox', {
    title: 'выпадающий список',
    //descr: '',
    options:{
        variants: 'список вариантов (исходный).'
    },
    stateObj:{
        variants: 'список вариантов. Каждый должен быть представлен объектом с полями id и title',
        variants_changed: '(boolean) флаг о том, что список вариантов изменился, и список отображаемых вариантов необходимо обновить',
        shared: '(boolean) если true, то компонент не будет сам снимать флаг о том, что данные изменились (внешнее снятие флага)',
        current: 'id текущего элемента. Особое значение - \'-1\' - означает, что элемент не выбран.'
    }
});
function ComboBox(p_wContainer, p_options){
    Traliva.WidgetStateSubscriber.call(this, p_wContainer, p_options);
    this._options = p_options;
    this._wContainer = p_wContainer;
    if (p_options.hasOwnProperty('variants')){
        this._setupContainer(p_options.variants, -1);
    }
    else{
        // "нет вариантов" - отображаем пустой список (сейчас это просто отсутвие виджета)
    }
}
ComboBox.prototype = Object.create(Traliva.WidgetStateSubscriber.prototype);
ComboBox.prototype.constructor = ComboBox;
ComboBox.prototype.processStateChanges = function(s){
    if (!s){
        console.error('epic fail');
        return;
    }
    if (s.variants_changed){
        this._setupContainer(s.variants, (s.current === undefined) ? -1 : s.current);
        if (!this._options.shared){
            s.variants_changed = false;
            this._registerStateChanges();
        }
    }
    else{
        if (this._current !== s.current){
            if (this.e)
                this.e.value = s.current;
            this._current = s.current;
        }
    }
}
ComboBox.prototype._setupContainer = function(p_variants, p_current){
    //элемент select не поддерживает изменение вариантов, поэтому мы полностью заменяем select
    var i, t, tt;
    this._wContainer.setContent(Traliva.createElement('<select traliva="e"></select>', this));
    for (i = 0 ; i < p_variants.length ; i++){
        t = document.createElement('option');
        t.value = p_variants[i].id;
        tt = document.createTextNode(p_variants[i].title);
        t.appendChild(tt);
        this.e.appendChild(t);
    }
    this.e.value = p_current;
    this.e.addEventListener('change', (function(self){return function(){
        self._state.current = self.e.value;
        self._current = self.e.value;
        self._registerStateChanges();
    };})(this))
    this._current = p_current;
    this._wContainer._onResized = (function(e){return function(w, h){
        e.style.width = w + 'px';
        e.style.height = h + 'px';
    };})(this.e);
}

p_namespace.ComboBox = ComboBox;


function checkForInheritance(p_validating, p_validatingFor){
    //return (new p_validating()) instanceof p_validatingFor;

    var i;
    var counter = 0;
    for (i = p_validating.prototype ; i ; i = i.constructor.prototype.__proto__){
        if (i.constructor === p_validatingFor)
            return true;
    }
    return false;
}

p_namespace.list = function(){
    var retVal = [];
    var i, cand;
    for (i in p_namespace){
        cand = p_namespace[i];
        if (checkForInheritance(cand, Traliva.WidgetStateSubscriber))
            retVal.push(cand.name);
    }
    return retVal;
}

})(TralivaKit);
}
