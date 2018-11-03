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
    this.$_debugMode = false;
    if (this.$initPath.substr(0, 7) === 'file://'){
        if ($Traliva.$__d.$o.hasOwnProperty('$states') && $Traliva.$__d.$o.$states.hasOwnProperty('$tree') && $Traliva.$debug && $Traliva.$debug.$url){
            this.$_debugMode = true;
            this.$initPath = '';
        }
        else
            console.error('Запуск маппера URL в состояние из файловой системы возможен только при активированном режиме отладки \'url\'');
    }
    this.$isVirgin = true;
    console.log('%%% initPath:', this.$initPath);
}
$StateToUrlMapper.prototype = Object.create($StateSubscriber.prototype);
$StateToUrlMapper.prototype.constructor = $StateToUrlMapper;
$StateToUrlMapper.prototype.$processStateChanges = function(s){
    if (this.$isVirgin){
        if (!this.$debugMode){
            window.onpopstate = (function($0){return function(){
                $0.$_state = $0.$updateState();
                $0.$_registerStateChanges();
            };})(this);
        }
        this.$_state = this.$updateState();
        this.$_registerStateChanges();
    }
    //$Traliva.$history.pushState('/123/123/123');
    //pushState('asd/asd/asd');
}
$StateToUrlMapper.prototype.$updateForUrl = function($p_url){
    console.log('--', $p_url);
}
$StateToUrlMapper.prototype.$updateState = function(){
    console.log('---');
}
