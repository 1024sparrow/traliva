/****** class StateToUriMapper ***********************
Регистрировать у StatePublisher-а в первую очередь - этот подписчик задаёт исходное состояние веб-приложения. Если нужно будет зарегистрировать несколько Маперов, то такой задачи передо мной не стояло, и вопрос остаётся открытым.
*/
function StateToUriMapper(statesObj){
    StateSubscriber.call(this);
    this._statesObj = statesObj;
    var uri = window.location.href;
    var a = uri.indexOf('//');
    var ac = 2;//два слэша
    if (uri[0] == '/'){
        a++;
        ac++;
    }
    var b = uri.indexOf('/', a + ac);
    b += statesObj.initPath.length;
    this.initPath = uri.substr(0, b);
    if (this.initPath.substr(0, 7) === 'file://'){
        /*console.log('Активирован режим локального файла.');
        var i = b;
        while(i >= 0){
            b = i;
            i = uri.indexOf('/', i+1);
        }
        this.initPath = uri.substr(0, b);*/
        this.initPath = '';
    }
    //console.log(this.initPath);
    this.isVirgin = true;
    this._isStateChangeProcessing = false;

    this._prevAr = [];
}
StateToUriMapper.prototype = Object.create(StateSubscriber.prototype);
StateToUriMapper.prototype.constructor = StateToUriMapper;
StateToUriMapper.prototype.processStateChanges = function(s){
    if (this.isVirgin){
        window.onpopstate = (function(self){return function(){
            self._state = self.updateState();
            self._registerStateChanges();
        };})(this);
        this._state = this.updateState();
        this._registerStateChanges();
    }

    var cand = this.initPath;
    this._isStateChangeProcessing = true;
    var ifReplaceBoolRetVal = {b:true};
    cand += this._statesObj.stringifyState(this._state, ifReplaceBoolRetVal);
    if (cand !== ((this.initPath === '/') ? Traliva.history._current() : window.location.href)){
        if (this.isVirgin || ifReplaceBoolRetVal.b)
            Traliva.history.replaceState({}, '', cand);
        else
            Traliva.history.pushState({}, '', cand);
    }
    //if (this.isVirgin){
    if (true){
        //После того как сетевой путь был продлён согласно дефолтному состоянию, надо сохранить массив, чтобы мы как быдто по этому полному пути зашли.
        var tmp = window.location.href.substr(this.initPath.length);
        if (tmp[tmp.length - 1] == '/')
            tmp = tmp.slice(0, tmp.length - 1);
        this._prevAr = tmp.length > 0 ? tmp.split('/') : [];
    }
    this._isStateChangeProcessing = false;
    this.isVirgin = false;
}
StateToUriMapper.prototype.updateState = function(){
    //if (this._isStateChangeProcessing)
    //    return;

    var tmp = window.location.href.substr(this.initPath.length);
    if (tmp[tmp.length - 1] == '/')
        tmp = tmp.slice(0, tmp.length - 1);
    var i, i1, i2, tmpOld, p, pOld, ok, cand;
    var ar = tmp.length > 0 ? tmp.split('/') : [];
    var prevArCandidate = ar.slice();

    var treeRefOld = this._statesObj.tree;
    var treeRef = this._statesObj.tree;
    var nodeDescr, nodeDescrOld;
    var p, pOld;
    //console.log('init new: '+JSON.stringify(ar));
    //console.log('init old: '+JSON.stringify(this._prevAr));
    while(ar.length){
        p = null;
        pOld = null;
        tmp = ar.shift();
        tmpOld = this._prevAr.length ? this._prevAr.shift() : null;
        //console.log(tmp+' -- '+JSON.stringify(treeRef));
        nodeDescr = treeRef ? (treeRef.hasOwnProperty(tmp) ? treeRef[tmp] : null) : null;
        if (!nodeDescr){
            console.log('e');
            ar = [];
            //break;//некорректный url страницы
            return {};
        }
        nodeDescrOld = tmpOld ? (treeRefOld.hasOwnProperty(tmpOld) ? treeRefOld[tmpOld] : null) : null;

        if (!tmpOld)
            break;//запускаем цепочку деструкции от конца this._prevAr и конструкции от начала ar
        if (tmp === tmpOld){
            //Если есть параметры, сравниваем параметры.
            //Если есть различия в параметрах, запускаем цепочку деструкции от конца this._prevAr
            ok = false;//нет различий (или нет параметров, или в них нет различий)
            if (nodeDescr.hasOwnProperty('params') && nodeDescr.params > 0){
                p = [];
                pOld = [];
                for (i = 0 ; i < nodeDescr.params ; i++){
                    i1 = ar.shift();
                    i2 = this._prevAr.shift();
                    p.push(i1);
                    pOld.push(i2);
                    if (i1 != i2)
                        ok = true;
                }
                if (ok)
                    break;
            }
        }
        else
            break;//Запускаем цепочку деструкции от конца this._prevAr
        //console.log('treeRef: '+JSON.stringify(treeRef));
        treeRef = treeRef.hasOwnProperty(tmp) ? (treeRef[tmp].hasOwnProperty('children') ? treeRef[tmp].children : null) : null;
        if (treeRefOld)
            treeRefOld = treeRefOld.hasOwnProperty(tmp) ? (treeRefOld[tmp].hasOwnProperty('children') ? treeRefOld[tmp].children : null) : null;
        //console.log('treeRef('+tmp+'): '+JSON.stringify(treeRef));
    }
    var destructQueue = [];
    //boris here: цикл деструкции: заполняем очередь задач, и затем выполняем эту очередь задач
    //console.log('new: '+tmp+' - '+JSON.stringify(ar));
    //console.log('old: '+tmpOld+' - '+JSON.stringify(this._prevAr));
    for (i = 0 ; i < this._prevAr.length ; i++){
        console.log('-- '+this._prevAr[i]);
        //boris here
    }
    while (this._prevAr.length){
        tmp = this._prevAr.shift();
        tmp = treeRefOld ? (treeRefOld.hasOwnProperty(tmp) ? treeRefOld[tmp] : null) : null;
        if (!tmp){
            console.log('ef');
            return {};
        }
        if (tmp.hasOwnProperty('params') && tmp.params > 0){
            p = [];
            for (i = 0 ; i < tmp.params ; i++){
                if (this._prevAr.length == 0){
                    console.log('ef');
                    return {};
                }
                this._prevAr.shift();
            }
        }
        if (tmp.hasOwnProperty('out'))
            destructQueue.push((function(a,b){return function(){a.out(b);};})(tmp, this._statesObj.initState));
        treeRefOld = tmp.hasOwnProperty('children') ? tmp.children : null;
    }
    while(destructQueue.length){
        destructQueue.pop()();
    }

    if (!nodeDescr){
        if (!treeRef)
            return {};
        //if (ar.length == 0)
        //    return {};
        if (treeRef.hasOwnProperty('_default'))
            treeRef._default.processor(this._statesObj.initState);
        return this._statesObj.initState;
    }
    if (p)
        nodeDescr.change(this._statesObj.initState, p, pOld);
    else
        ar.unshift(tmp);
    while(ar.length){
        tmp = ar.shift();
        //console.log(tmp);
        tmp = treeRef ? (treeRef.hasOwnProperty(tmp) ? treeRef[tmp] : null) : null;
        if (!tmp){
            console.log('ef');
            return {};
        }
        //p = [];
        if (tmp.hasOwnProperty('params') && tmp.params > 0){
            p = [];
            for (i = 0 ; i < tmp.params ; i++){
                if (ar.length == 0){
                    console.log('ef');
                    return {};
                }
                p.push(ar.shift());
            }
            tmp.in(this._statesObj.initState, p);
        }
        else
            tmp.in(this._statesObj.initState);
        treeRef = tmp.hasOwnProperty('children') ? tmp.children : null;
    }
    if (treeRef && treeRef.hasOwnProperty('_default')){
        treeRef._default.processor(this._statesObj.initState);
    }



    //console.log(this._statesObj.initPath);
    //console.log(this.initPath);
    //this._prevAr = ar;
    this._prevAr = prevArCandidate;
    return this._statesObj.initState;
}
