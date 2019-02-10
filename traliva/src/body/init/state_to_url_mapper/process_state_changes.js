$StateToUrlMapper.prototype.$processStateChanges = function(s){
    console.group('processStateChanges');
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
    // обойти дерево и составить url. Если совпадает, то ничего не делаем. Если не совпадает - просто заменяем текущий URL.
    var $0, $1, $2, $3, $4, $5;
    var $cand = this.$initPath;
    if ($Traliva.$debug && $Traliva.$debug.$url)
        $cand += '/';
    console.log('init path: ', $cand);
    var $stack = this.$_tree.slice();
    //console.log('**', this.$_tree);//
    while ($stack.length){
        $0 = $stack.shift();
        console.log('----', $0);
        $for_2: for ($2 in $0){
            $1 = $0[$2];
            //console.log('debugName: ', $1.$debugName);//
            console.log('state tree item name: ', $2);//
            $3 = this.$getSubstate($1.$substate);
            //console.log('$3 = ' + $3);
            if ($1.hasOwnProperty('$name'))
                $3 = $3 === $1.$name;
            if ($3 && $1.$params){
                $3 = '';
                console.log('params: ', $1.$params);//
                for ($4 = 0 ; $4 < $1.$params.length ; ++$4){
                    $5 = this.$getSubstate($1.$params[$4]);
                    if ($5 === undefined){
                        console.log('ERROR: подсостояние параметра не доступно: ' + $1.$params[$4]);
                        break $for_2;
                    }
                    $3 += $5.toString() + '/';
                }
            }
            if ($3){
                $cand += $2 + '/';
                if ($1.$params){
                    $cand += $3;
                }
                if ($1.$d){
                    for ($4 = $1.$d.length - 1 ; $4 >= 0 ; --$4){
                        $stack.unshift($1.$d[$4]);
                    }
                }
                break $for_2;
            }
        }
    }
    //console.log('test URL: ', $cand);
    $0 = $Traliva.$history.$_current();
    //console.log('current URL:', $Traliva.$history.$_current());
    if ($cand !== $0){
        this.$urlUpdating = true;
        $Traliva.$history.replaceState({}, '', $cand);
        this.$urlUpdating = false;
    }
    console.groupEnd();
};
