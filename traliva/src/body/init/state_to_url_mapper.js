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
        this.$initPath = ... // boris here
    }
    this.$isVirgin = true;
    console.log('%%% initPath:', this.$initPath);
}
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
            this.$updateForUrl('http://' + $Traliva.$debug.$url);
        }
        else{
            window.onpopstate = (function($0){
                return function(){$0(document.location);};
            })(this.$updateForUrl);
            this.$updateForUrl(window.location.href);
        }
    }
    //$Traliva.$history.pushState('/123/123/123');
    //pushState('asd/asd/asd');
}
$StateToUrlMapper.prototype.$updateForUrl = function($p_url){
    console.log('--', $p_url);
}
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
