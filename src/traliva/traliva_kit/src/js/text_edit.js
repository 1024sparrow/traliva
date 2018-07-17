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
