//=========== WIDGET ==============
//Если собираетесь устанавливать Виджет, а не DOM-элемент, в качестве содержимого,
//не указывайте второй параметр (или указывайте true), чтобы не получилось скрола внутри скрола
function $Widget($p_parentWidget, $p_attr){
	this.$_contentDiv = document.createElement('div');
	this.$__w;
	this.$__h;
	this.$__contentWidget;
	$_WidgetBase.call(this, $p_parentWidget, $p_attr);
    if ($Traliva.hasOwnProperty('$debug') && $Traliva.$debug.$uninitialized_colored){
        (function($self){
            $StubWidget__stubWidgetCount++;
            var $e = document.createElement('div');
            $e.className = '$traliva__stub_widget ' + $StubWidget__getBgByNum($StubWidget__stubWidgetCount);
            $e.style.height = '100%';
            $self.$setContent($e);
        })(this);
    }

    //this._div.className = 'widget_div';//
}
$Widget.prototype = Object.create($_WidgetBase.prototype);
$Widget.prototype.constructor = $Widget;
$Widget.prototype.$_onResized = function($w, $h){
	this.$__w = $w;
	this.$__h = $h;
	if (this.$__contentWidget)
		this.$__contentWidget.$resize($w,$h);
    // boris here: вызвать родительскую реализацию этого метода
    //$_WidgetBase.ptototype.

//{{ Подгон размера под содержимое, если не указан автоскроллинг
    var $v, $h;
    $h = $v = true;
    /*if (this._scroll === 'v')
        $h = true;
    if (this._scroll === 'h')
        v = true;
    if (this._scroll === 'vh')
        $h = $v = false;*/
    if ($v){
        this.$_content.style.height = $h + 'px';
        this.$_content.style.maxHeight = $h + 'px';
        this.$_content.style.minHeight = $h + 'px';
    }
    if ($h){
        this.$_content.style.width = $w + 'px';
        this.$_content.style.maxWidth = $w + 'px';
        this.$_content.style.minWidth = $w + 'px';
    }
//}} Подгон размера под содержимое, если не указан автоскроллинг
}
$Widget.prototype.$_createContentElem = function(){
	return this.$_contentDiv;
}
$Widget.prototype.$setContent = function($p_div, $p_bgColor){
	this.$__contentWidget = undefined;
	if ($p_div && (typeof $p_div == 'object')){
		this._div.removeChild(this.$_contentDiv);//здесь мы должны убрать предыдущий DIV
		if ($p_div instanceof HTMLElement){//dom element
			$p_div.style.margin = '0';
			this.$_contentDiv = $p_div;

			this.$_content = this.$_contentDiv;
			this._div.appendChild(this.$_content);
			if (this.$__w)
				this.$_onResized(this.$__w, this.$__h);
		}
		else if ($p_div instanceof $_WidgetBase){//widget
			this.$_contentDiv = $p_div._div;
			this.$_content = this.$_contentDiv;
			this._div.appendChild(this.$_content);
			this.$__contentWidget = $p_div;
			if (this.$__w)
				$p_div.$resize(this.$__w, this.$__h);
		}
		else{
			console.log('epic fail: '+$p_div.constructor.name);
			console.log($p_div);
		}	
	}
	//this._div.style.background = $p_bgColor ? $p_bgColor : 'rgba(0,0,0,0)';
	if ($p_bgColor)
		this._div.style.background = $p_bgColor;
}
/*$Widget.prototype.$setContent = function(content){
	if (typeof content == 'string'){//color
		this._div.style.background = content;
	}
	else if (typeof content == 'object'){
		if (content.constructor.name == 'HTMLParagraphElement'){//dom element
			content.style.margin = '0';
			this.$_contentDiv = content;

			this.$_content = this.$_contentDiv;
			this._div.appendChild(this.$_content);
			if (this.$__w)
				this.$_onResized(this.$__w, this.$__h);
		}
		else if (content instanceof $_WidgetBase){//widget
		}
		else
			console.log('epic fail');
	}
	else{
		console.log('epic fail');
	}
}*/
