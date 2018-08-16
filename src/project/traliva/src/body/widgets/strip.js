//=========== STRIP ==============
$Traliva.$Strip__Orient__hor = 1;
$Traliva.$Strip__Orient__vert = 2;
function $Strip($p_orient, $p_parentWidget, $p_attr){
	this.$__orient = $p_orient;
	this.$__items = [];
	this.$__sizes = [];
	this.$__w;
	this.$__h;

	this.$_eTable = document.createElement('table');
	this.$_eTable.style.border = 'none';
	this.$_eTable.cellSpacing = '0';
	if (this.$__orient == $Traliva.$Strip__Orient__hor){
		this.$_eRowSingle = this.$_eTable.insertRow(0);
	}
	$_WidgetBase.call(this, $p_parentWidget, $p_attr);
}
$Strip.prototype = Object.create($_WidgetBase.prototype);
$Strip.prototype.constructor = $Strip;
$Strip.prototype.$_createContentElem = function(){
	return this.$_eTable;
}
$Strip.prototype.$_onResized = function($w,$h){
	this.$__w = $w;
	this.$__h = $h;
	this.$__updateSizes();
}
$Strip.prototype.$_onChildVisibilityChanged = function($wChild){
	this.$__updateSizes();
}
$Strip.prototype.$__updateSizes = function(){
	var $totalForParts = (this.$__orient == $Traliva.$Strip__Orient__hor) ? this.$__w : this.$__h;
	if ($totalForParts < 0)
		return;
	var $totalParts = 0;
	for (var $0 = 0 ; $0 < this.$__items.length ; $0++){
        if (!this.$__items[$0].$isVisible())
            continue;
		if (this.$__sizes[$0].$unit == 'px'){
			$totalForParts -= this.$__sizes[$0].$value;
		}
		else if (this.$__sizes[$0].$unit == 'part'){
			$totalParts += this.$__sizes[$0].$value;
		}
	}
	for (var $0 = 0 ; $0 < this.$__items.length ; $0++){
        if (!this.$__items[$0].$isVisible())
            continue;
		var $tmpSize = undefined;
		if (this.$__sizes[$0].$unit == 'px'){
			$tmpSize = this.$__sizes[$0].$value;
		}
		else if (this.$__sizes[$0].$unit == 'part'){
			$tmpSize = this.$__sizes[$0].$value * $totalForParts / $totalParts;
		}
		if (!$tmpSize){
			console.log('epic fail');
			continue;
		}

		var $1 = this.$__items[$0];
		if (this.$__orient == $Traliva.$Strip__Orient__hor)
			$1.$resize($tmpSize,this.$__h);
		else
			$1.$resize(this.$__w, $tmpSize);
	}
}
$Strip.prototype.$addItem = function($p_itemWidget, $p_size){
	if (typeof $p_itemWidget != 'object'){
		console.log('epic fail');
		return;
	}
	if (!($p_itemWidget instanceof $_WidgetBase)){
		console.log('epic fail');
		return;
	}
	var $size = this.$_transformStringSize($p_size);

	var $eCell;
	if (this.$__orient == $Traliva.$Strip__Orient__hor){
		$eCell = this.$_eRowSingle.insertCell(this.$_eRowSingle.cells.length);
	}
	else {
		var $eRow = this.$_eTable.insertRow(this.$_eTable.rows.length);
		$eCell = $eRow.insertCell(0);
	}
	$eCell.appendChild($p_itemWidget.$_div);
	$eCell.style.padding = '0';
	this.$__items.push($p_itemWidget);
	this.$__sizes.push($size);
}
#USAGE_BEGIN#disabled##
$Strip.prototype.$addSplitter = function(){
	if (!this.$__sizes.length){
		//Проверка сильно усложнится, когда будет добавлена поддержка сокрытия элементов
		console.log('impossible insert splitter into the start of a strip');
		return;
	}
	var splitter = new $Traliva.Widget(this);
	//Если стиль не установлен, то будет цвета подложки (сейчас это тёмно-серый #444)
	//splitter.setContent(undefined, '#f00');//установка цвета по умолчанию
	splitter._content.className = 'b__splitter';
	splitter._content.style.cursor =
		(this.$__orient == $Traliva.$Strip__Orient__hor) ? 'col-resize' : 'row-resize';
	splitter._content.addEventListener('mousedown', onMouseDown);
	var splitterItemIndex = this.$__sizes.length;
	this.$addItem(splitter, '8px');
	splitter._splitterClientPos;
	
	var strip = this;
	splitter.__lastPos;
	function onMouseDown(e){
		splitter._content.removeEventListener('mousedown', onMouseDown);
		if (strip.$__sizes.length < (splitterItemIndex + 2)){
			console.log('impossible insert splitter into the end of a strip');
			return;
		}
		splitter._splitterClientPos = (strip.$__orient == $Traliva.$Strip__Orient__hor) ?
			e.clientX : e.clientY;
		strip._content.addEventListener('mousemove', onMouseMove);
		strip._content.addEventListener('mouseup', onMouseUp);
		splitter.__lastPos =
			(strip.$__orient == $Traliva.$Strip__Orient__hor) ? e.clientX : e.clientY;
		splitter.__lastPos -= splitter._splitterClientPos;
		splitter.__prevInitSize = Object.create(strip.$__sizes[splitterItemIndex - 1]);
		splitter.__nextInitSize = Object.create(strip.$__sizes[splitterItemIndex + 1]);
	}
	function onMouseUp(e){
		strip._content.removeEventListener('mousemove', onMouseMove);
		strip._content.removeEventListener('mouseup', onMouseUp);
		splitter._content.addEventListener('mousedown', onMouseDown);
		applyPosition(splitter.__lastPos);
	}
	function onMouseMove(e){
		var nowPos = (strip.$__orient == $Traliva.$Strip__Orient__hor) ? e.clientX : e.clientY;
		nowPos = nowPos - splitter._splitterClientPos;
		applyPosition(nowPos);
		splitter.__lastPos = nowPos;
	}
	function applyPosition(nowPos){
		//var dx = nowPos - splitter.__lastPos;
		console.log(nowPos);
		// копируем, потому что после изменений, возможно, придётся отказаться от них
		//var prevSize = Object.create(strip.$__sizes[splitterItemIndex - 1]);
		//var nextSize = Object.create(strip.$__sizes[splitterItemIndex + 1]);
		var prevSize = strip.$__sizes[splitterItemIndex - 1];
		var nextSize = strip.$__sizes[splitterItemIndex + 1];
		console.log(JSON.stringify(prevSize));
		
		var a = prevSize.$unit == 'px';
		var b = nextSize.$unit == 'px';
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
			var candidate = nowPos - targetInit.$value;
			if (a){
				var candidate = splitter.__prevInitSize.$value + nowPos;
				if (candidate >= 50){
					var i = {};
					i[splitterItemIndex - 1] = candidate + 'px';
					strip.$setItemSize(i);
				}
			}
			else{
				//console.log(1);//boris here
			}
		}
	}
}
#USAGE_END#disabled##
$Strip.prototype.$setItemSize = function($sizeMap){//usage example: wRoot.$setItemSize({0:'2part'});
	for (var $0 in $sizeMap){
		if ($0 >= this.$__sizes){
			console.log('epic fail');
			continue;
		}
		var $1 = this.$_transformStringSize($sizeMap[$0]);
		this.$__sizes[$0] = $1;
	}
	this.$__updateSizes();
}
