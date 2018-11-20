function $Ajax(){
    this._id = 1; // id запроса на сервер
    this._pending = [];
    this._cache = {};
}
$Ajax.prototype.request = function(){
    //App.backend.callMethod(p_url, p_paramObject).then(p_okFunc).catch(p_errorFunc);
    this._id = ++this._id;// % Ajax__MAX_ID;
    if (this._id > Ajax__MAX_ID){
        // ...
    }
    p_paramObject._request_id = this._id;
    (function(self, p_okFunc, p_errorFunc, p_request_id){
        var common = function(p_func, p_paramObj){// p_func и p_paramObj - функция и параметр обратного вызова
            var i, a = self._pending.indexOf(p_request_id);
            if (a < 0)
                return; // запрос был снят
            self._pending.splice(a, 1);
            self._cache[p_request_id] = {func: p_func, param: p_paramObj};
            // если все id в _pending больше p_request_id, то проходим циклом по _cache и если request_id <= p_request_id, то вызываем соответствующие фунции и убираем эти свйоства из _cache
            a = true;
            for (i = 0 ; i < self._pending.length ; ++i){
                if (self._pending[i] > p_request_id)
                    a = false;
            }
            if (a){
                a = [];
                for (i in self._cache){
                    if (i <= p_request_id){
                        self._cache[i].func(self._cache[i].param);
                        a.push(i);
                    }
                }
                while (a.length){
                    i = a.pop();
                    delete self._cache[i];
                }
            }
            //else
            //    console.log('Ещё не все пришили. Ожидаю.');
        };
        var fOk = function(p_data){
            delete p_data['_request_id'];
            if (p_data._errors)
                common(p_errorFunc, {error: p_data._errors});
            else
                common(p_okFunc, p_data);
        };
        var fError = function(p_error){
            common(p_errorFunc, {error: p_error});
        };
        if (p_url === '_fake'){
            fOk(p_paramObject);
        }
        else{
            self._pending.push(p_request_id);
            //App.backend.callMethod(p_url, p_paramObject).then(fOk).catch(fError);
        }
    })(this, p_okFunc, p_errorFunc, this._id);
}
$Ajax.prototype.break = funtion(){
    var i, retVal = this._pending.length;
    this._pending = [];
    for (i in this._cache){
        delete this._cache[i];
        //this._pending.push(i);
    }
    console.log('--- отменено запросов: ', retVal,  ' ---');
    return retVal;
}
