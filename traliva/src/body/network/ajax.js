
/*
 * Обёртка над Traliva.ajax
 * Обеспечивает получение ответов от сервера в том же порядке, как посылались запросы. Только для GET-запросов.
 * Запросы выполнять методом  request().
 * Метод break() "отменяет" все ранее сделанные запросы (ответы игнорируются) и возвращает число "отменённых" запросов.
 * Если в качестве URL передать '_fake', то объект, переданный на вход, будет выдан на выход без каких-либо запросов на сервер.
 * По приходу ответа от "отменённых" запросов, вызывается метод *ignore*, если он определён.
 *
 * Требования к серверному коду (python):
 * 1. На выход должен всегда выдаваться объект (dict), редиректы неприемлимы. Если на сервере произошли ошибки, этот объект должен содержать свойство '_errors' - текстовое описание ошибки или массив текстовых описаний ошибок.
 * 2.
    retval = {
        '$_request_id': request.get('$_request_id'), <-- необходимо пробрасывать на выход входной параметр '$_request_id'
        'filters': filters,
        'data': data
    }
    return retval
 */
var $Ajax__MAX_ID = 0x7ffc, $Ajax__MAX_ID_HALF = 0x3ffe; // 32764, половина - 16382
function $Ajax(){
    this.$_id = 1; // id запроса на сервер
    this.$_pending = [];
    this.$_cache = {};
    this.$_inverted = false;
}
$Ajax.prototype.$__invertId = function($0){
    if (this.$_inverted){
        if ($0 > $Ajax__MAX_ID_HALF)
            return $0 - $Ajax__MAX_ID_HALF;
        else
            return $0 + $Ajax__MAX_ID_HALF;
    }
    return $0;
};
$Ajax.prototype.$request = function($p_url, $p_paramObject, $p_okFunc, $p_errorFunc, $p_ignoreOkFunc, $p_ignoreErrorFunc){
    //App.backend.callMethod($p_url, $p_paramObject).then($p_okFunc).catch($p_errorFunc);
    var $0, $1, $url = $p_url;
    this.$_id = ++this.$_id;// % $Ajax__MAX_ID;
    if (this.$_id > $Ajax__MAX_ID_HALF){
        // меняем половинки местами, инвертируем this.$_inverted
        for ($1 = 0 ; $1 < this.$_pending.length ; ++$1){
            this.$_pending[$1] = this.$__invertId(this.$_pending[$1]);
        }
        for ($1 in this.$_cache){
            $0 = this.$_cache[$1];
            delete this.$_cache[$1];
            this.$_cache[this.$__invertId($1)] = $0;
        }
        this.$_inverted = !this.$_inverted;
        this.$_id -= $Ajax__MAX_ID_HALF;
    }
    $p_paramObject.$_request_id = this.$_id;
    $0 = false;
    for ($1 in $p_paramObject){
        $url.push($0 ? '&' : '?');
        $url.push($1 + '=' + $p_paramObject[$1]);
        $0 = true;
    }
    (function($self, $p_url, $p_okFunc, $p_errorFunc, $p_ignoreOkFunc, $p_ignoreErrorFunc, $p_request_id){
        var $requestId = this.$__invertId($p_request_id);
        var $common = function($p_func, $p_ignoreFunc, $p_paramObj){// $p_func и $p_paramObj - функция и параметр обратного вызова
            var $1, $2 = $self.$_pending.indexOf($requestId);
            var $ifIgnore = false;
            if ($2 < 0){ // запрос был снят
                if (!$p_ignoreFunc)
                    return;
                $ifIgnore = true;
            }
            else{
                $self.$_pending.splice($2, 1);
            }
            $self.$_cache[$requestId] = {$func: $p_func, $ignoreFunc: $p_ignoreFunc, $param: $p_paramObj};
            // если все id в $_pending больше $requestId, то проходим циклом по $_cache и если request_id <= $requestId, то вызываем соответствующие фунции и убираем эти свйоства из $_cache
            $2 = true;
            for ($1 = 0 ; $1 < $self.$_pending.length ; ++$1){
                if ($self.$_pending[$1] > $requestId)
                    $2 = false;
            }
            if ($2){
                $2 = [];
                for ($1 in $self.$_cache){
                    if ($1 <= $requestId){
                        $self.$_cache[$1][$ifIgnore ? '$ignoreFunc' : '$func']($self.$_cache[$1].$param);
                        $2.push($1);
                    }
                }
                while ($2.length){
                    $1 = $2.pop();
                    delete $self.$_cache[$1];
                }
            }
            //else
            //    console.log('Ещё не все пришли. Ожидаю.');
        };
        var $fOk = function($p_data){
            delete $p_data['$_request_id'];
            if ($p_data._errors)
                $common($p_errorFunc, $p_ignoreErrorFunc, {$error: $p_data._errors});
            else
                $common($p_okFunc, $p_ignoreOkFunc, $p_data);
        };
        var $fError = function($p_error){
            $common($p_errorFunc, $p_ignoreErrorFunc, {$error: $p_error});
        };
        if ($p_url === '_fake'){
            $fOk($p_paramObject);
        }
        else{
            $self.$_pending.push($requestId);
            $Traliva.$ajax({
                $sourcePath: $p_url,
                $readyFunc: $fOk,
                $errorFunc: $fError,
                //$timeout: 123,
                //$addonHttpHeaders: 123
            });
        }
    })(this, $url, $p_okFunc, $p_errorFunc, $p_ignoreOkFunc, $p_ignoreErrorFunc, this.$_id);
};
$Ajax.prototype.break = function(){
    var i, retVal = this.$_pending.length;
    this.$_pending = [];
    for (i in this.$_cache){
        delete this.$_cache[i];
        //this.$_pending.push(i);
    }
    console.log('--- отменено запросов: ', retVal,  ' ---');
    return retVal;
};
