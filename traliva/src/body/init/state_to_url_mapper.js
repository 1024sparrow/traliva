// если $o.$tree не существует, то экземпляр и не создаётся
function $StateToUrlMapper($p_statesObj){
    $Traliva.$StateSubscriber.call(this);
    this.$_statesObj = $p_statesObj;
    var $uri = window.location.href;
    var $1 = $uri.indexOf('//');
    var $2 = 2;//два слэша
    if ($uri[0] == '/'){
        $1++;
        $2++;
    }
    var $3 = $uri.indexOf('/', $1 + $2) + 1;// '/' тоже является частью URL
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
        /*var f = (function($0){return function(){
            $0.$updateState();
        };})(this);
        if (this.$_debugMode)
            window.onpopstate = f;
        else
            $Traliva.$history.$_updateUrl = f;*/
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
    var url = $p_url.slice(this.$initPathLength);
    var ar = [];
    var stateChanged = false;
    var i, cand, o;
    for (i = url.indexOf('/', 1) ; i >= 0 ; i = url.indexOf('/', 1)){
        cand = url.slice(1, i);
        if (cand.length) // встречающиеся двойные слеши трактуем как одинарные
            ar.push(cand);
        url = url.slice(i);
        console.log('*', i, ar, url);
    }
    console.log('*-*', i, ar, url);
    var b = 0, bTree = this.$_tree, stack;
    if ($p_ifInit){
        this.$_state = $Traliva.$__d.$o.$states.$initState;
    }
    else{
        stack = this.$_tree.slice();
        for (i = 0 ; i < ar.length ; ++i){
            if (i >= this.$prevAr.length)
                break;
            b = i;
            if (ar[i] !== this.$_prevAr[i]){
                break;
            }
            //bTree = (i === 0) ? bTree[ar[i]] : bTree.$d[ar[i]];
            if (i === 0)
                bTree = bTree[ar[i]];
            else{
                bTree = bTree.$d[ar[i]];
                if (bTree.params){
                    // boris e: проверить, насколько параметры не изменились: если изменились, то записать изменения в соответствующие подсостояния
                    stateChanged = true;
                }
            }
        }
        console.log('b: ' + b + ', bTree:', bTree);
    }
    ++b;
    o = bTree;
    // Производим деструкцию старых элементов от b и bTree
    for (i = b ; i < this.$prevAr.length ; ++i){
        o = (i === 0) ? o[this.$prevAr[i]] : o.$d[this.$prevAr[i]];
        if (i)
            o = 
        // если узел дерева имеет параметры, то соответствующие подсостояния не трогаем - только по substate и name
        if (o.$name)
            this.$setSubstate(o.$substate, '');
        else
            this.$setSubstate(o.$substate, undefined);
    }

    // Производим конструкцию новых элементов от b и bTree

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
$StateToUrolMapper.prototype.$setSubstate = function(){
};
$StateToUrlMapper.prototype.$getSubstate = function(){
};
