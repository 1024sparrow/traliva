'use strict';

EXTERNAL.scope.states = {

initState: {
    /*select:{
        current: 1,
        page_jumped: false,
        variants: [
            [1, 'один'],
            [2, 'два'],
            [3, 'три']
        ]
    },
    bn:{
        toggled: false,
    }*/

    /*cur_chapter:{
        id: 1
    },*/
    show_contents: false
},
tree: {
    _default:{
        processor: function(s){
            console.log('default for root set');
            s.cur_chapter = {id:1};
        }
    },
    chapter:{
        params: 1,
        in: function(s, p){
            console.log('show page '+p[0]);
            /*if ((p[0] > 0) && (p[0] <= 3)){
                s.select.current = p[0];
            }
            else
                return false;*/
            if (!s.hasOwnProperty('cur_chapter'))
                s.cur_chapter = {};
            s.cur_chapter.id = p;
        },
        change: function(s, p1, p2){
        },
        out: function(s){
        },
        children:{
            _default:{
                processor: function(s){
                    console.log('default for page set');
                }
            },
            contents:{
                in: function(s){
                    console.log('show contents (over page)');
                    //s.bn.toggled = true;
                    s.show_contents = true;
                },
                change: function(s, p1, p2){
                },
                out: function(s){
                    console.log('contents destruct');
                    //s.bn.toggled = false;
                    s.show_contents = false;
                }
            }
        }
    }
},
initPath: '/django/',
//initPath: '/',

_prev_values:{
    cur_id: undefined
},
stringifyState: function(s, b){
    //s.cur_chapter.id = 1;//
    var ifReplaceBoolRetVal = false;
    if (s.cur_chapter.id !== this._prev_values.cur_id){
        if (!s.cur_chapter.hasOwnProperty('jumped') || !s.cur_chapter.jumped)
            ifReplaceBoolRetVal = true;
        this._prev_values.cur_id = s.cur_chapter.id;
    }

    var retVal = 'chapter/' + s.cur_chapter.id + '/';
    if (s.show_contents)
        retVal += 'contents/';

    if (b)
        b.b = ifReplaceBoolRetVal;
    return retVal;
}

}
'use strict';

EXTERNAL.scope.CONTENTS_BUTTON_GEOMETRY = {w:169,h:49};
'use strict';

