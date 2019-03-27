// если $o.$tree не существует, то экземпляр и не создаётся
function $StateToUrlMapper($p_statesObj){
    $Traliva.$StateSubscriber.call(this);
    this.$_statesObj = $p_statesObj;
    this.$_ajax = new $Traliva.$Ajax();
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
    console.log('INIT PATH: ', this.$initPath);//
    //this.$initPathLength = $3 + 1; 
    this.$initPathLength = $3 - 1; 
    this.$_tree = $Traliva.$__d.$o.$states.$tree;
    this.$_debugMode = $Traliva.$debug && $Traliva.$debug.$url;
    this.$urlUpdating = false;
    if ((this.$initPath.substr(0, 7) === 'file://') && !($Traliva.$debug && $Traliva.$debug.$url)){
        console.error('Запуск маппера URL в состояние из файловой системы возможен только при активированном режиме отладки \'url\'');
    }
    if (this.$_debugMode){
        this.$initPath = 'http://' + $Traliva.$debug.$url; // без '/' на конце
        this.$initPathLength = this.$initPath.length;
    }
    this.$prevAr = [];//
    this.$isVirgin = true;
    //console.log('%%% initPath:', this.$initPath);

    // в массивах (корневой и d-свойства (дети)) - свойство __list: список предков, начиная от самого себя
    $stack = [this.$_tree];
    this.$_tree.__list = [this.$_tree];
    while ($stack.length){
        $0 = $stack.shift();
        for ($1 = 0 ; $1 < $0.length ; ++$1){
            for ($2 in $0[$1]){
                //console.log('+', $0[$1][$2]);//----
                if ($0[$1][$2].$d){
                    $3 = $0[$1][$2].$d;
                    $3.__list = $0.__list.slice();
                    $3.__list.unshift($3);
                    $stack.unshift($3);
                }
                else{
                    $0[$1][$2].__list = $0.__list;
                }
            }
        }
    }
    console.log('TREE: ', this.$_tree);//----
    /*$stack = [this.$_tree];
    $tmp = [this.$_tree];
    // наполняем $tmp
    var counter = 0;//
    while ($stack.length){
        console.log('tick ', counter++);//
        if (counter > 200){
            console.error('FATAL');
            return;
        }
        $0 = $stack.shift();
        for ($1 = 0 ; $1 < $0.length ; ++$1){
            for ($2 in $0[$1]){
                if ($0[$1][$2].$d){
                    $3 = $0[$1][$2].$d;
                    $tmp.push($3);
                    $stack.unshift($3);
                    //$stack.push($3);//
                }
            }
        }
    }
    console.log('TMP: ', $tmp.slice());//----
    // второй проход по стеку тем же маршрутом с постепенно тающим содержимым $tmp
    while ($tmp.length){
        //$1 = $tmp.slice();
        $2 = $tmp.shift();
        $1 = $tmp.slice();//
        $2.__list = $1;
    }
    console.log('TREE: ', this.$_tree);//----
    //return;//
    */


    console.log('StateToUrlMapper: debugMode ' + (this.$_debugMode ? 'enabled' : 'disabled'));
};
