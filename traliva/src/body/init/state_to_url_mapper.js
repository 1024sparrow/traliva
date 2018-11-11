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
    var i, ii, cand, o, tmp;
    for (i = url.indexOf('/', 1) ; i >= 0 ; i = url.indexOf('/', 1)){
        cand = url.slice(1, i);
        if (cand.length) // встречающиеся двойные слеши трактуем как одинарные
            ar.push(cand);
        url = url.slice(i);
        console.log('*', i, ar, url);
    }
    console.log('*-*', i, ar, url);
    //bTree = (i === 0) ? bTree[ar[i]] : bTree.$d[ar[i]];

    // проставляет свойство __parent (без s) в каждый узел дерева, за исключением корневых элементов
    var stack = this.$_tree.slice();
    console.log('TREE pre: ' + JSON.stringify(this.$_tree));
    for (i = 0 ; i < this.$_tree.length ; ++i){
        this.$_tree[i].__isRoot = true; // __isRoot - без 's'
        this.$_tree[i].__list = [this.$_tree[i]]; // __list - без 's'
    }
    while (stack.length){
        o = stack.pop();
        //
        for (ii in o){
            if (o[ii].$d){
                for (i = 0 ; i < o[ii].$d.length ; ++i){
                    tmp = o[ii].$d[i];
                    tmp.__parent = o; // __parent - без 's'
                    //tmp.__list = JSON.parse(JSON.stringify(o.__list));
                    //
                    stack.push(tmp);
                }
            }
        }
    }
    console.log('TREE: ', this.$_tree);//

    if (stateChanged)
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
