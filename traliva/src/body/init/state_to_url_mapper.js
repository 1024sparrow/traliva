// если $o.$tree не существует, то экземпляр и не создаётся
function $StateToUrlMapper($p_statesObj){
    $Traliva.$StateSubscriber.call(this);
    this.$_statesObj = $p_statesObj;
    var $uri = window.location.href,
        $0, $tmp, $stack,
        $1,
        $2 = 2,//два слэша
        $3
    ;
    $1 = $uri.indexOf('//');
    if ($uri[0] == '/'){
        $1++;
        $2++;
    }
    $3 = $uri.indexOf('/', $1 + $2) + 1;// '/' тоже является частью URL
    //$3 += $p_statesObj.initPath.length;//<--
    this.$used = 0;
    this.$initPath = $uri.substr(0, $3);
    this.$initPathLength = $3 + 1; 
    this.$_tree = $Traliva.$__d.$o.$states.$tree;
    this.$_debugMode = $Traliva.$debug && $Traliva.$debug.$url;
    if ((this.$initPath.substr(0, 7) === 'file://') && !($Traliva.$debug && $Traliva.$debug.$url)){
        console.error('Запуск маппера URL в состояние из файловой системы возможен только при активированном режиме отладки \'url\'');
    }
    if (this.$_debugMode){
        this.$initPath = 'http://' + $Traliva.$debug.$url; // без '/' на конце
        this.$initPathLength = this.$initPath.length;
    }
    this.$prevAr = [];//
    this.$isVirgin = true;
    console.log('%%% initPath:', this.$initPath);

    // в массивах (корневой и d-свойства (дети)) - свойство __list: список предков, начиная от самого себя
    $stack = [this.$_tree];
    this.$_tree.__list = [this.$_tree];
    while ($stack.length){
        $0 = $stack.pop();
        for ($1 = 0 ; $1 < $0.length ; ++$1){
            for ($2 in $0[$1]){
                console.log('+', $0[$1][$2]);//----
                if ($0[$1][$2].$d){
                    $3 = $0[$1][$2].$d;
                    $3.__list = $0.__list.slice();
                    $3.__list.push($3);
                    $stack.push($3);
                }
            }
        }
    }
    console.log('TREE: ', this.$_tree);//----
};
$StateToUrlMapper.prototype = Object.create($StateSubscriber.prototype);
$StateToUrlMapper.prototype.constructor = $StateToUrlMapper;
/*
URL changed --> state --> URL corrected
state changed --> url
*/
$StateToUrlMapper.prototype.$processStateChanges = function(s){
    if (this.$isVirgin){
        this.$isVirgin = false;
        if (this.$_debugMode){
            this.$updateForUrl(this.$initPath, true);
        }
        else{
            window.onpopstate = (function($0){
                return function(){$0(document.location.href);};
            })(this.$updateForUrl);
            this.$updateForUrl(window.location.href, true);
        }
    }
    //$Traliva.$history.pushState('/123/123/123');
    //pushState('asd/asd/asd');
};
$StateToUrlMapper.prototype.$updateForUrl = function($p_url, $p_ifInit){
    console.log('--', $p_url, '-- initPath:', this.$initPath);
    //this.$_tree, this.$initPath, this.$initPathLength
    var $0, $1, $2, $3, $4, $5, $roots,
        $tmp, $cand,
        $ar = [], $stateChanged = false,
        $eTree
    ;
    $0 = $p_url.slice(this.$initPathLength);
    //var i, ii, cand, o, tmp;
    for ($1 = $0.indexOf('/', 1) ; $1 >= 0 ; $1 = $0.indexOf('/', 1)){
        $cand = $0.slice(1, $1);
        if ($cand.length) // встречающиеся двойные слеши трактуем как одинарные
            $ar.push($cand);
        $0 = $0.slice($1);
        console.log('*', $1, $ar, $0);
    }
    console.log('*-*', $ar, $0);
    //bTree = ($i === 0) ? bTree[$ar[$i]] : bTree.$d[$ar[$i]];

    if ($p_ifInit){
        this.$_state = $Traliva.$__d.$o.$states.$initState || {};
    }
    /*else{ // Выставляем в 'undefined' (или '', если указано свойство 'name') по prevAr
        $eTree = this.$_tree.slice();
        for ($1 = 0 ; $1 < this.$prevAr.length ; ++$1){
            $0 = this.$prevAr[$1];
        }
    }*/

    // выставляем новые значения
    // ...

    /*
        Сохраняем roots для this.$prevAr и для $ar:
            пересечения - переустановить значения параметров
            есть в prevAr, но нет в ar - деструкция
            есть в ar, но нет в prevAr - конструкция
        roots - список ссылок на узлы this.$_tree. Под именем roots - два такизх roots - для this.$_prevAr и для $ar.
        roots хранит объекты со свойствами url (один элемент из ar) и eTree
    */
    var $fCleanUsed = function($p_arr){
        var $1;
        for ($1 = 0 ; $1 < $p_arr.length ; ++$1){
            delete $p_arr[$1]['__used'];
        }
    };
    $roots = [[],[]];// для this.$prevAr и для $ar
    var $ars = [this.$prevAr, $ar];
    var $iArs, $oAr;
    var $used;
    var $appliedAr;//та часть ar, что была обработана и является корректной. Используется в случае некорректного URL для генерации корректного URL.
    $for_iArs: for ($iArs = 0 ; $iArs < 2 ; ++$iArs){
        $oAr = $ars[$iArs];
        $tmp = this.$_tree;
        $appliedAr = [];
        $for_1: for ($1 = 0 ; $1 < $oAr.length ; ++$1){
            console.log('-- 1 --');
            $used = false;
            if ($tmp){
                $for_2: for ($2 = 0 ; $2 < $tmp.__list.length ; ++$2){
                console.log('-- 2 --', $tmp.__list[$2]);//
                    for ($3 = 0 ; $3 < $tmp.__list[$2].length ; ++$3){
                    console.log('-- 3 --');
                        for ($4 in $tmp.__list[$2][$3]){
                        console.log('-- 4 --');
                            console.log('$1, $2, $3, $4', $1, $2, $3, $4, 'tmp:', $tmp);//
                            if ($4 === $oAr[$1]){
                                $cand = {
                                    $url: $4,
                                    $eTree: $tmp.__list[$2],
                                };
                                console.log('&*%*&%*&%&*^%&*^%', $tmp.__list[$2][$3]);//
                                if ($tmp.__list[$2][$3][$4].$params){
                                    console.log('parameters detected');//
                                    if ($tmp.__list[$2][$3][$4].$params.length >= ($oAr.length - $1)){
                                        // отображаем текущий узел - не указано необходимых параметров
                                        console.log('error: не указано необходимое количество параметров');
                                        break $for_2;
                                    }
                                    else{
                                        for ($5 = 0 ; $5 <= $tmp.__list[$2][$3][$4].$params.length ; ++$5){
                                            $appliedAr.push($oAr[$1 + $5]);
                                        }
                                        $cand.$params = $oAr.splice($1 + 1, $tmp.__list[$2][$3][$4].$params.length);
                                        console.log('===', JSON.stringify($appliedAr), $oAr);//
                                    }
                                }
                                else{
                                    console.log('no parameters');
                                    $appliedAr.push($oAr[$1]);
                                }
                                $used = true;
                                console.log('PUSHING:', $cand);
                                $roots[$iArs].push($cand);
                                $tmp.__list[$2][$3][$4].__used = true;
                                $tmp = $tmp.__list[$2][$3][$4].$d;
                                continue $for_1;
                            }
                        } // for $4
                    } // for $3
                } // for $2
            }
            if (!$used){
                console.log($iArs, '=================');
                console.log('ERROR!!', $appliedAr);
                // заменяем текущий URL на обрезанный, соответствующий текущей позиции в $oAr. При этом не должны ещё раз свалиться в обработчик смены URL-а.
                if (this.$_debugMode){
                    $cand = this.$initPath + '/' + $appliedAr.join('/');
                    if ($appliedAr.length)
                        $cand += '/';
                    $Traliva.$history.$_updateUrl($cand);
                }
                else{
                    // ...
                }
                break $for_iArs;
            }
        } // for $1
        $fCleanUsed($roots[$iArs]);
    } // for $iArs
    console.log('roots: ', JSON.stringify($roots, undefined, 2));

    // здесь версия, где затираем и выставляем в одном цикле
    //var arCopy = ar.slice();
    //var prevArCopy = this.$prevAr.slice();
    //for ($1 = )

    this.$prevAr = $ar;

    //if ($stateChanged)
    this.$_registerStateChanges();
};
// в соответствии с текущим URL устанавливаем нужные значения в state
/*$StateToUrlMapper.prototype.$updateState = function(){
    console.log('---');
    var url = window.location.href.slice(this.$initPathLength);
    console.log('#############', this.$initPathLength, this.$initPath, url);
    var urlArr = [];
    var i;
    while ((i = url.indexOf('/'), i) >= 0){
        console.log('::', i);
    }
    this.$_registerStateChanges();
}*/
$StateToUrlMapper.prototype.$setSubstate = function(){
};
$StateToUrlMapper.prototype.$getSubstate = function(){
};
