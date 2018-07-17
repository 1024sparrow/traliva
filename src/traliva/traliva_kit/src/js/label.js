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
