
/*
 * Обёртка над Traliva.ajax
 * Обеспечивает получение ответов от сервера в том же порядке, как посылались запросы. Только для GET-запросов.
 * Запросы выполнять методом  request().
 * Метод break() "отменяет" все ранее сделанные запросы (ответы игнорируются) и возвращает число "отменённых" запросов.
 * Если в качестве URL передать '_fake', то объект, переданный на вход, будет выдан на выход без каких-либо запросов на сервер.
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
$Ajax.prototype.$request = function($p_url, $p_paramObject, $p_okFunc, $p_errorFunc, $p_ignoreFunction){
    //App.backend.callMethod($p_url, $p_paramObject).then($p_okFunc).catch($p_errorFunc);
    var $0, $1, $url = $p_url;
    this.$_id = ++this.$_id % $Ajax__MAX_ID;
    if (this.$_id > $Ajax__MAX_ID_HALF){
        //
        /*$0 = this.$_pending[0] || 1;
        for ($1 in this.$_cache){
            if (this.$_cache[$1] < $0)
        }*/
        // ...
    }
    $p_paramObject.$_request_id = this.$_id;
    for ($1 in $p_paramObject){
    }
    (function($self, $p_okFunc, $p_errorFunc, $p_request_id){
        var common = function($p_func, $p_paramObj){// $p_func и $p_paramObj - функция и параметр обратного вызова
            var $1, $2 = $self.$_pending.indexOf($p_request_id);
            if ($2 < 0)
                return; // запрос был снят
            $self.$_pending.splice($2, 1);
            $self.$_cache[$p_request_id] = {func: $p_func, param: $p_paramObj};
            // если все id в $_pending больше $p_request_id, то проходим циклом по $_cache и если request_id <= $p_request_id, то вызываем соответствующие фунции и убираем эти свйоства из $_cache
            $2 = true;
            for ($1 = 0 ; $1 < $self.$_pending.length ; ++$1){
                if ($self.$_pending[$1] > $p_request_id)
                    $2 = false;
            }
            if ($2){
                $2 = [];
                for ($1 in $self.$_cache){
                    if ($1 <= $p_request_id){
                        $self.$_cache[$1].func($self.$_cache[$1].param);
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
        var fOk = function(p_data){
            delete p_data['$_request_id'];
            if (p_data._errors)
                common($p_errorFunc, {error: p_data._errors});
            else
                common($p_okFunc, p_data);
        };
        var fError = function(p_error){
            common($p_errorFunc, {error: p_error});
        };
        if ($p_url === '_fake'){
            fOk($p_paramObject);
        }
        else{
            $self.$_pending.push($p_request_id);
            //App.backend.callMethod($p_url, $p_paramObject).then(fOk).catch(fError);
            $Traliva.$ajax({});
        }
    })(this, $p_url, $p_okFunc, $p_errorFunc, this.$_id);
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
