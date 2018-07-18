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
