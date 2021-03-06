/*
p_scroll - (ориг. p_ifCutTails"обрубать концы" - bool-флаг; обрезать ли содержимое, если не умещается в отведённой области; если false, то в случае, когда контент не умещается, появляются полосы прокрутки)
p_sroll - политика скрола. Строка. Возможные значения - 'v', 'h', 'vh' и ''(или undefined, по умолчанию)
Если в каком-то направлении нет автопрокрутки, в том направлении вступает в силу подгон размеров содержимого под размер виджета.
//
*/
// -- class $_WidgetBase --
function $_WidgetBase($0){
    //$0 - p_parentWidget

    this.$__onscrollOkFunc;
    this.$__isVisible = true;
    this.$__isMouseEventsBlocked = false;
    this.$__wParent = $0;
    //this.$__planedResize = undefined;

    this.$_div = document.createElement('div');
    /* сейчас врйчную запускать _WidgetBase не предполагается - только через $Traliva.$WidgetStateSubscriber */
	/*if ($0 && $0 instanceof HTMLDivElement)
		this.$_div = $0;
	else{
		this.$_div = document.createElement('div');
        this.$__wParent = $0;
    }*/

    this.$_div.style.overflow = 'hidden';
    /* сейчас этим занимается $Traliva.$WidgetStateSubscriber */
    /*if ((!$p_scroll) || ($p_scroll === ''))
        this.$_div.style.overflow = 'hidden';
    else if ($p_scroll === 'vh')
        this.$_div.style.overflow = 'auto';
    else if ($p_scroll === 'v'){
        this.$_div.style.overflowX = 'hidden';
        this.$_div.style.overflowY = 'auto';
    }
    else if ($p_scroll === 'h'){
        this.$_div.style.overflowX = 'auto';
        this.$_div.style.overflowY = 'hidden';
    }
    else
        console.log('error: incorrect \'$p_scroll\' passed: '+$p_scroll);*/

	this.$_div.onscroll = (function($self){
		return function($2){
            //console.log($2.target);
            //console.log($self.$_div);
            //if ($self.$_div.scrollHeight > $self.$_div.offsetHeight)
    		//	$self.$_onScrolled($self.$_div.scrollTop);
            $self.$_onScrolled($self.$_div.scrollTop);
		};
	})(this);
    this.$_div.style.padding = '0px';

	this.$_content = this.$_createContentElem();
	this.$_div.appendChild(this.$_content);
	if (!this.$_content)
		console.log('epic fail');
    #USAGE_BEGIN#debug##
    if ($0){
		if (!($0 instanceof $_WidgetBase)){
			console.log('class ' + this.constructor.name +
				': incorrect parent passed to constructor: ' + $0.constructor.name +
				'. Available type to use: $Traliva.$_WidgetBase.');
        }
    }
    #USAGE_END#debug##
	if (!$0){
		var $eBody = document.getElementsByTagName('body')[0];
		$eBody.style.overflow = "hidden";
		$eBody.style.margin = '0';
		//this.$_div.style.background='#444';
		this.$_div.style.margin = '0';
		$eBody.appendChild(this.$_div);

		(function($self){
			var $0 = function(){
				var $w = window.innerWidth;
				var $h = window.innerHeight;
				$self.$resize($w,$h);
			};
			if(window.attachEvent) {
				window.attachEvent('onresize', $0);
				window.attachEvent('onload', $0);
	 		}
			else if(window.addEventListener) {
				window.addEventListener('resize', $0, true);
				window.addEventListener('load', $0, true);
			}
			else{
				console.log('epic fail.')
			}
		})(this);
	}
	this.$_divInitialDisplayProperty = this.$_div.style.display;
};
$_WidgetBase.prototype.$isMouseEventsBlocked = function(){
    return this.$__isMouseEventsBlocked;
};
$_WidgetBase.prototype.$__blockScrollHandler = function($e){
    $e.preventDefault();
};
$_WidgetBase.prototype.$setMouseEventsBlocked = function($b){
    if ($b != this.$__isMouseEventsBlocked){
        if ($b){
            this.$__onscrollOkFunc = this.$_div.onscroll;
            this.$_div.onscroll = this.$__blockScrollHandler;
        }
        else{
            this.$_div.onscroll = this.$__onscrollOkFunc;
            this.$__onscrollOkFunc = undefined;
            //за то время, что виджет был отключен, у него могли быть определены обработчики.
            //сейчас те обработчики будут потеряны - используйте onScrolled вместо подписывания на событие скроллинга
        }
        //this.$_div.style.pointerEvents = $b ? 'none' : 'auto';
        this.$__isMouseEventsBlocked = $b;
    }
};
$_WidgetBase.prototype.$_createContentElem = function(){
	console.log('this method must be reimplemented');
	var $retVal = document.createElement('div');
	$retVal.style.background = '#f00';
	return $retVal;
};
$_WidgetBase.prototype.$resize = function($w, $h){
    if (!this.$__isVisible){
        this.$__planedResize = ($w === this.$__w && $h === this.$__h)?
                                    undefined :
                                    {
                                        $w: $w,
                                        $h: $h
                                    };
        return;
    }
    this.$__w = $w;
    this.$__h = $h;
    var $1 = $h + 'px', $2 = $w + 'px', $0 = this.$_div.style;
	$0.height = $1;
	$0.maxHeight = $1;
	$0.minHeight = $1;
	$0.width = $2;
	$0.maxWidth = $2;
	$0.minWidth = $2;

	//Это была очень крупная ошибка. Оставил закомментированным, чтобы напоминало о том, что так нельзя.
	/*this.$_content.style.height = $h + 'px';
	this.$_content.style.maxHeight = $h + 'px';
	this.$_content.style.minHeight = $h + 'px';
	this.$_content.style.width = $w + 'px';
	this.$_content.style.maxWidth = $w + 'px';
	this.$_content.style.minWidth = $w + 'px';*/
	if ($1 = this.$_onResized($w, $h)){
        if ($1.$w){
            $0.width = $2.$w + 'px';
            $0.maxWidth = $2.$w + 'px';
            $0.minWidth = $2.$w + 'px';
        }
        if ($1.$h){
            $0.height = $1.$h + 'px';
            $0.maxHeight = $1.$h + 'px';
            $0.minHeight = $1.$h + 'px';
        }
    }
    //if (this.$_div.scrollHeight > this.$_div.clientHeight){
    /*if (this.$_content.scrollHeight > $h){
        this.$_div.onscroll = (function($self){
            return function(e){
                console.log(e.target);
                console.log($self.$_div);
                if ($self.$_div.scrollHeight > $self.$_div.offsetHeight)
                    $self.$_onScrolled($self.$_div.scrollTop);
            };
        })(this);
    }*/
};
$_WidgetBase.prototype.$setVisible = function($p_visible){
    var $1;
    if ($p_visible !== this.$__isVisible){
    	this.$_div.style.display = $p_visible ? this.$_divInitialDisplayProperty : 'none';
        if (this.$__isVisible !== $p_visible){
            this.$__isVisible = $p_visible;
            this.$_onVisibilityChanged($p_visible);
            if ($1 = this.$__planedResize){
                this.$resize($1.$w, $1.$h);
                this.$__planedResize = undefined;
            }
            //должны оповерстить родительские элементы об изменении видимости дочернего элемента
            if (this.$__wParent)
                this.$__wParent.$_onChildVisibilityChanged(this);
        }
    }
};
$_WidgetBase.prototype.$_onChildVisibilityChanged = function($wChild){};
$_WidgetBase.prototype.$isVisible = function(){return this.$__isVisible;};
$_WidgetBase.prototype.$_onResized = function($w, $h){
	//console.log('this method must be reimplemented: update content or child elements sizes for <this.$_content> for given in parameters new size');
    // В ходе переопределения данного метода не забудьте вызвать реализацию базового класса.
    this.$__w = $w;
    this.$__h = $h;
};
$_WidgetBase.prototype.$_onScrolled = function($pos){
	// reimplement this method if you need
};
$_WidgetBase.prototype.$_onVisibilityChanged = function($p_visible){
};
// -- end class $_WidgetBase --