function Contents(wContainer, statesObj){
    B.StateSubscriber.call(this);
    //wContainer.setContent(undefined, '#faa');
    this._statesObj = statesObj;
    wContainer.setVisible(false);
    this._wWidget = wContainer;
    this._showContents = false;
    this._curId = undefined;

    this._map;//id -> item
    this._eTable = document.createElement('table');
    this._eTable.className = 'contents';
    //wContainer.setContent(this._eTable, 'rgba(0,0,0,0.9)');
    wContainer.setContent(this._eTable, '#222');
}
Contents.prototype = Object.create(B.StateSubscriber.prototype);
Contents.prototype.constructor = Contents;
Contents.prototype.processStateChanges = function(s){
    if (!s.hasOwnProperty('contents') || s.contents.length == 0)
        return;
    var curItem, i, tmp;
    if (this._map)
        curItem = this._map[this._curId];
    else{
        this._map = {};
        for (i = s.contents.length - 1 ; i >= 0 ; i--){
            //вставляем в таблицу строки для корневых узлов
            //пишем в item-ы свойство 'e' с указателем на соответствующую вставленную строку
            var eRow = this._eTable.insertRow(0);
            this._createRowContent(eRow, s.contents[i]);
        }

        var stack = s.contents.slice();
        while (stack.length){
            var p = stack.pop();
            this._map[p.id] = p;
            if (p.hasOwnProperty('d')){
                for (var i = 0 ; i < p.d.length ; i++){
                    stack.push(p.d[i]);
                }
            }
        }
    }
    if (s.show_contents === this._showContents)
        return;
    this._showContents = s.show_contents;

    if (this._showContents){
        if (s.cur_chapter.id !== this._curId){
            //1.) СТАЛ -> '/': сохраняем массив ids.
            //2.) был -> '/': если ids не содержит такого id, то сворачиваем. Если такой id есть в ids, то удаляем из ids id от текущего до начала, и выходим из цикла (break). Этот пункт - под условием "if (curItem)".
            //3.) Цикл по ids (от начала к концу): разворачиваем элементы.
            //*) Разворачивание/сворачивание элемента подразумевает под собой вставка/удаление строк в таблицу, а также изменение значения свойства 'e' у элемента.
            var ids = [];
            // 1
            for (i = this._map[s.cur_chapter.id] ; i ; i = (i.hasOwnProperty('p') ? i.p() : null)){
                ids.push(i.id);
            }
            // 2
            if (curItem){
                for (; curItem ; curItem = (curItem.hasOwnProperty('p') ? curItem.p() : null)){
                    i = ids.indexOf(curItem.id);
                    if (i < 0){
                        //сворачиваем: e=false, удаляем дочерние элементы из таблицы.
                        this._expandItem(curItem, curItem.elem, false);
                    }
                    else{
                        //удаляем из ids ... и выходим
                        if (i > 0)
                            ids = ids.slice(0, i);
                        else
                            ids = [];
                        break;
                    }
                }
            }
            // 3
            while (ids.length){
                i = this._map[ids.pop()];
                this._expandItem(i, i.elem, true);
            }

            this._curId = s.cur_chapter.id;
            //console.log(this._curId);
            this._registerStateChanges();
        }
    }
    this._wWidget.setVisible(this._showContents);
}
Contents.prototype._createRowContent = function(eRow, oRow){
    oRow.elem = eRow;
    var eT = document.createElement('table');
    var eR = eT.insertRow();

    var cLabel = eR.insertCell(0);
    //cLabel.innerHTML = oRow.t;
    var eLabel = document.createElement('a');
    eLabel.className = 'label';
    if (this._statesObj){
        eLabel.href = this._statesObj.initPath +
            this._statesObj.stringifyState({
                show_contents: false,
                cur_chapter:{
                    id: oRow.id
                }
            });
    }
    else{
        eLabel.href = '';
    }
    eLabel.addEventListener('click', (function(self, id){return function(event){
            event.preventDefault();
            self._state.cur_chapter = {
                id: id,
                jumped: true
            };
            self._state.show_contents = false;
            self._registerStateChanges();
            self._wWidget.setVisible(false);
        };})(this, oRow.id));
    eLabel.innerHTML = oRow.t;
    cLabel.appendChild(eLabel);
    var cIcon = eR.insertCell(0);
    var eIcon = document.createElement('div');
    eIcon.addEventListener('click', (function(self, oRow, eRow){return function(){
        self._expandItem(oRow, eRow, !(oRow.hasOwnProperty('e') && oRow.e));
        self._registerStateChanges();
    }})(this, oRow, eRow));
    eIcon.className = 'icon';
    cIcon.appendChild(eIcon);
    if (oRow.hasOwnProperty('d') && oRow.d.length){
        oRow.e_icon = eIcon;
        oRow.e_icon.className = 'icon collapsed';
    }

    var cIndent = eR.insertCell(0);
    cIndent.style.width = (oRow.level*10)+'px';

    eRow.insertCell().appendChild(eT);
}
Contents.prototype._expandItem = function(oRow, eRow, ifExpand){
    //console.log(oRow.id+' -> '+ifExpand);
    var tmp, t;
    if ((ifExpand && oRow.e)||(!ifExpand && !oRow.e))
        return;

    if (oRow.hasOwnProperty('e_icon')){
        oRow.e_icon.className = !oRow.e ? 'icon expanded' : 'icon collapsed';
    }
    var i, startIndex, row;
    var stack = [oRow];
    if (!ifExpand){
        var stackTmp = [oRow];
        while (stackTmp.length){
            tmp = stackTmp.pop();
            if (tmp.hasOwnProperty('d')){
                for (i = 0 ; i < tmp.d.length ; i++){
                    t = tmp.d[i];
                    if (t.e){
                        stack.push(t);
                        stackTmp.push(t);
                    }
                }
            }
        }
    }
    while (stack.length){
        tmp = stack.pop();
        if (!tmp.hasOwnProperty('d'))
            continue;
        startIndex = tmp.elem.rowIndex + 1;
        for (i = 0 ; i < tmp.d.length ; i++){
            if (ifExpand){
                t = tmp.d[i];
                t.e = false;
                row = this._eTable.insertRow(startIndex + i);
                this._createRowContent(row, t);
            }
            else{
                this._eTable.deleteRow(startIndex);
            }
        }
        tmp.e = ifExpand;
    }
}
EXTERNAL.scope.Contents = Contents;
'use strict';

