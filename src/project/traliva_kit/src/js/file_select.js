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
