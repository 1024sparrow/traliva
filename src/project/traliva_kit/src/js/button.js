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