function ContentsButton(wContainer){
    B.StateSubscriber.call(this);
    this.eBn = document.createElement('div');
    this.eBn.className = 'contents_button';
    this.eBn.addEventListener(
        'click',
        (function(self){return function(){self._onClicked()}})(this)
    );
    wContainer.setContent(this.eBn);
    this._showContents = false;
}
ContentsButton.prototype = Object.create(B.StateSubscriber.prototype);
ContentsButton.prototype.constructor = ContentsButton;
ContentsButton.prototype.processStateChanges = function(s){
    if (s.show_contents === this._showContents)
        return;
    this._showContents = s.show_contents;
    this._updateClass();
}
ContentsButton.prototype._onClicked = function(){
    this._showContents = !this._showContents;
    this._state.show_contents = this._showContents;
    this._registerStateChanges();
    this._updateClass();
}
ContentsButton.prototype._updateClass = function(){
    this.eBn.className = 'contents_button';
    if (this._showContents)
        this.eBn.className += ' active';
}
EXTERNAL.scope.ContentsButton = ContentsButton;
'use strict';

function Text(wContainer){
    B.StateSubscriber.call(this);
    EXTERNAL.html.text.style.display = 'block';
    wContainer.setContent(EXTERNAL.html.text, '#ffc');
    wContainer._onScrolled = (function(self){return function(pos){self._onScrolled(pos)};})(this);
    wContainer._onResized = (function(self){return function(pos){self._onResized()};})(this);
    wContainer._div.className = 'text';
    this._wContainer = wContainer;
    this._offsetMap = [];//соответствие смещения по странице позиции в оглавлении
    this._isVirgin = true;
    this._curId;
}
Text.prototype = Object.create(B.StateSubscriber.prototype);
Text.prototype.constructor = Text;
Text.prototype.processStateChanges = function(s){
    if (this._isVirgin){
        this._init();
        setTimeout((function(self){return function(){self._onResized();};})(this), 0);//Знакомьтесь: это КОСТЫЛЬ.
        this._isVirgin = false;
    }
    var tmpId = s.hasOwnProperty('cur_chapter') ? s.cur_chapter.id : undefined;
    if (this._curId !== tmpId){
        var tmp = this._offsetMap[tmpId - 1];
        if (!tmp)
            console.log('epic fail');
        this._updateTextForId(tmp.item);
        this._registerStateChanges();
        this._wContainer._div.scrollTop = tmp.pos;

        this._curId = tmpId;
    }
}
Text.prototype._onScrolled = function(pos){
    var i, t;
    for (i = this._offsetMap.length - 1 ; i >= 0 ; i--){
        t = this._offsetMap[i];
        if (pos >= t.pos){
            t = t.item;
            i = 0;
            break;
        }
    }
    if (i){
        if (this._offsetMap.length)
            t = this._offsetMap[0].item;
    }
    if (this._state.cur_chapter.id === t.id)
        return;
    this._curId = t ? t.id : undefined;
    this._state.cur_chapter.id = this._curId;
    if (t)
        this._updateTextForId(t);
    this._registerStateChanges();
}
Text.prototype._updateTextForId = function(t){//t - id or object
    if (typeof t != 'object')
        t = this._offsetMap[t-1].item;
    var i = [];
    do{
        i.unshift(t.t);
        t = t.hasOwnProperty('p') ? t.p() : null;
    }while(t);
    this._state.cur_chapter.title = i;
}
Text.prototype._onResized = function(){
    var i, tmp;
    for (i = 0 ; i < this._offsetMap.length ; i++){
        tmp = this._offsetMap[i];
        tmp.pos = tmp.textelem.offsetTop;
        if (i === (this._curId - 1))
            this._wContainer._div.scrollTop = tmp.pos;
    }
}
Text.prototype._init = function(){
    var retval = [];

	var list = EXTERNAL.html.text.children;
	var reHeaderTags = /^H([1-6])$/;
    var e, tmp, cand, hasBurned;
    var idCounter = 1;

    var levels = [];
	for (var i = 0 ; i < list.length ; i++){
		e = list[i];
		tmp = e.tagName.match(reHeaderTags);
		if (!tmp)
			continue;
		//var level = res[1];//Уровень здесь "обратный" - меньшее значение level соответвует более крупному разделу
        cand = {level:tmp[1],item:{id:idCounter,t:e.innerHTML}};
        this._offsetMap.push({item:cand.item, textelem: e});
        hasBurned = false;
        while (levels.length){
            tmp = levels.pop();
            if (cand.level > tmp.level){
                if (!tmp.item.hasOwnProperty('d'))
                    tmp.item.d = [];
                tmp.item.d.push(cand.item);
                (function(t){
                    //вот такой функцией, а не тупо сохранить как свойство указатель - чтобы не было EPIC FAIL у отладочного виджета, который в режиме реального времени отображает на экране текстовое представление объекта (JSON.stringify(..) у циклических объектов)
                    cand.item.p = function(){return t;};
                })(tmp.item);
                hasBurned = true;
                levels.push(tmp);
                levels.push(cand);
                break;
            }
        }
        if (!hasBurned){
            levels.push(cand);
            retval.push(cand.item);
        }
        //console.log(e.innerHTML);
        idCounter++;
    }
    //console.log(JSON.stringify(this._offsetMap, undefined, 2));//

    //у каждого элемента retval проставляем свойство 'level' согласно результирующей структуре
    levels = retval.slice();//levels использовали потому, что эта переменная уже есть. Если бы заводил новую переменную, то назвал бы её "stack".
    for (i = 0 ; i < levels.length ; i++){
        levels[i].level = 0;
    }
    while(levels.length){
        tmp = levels.pop();
        if (tmp.hasOwnProperty('d')){
            for (i = 0 ; i < tmp.d.length ; i++){
                tmp.d[i].level = tmp.level + 1;
                levels.push(tmp.d[i]);
            }
        }
    }

    //console.log(JSON.stringify(retval, undefined, 2));
    this._state.contents = retval;
    /*if (retval.length){
        tmp = retval[0];
        this._state.cur_chapter = {id:tmp.id, title:[tmp.t]};
    }*/
    tmp = undefined;//boris here
    if (this._state.hasOwnProperty('cur_chapter')){
        tmp = this._state.id;
        if (tmp < this._offsetMap.length)
            this._updateTextForId(this._offsetMap[tmp]);
    }
    this._registerStateChanges();
}
EXTERNAL.scope.Text = Text;
//var colors = ['#ffa','#884','#666'];
//var colors = ['rgba(255,255,170,1)','rgba(136,136,68, 1)','rgba(102,102,102,1)','rgba(102,102,102,0.8)','rgba(102,102,102,0.6)'];
//var colors = ['rgba(255,255,255,1)','rgba(255,255,255,0.6)','rgba(255,255,255,0.3)','rgba(255,255,255,0.2)'];
var colors = ['rgba(255,255,170,1)','rgba(136,136,68,0.6)','rgba(68,136,68,0.4)'];
//var weights = [100,50,40,30,25,20];
var weights = [40,60,100];
var __koeffs = [0.3,0.4,0.5,0.7];
var __s = [1.0,0.8,1.0,1.3,1.5,1.7];//коэффициенты коррекции для разного количества уровней заголовков
									//определяется опытным путём
