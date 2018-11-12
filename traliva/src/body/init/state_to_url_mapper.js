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
    this.$prevAr = [];
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
                return function(){$0(document.location);};
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
    var $0, $1, $2, $tmp, $cand,
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
    else{ // Выставляем в 'undefined' (или '', если указано свойство 'name') по prevAr
        $eTree = this.$_tree.slice();
        for ($1 = 0 ; $1 < this.$prevAr.length ; ++$1){
            // ...
        }
    }

    // выставляем новые значения
    // ...

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