var __s__over = 1.7;

function getKoeffs(count){//коэффициенты перекрытия
	var retVal = [];
	for (var i = count-1 ; i >= 0 ; i--){
		if (i >= __koeffs.length)
			retVal.push(__koeffs[__koeffs.length - 1]);
		else
			retVal.push(__koeffs[i]);
	}
	return retVal;
}
function getColors(count){
	//return colors[index%colors.length];
	var retVal = [];
	for (var i = count-1 ; i >= 0 ; i--){
		if (i >= colors.length)
			retVal.push(colors[colors.length - 1]);
		else
			retVal.push(colors[i]);
	}
	return retVal;
}
function getFontSizes(count, availSpace){
	var retVal = [];
	
	var sum = 0, tmp;
	var w = [];
	for (var i = count-1 ; i >= 0 ; i--){
		if (i >= weights.length)
			w.push(weights[weights.length - 1]);
		else
			w.push(weights[i]);
	}
	for (var i = 0 ; i < count ; i++){
		tmp = w[i];
		sum += tmp;
	}
	for (var i = 0 ; i < count ; i++){
		tmp = w[i];
		tmp = tmp * availSpace / sum;
		retVal.push(tmp);
	}
	return retVal;
}

function Title(wContainer){
    B.StateSubscriber.call(this);
	this._height = 32;
	var wStack = new B.Stack(wContainer);
	var colors = ['#afa','#48f','#ffa'];
	var sizes = ['48pt','40pt','20pt'];
	var topMargins = ['0','10','20'];
	
    this._prevTitle;
	this.eTxt = document.createElement('p');
	wContainer._div.className = 'title';
	wContainer._onResized = (function(self){return function(w,h){self._onResized(w,h);};})(this);
	wContainer.setContent(this.eTxt, '#000');
}
Title.prototype = Object.create(B.StateSubscriber.prototype);
Title.prototype.constructor = Title;
Title.prototype.processStateChanges = function(s){
    //this._rebuild();

    var cand = '';
    if (s.hasOwnProperty('cur_chapter')){
        cand = JSON.stringify(s.cur_chapter.title);
        if (s.cur_chapter.hasOwnProperty('title')){
            cand = s.cur_chapter.title.join('|');
        }
    }
    if (cand !== this._prevTitle){
    	this._rebuild();
        this._prevTitle = cand;
    }
}
Title.prototype._onResized = function(w,h){
	if (this._height == h)
		return;
    this.eTxt.style.height = h+'px';
    this.eTxt.style.minHeight = h+'px';
    this.eTxt.style.maxHeight = h+'px';
	this._height = h;
	this._rebuild();
}
Title.prototype._rebuild = function(){
	var retval = '', cand;
    if (this._state && this._state.hasOwnProperty('cur_chapter')){
        var style;
        var tt = 0.3;
        var koeffs = getKoeffs(this._state.cur_chapter.title.length);
        for (var i = 0 ; i < this._state.cur_chapter.title.length ; i++){
        }
        //var fontSizes = getFontSizes(this._state.cur_chapter.title.length, (this._height*(1.0+tt)) - 4);
        //var fontSizes = getFontSizes(this._state.cur_chapter.title.length, (this._height*(1.0+(this._state.title.length == 1)?0:tt)) - 4);
        //var fontSizes = getFontSizes(this._state.cur_chapter.title.length, (this._state.title.length == 1) ? (this._height - 8) : ((this._height*(1.0+tt)) - 8));
        var tmp = __s__over;
        if (this._state.cur_chapter.title.length < __s.length)
            tmp = __s[this._state.cur_chapter.title.length];
        var fontSizes = getFontSizes(this._state.cur_chapter.title.length, tmp * this._height);
        var colors = getColors(this._state.cur_chapter.title.length);
        var sum = 0;
        var fontSize = 0;
        for (var level = 0 ; level < this._state.cur_chapter.title.length ; level++){
            style = 'margin-left:'+(5+level*10)+'px;';
            style += 'color:'+colors[level]+';';
            tt = koeffs[level];
            style += 'top:'+(sum - fontSize*tt)+'px;';
            sum -= fontSize*tt;
            fontSize = fontSizes[level];
            style += 'font-size:'+fontSize+'px;';
            //style += 'max-height:'+fontSizes[level]+'px;';
            cand = '<p style=\''+style+'\'>' + this._state.cur_chapter.title[level] + '</p>';
            retval += cand;
            sum += fontSize;
        }
    }
	this.eTxt.innerHTML = retval;
}
EXTERNAL.scope.Title = Title;
