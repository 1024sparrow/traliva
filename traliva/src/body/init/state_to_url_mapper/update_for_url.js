$StateToUrlMapper.prototype.$updateForUrl = function($p_url, $p_ifInit){
    if (this.$urlUpdating)
        return;
    console.group('update for URL:', $p_url);
    //console.log('--', $p_url, '-- initPath:', this.$initPath);
    //this.$_tree, this.$initPath, this.$initPathLength
    var $0, $1, $2, $3, $4, $5, $roots,
        $tmp, $cand,
        $ar = [], $stateChanged = false,
        $eTree
    ;
    $0 = $p_url.slice(this.$initPathLength); // boris here
    if ($0[$0.length - 1] !== '/')
        $0 += '/';
    console.log('##', $0, this.$initPathLength);//
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
    console.log('PRELIMINAR ARS:\n', JSON.stringify($ars));
    var $iArs, $oAr;
    var $used;
    var $appliedAr;//та часть ar, что была обработана и является корректной. Используется в случае некорректного URL для генерации корректного URL.
    $for_iArs: for ($iArs = 0 ; $iArs < 2 ; ++$iArs){
        $oAr = $ars[$iArs];
        $tmp = this.$_tree;
        $appliedAr = [];
        $for_1: for ($1 = 0 ; $1 < $oAr.length ; ++$1){
            console.log('-- 1 --', $oAr[$1]);
            //console.log('$tmp:', JSON.stringify($tmp));
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
                                //console.log('&*%*&%*&%&*^%&*^%', $tmp.__list[$2][$3]);//
                                if ($tmp.__list[$2][$3][$4].$params){
                                    console.log('parameters detected');
                                    if ($tmp.__list[$2][$3][$4].$params.length >= ($oAr.length - $1)){
                                        // отображаем текущий узел - не указано необходимых параметров
                                        console.log('error: не указано необходимое количество параметров');
                                        break $for_2;
                                    }
                                    else{
                                        for ($5 = 0 ; $5 <= $tmp.__list[$2][$3][$4].$params.length ; ++$5){
                                            $appliedAr.push($oAr[$1 + $5]);
                                        }
                                        $5 = $tmp.__list[$2][$3][$4].$params.length;
                                        $cand.$params = $oAr.slice($1 + 1, $1 + 1 + $5);
                                        $tmp.__list[$2][$3][$4].$paramValues = $oAr.slice($1 + 1, 1 + $tmp.__list[$2][$3][$4].$params.length);
                                        $1 += $5;
                                        //console.log('===', JSON.stringify($appliedAr), $oAr);//
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
                                $tmp = $tmp.__list[$2][$3][$4];
                                if ($tmp.$d)
                                    $tmp = $tmp.$d;
                                continue $for_1;
                            }
                        } // for $4
                    } // for $3
                } // for $2
            }
            if (!$used){
                //console.log($iArs, '=================');
                console.log('ERROR!!', $appliedAr); // Если индекс нулевой, то это EPIC FAIL.
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
                $ar = $appliedAr;
                break $for_iArs;
            }
        } // for $1
        $fCleanUsed($roots[$iArs]);
    } // for $iArs
    //console.log('roots: ', JSON.stringify($roots, undefined, 2));

    //console.log('==============================');
    if (!this.$_fContains){
        this.$_fContains = function($pArray, $pTarget){
            var $1, $2;
            if ($pTarget){
                for ($1 = 0 ; $1 < $pArray.length ; ++$1){
                    $2 = $pArray[$1];
                    if ($2.$eTree === $pTarget.$eTree && $2.$url === $pTarget.$url)
                        return true;//return $pTarget.$eTree[$pTarget.$url];
                }
            }
            return false;
        };
        this.$_fGetTreeObject = function($pArItem){
            var i$0, $1;
            for ($1 = 0 ; $1 < $pArItem.$eTree.length ; ++$1){
                $0 = $pArItem.$eTree[$1][$pArItem.$url];
                if ($0)
                    return $0;
            }
        };
    }

    for ($1 = 0 ; $1 < $roots[0].length ; ++$1){
        $3 = $roots[0][$1];
        $2 = this.$_fContains($roots[1], $3);
        $3 = this.$_fGetTreeObject($3);
        if (!$2){
            // есть в prevAr, но нет в ar - деструкция
            //console.log('деструкция: ', JSON.stringify($3, undefined, 2));
            this.$setSubstate($3.$substate);
            $stateChanged = true;
            if ($3.$extender){
                //boris here 2
            }
        }
    }
    if ($stateChanged)
        this.$_registerStateChanges();
    $stateChanged = false;
    for ($1 = 0 ; $1 < $roots[1].length ; ++$1){
        $3 = $roots[1][$1];
        $2 = this.$_fContains($roots[0], $3);
        $3 = this.$_fGetTreeObject($3);
        if ($2){
            // есть и в ar, и в prevAr - обновляем параметры
            //console.log('обновляем параметры: ', JSON.stringify($3, undefined, 2));
            if ($3.$params){
                for ($4 = 0 ; $4 < $3.$params.length ; ++$4){
                    console.log($3.$params[$4] + ' -- ' + $3.$paramValues[$4]);
                    this.$setSubstate($3.$params[$4], $3.$paramValues[$4]);
                }
            }
        }
        else{
            // есть в ar, но нет в prevAr - конструкция
            //console.log('конструкция: ', JSON.stringify($3, undefined, 2));
            this.$setSubstate($3.$substate, $3.$name || true);
            if ($3.$extender){
                //this.$_ajax.$request($p_url, $p_paramObject, $p_okFunc, $p_errorFunc, $p_ignoreOkFunc, $p_ignoreErrorFunc); // boris here 1
                /*(function(){
                    this.$_ajax.$request(
                        $3.$extender.$url,
                        {},
                        function(){},
                        function(){},
                        function(){},
                        function(){}
                    ); // boris here 1
                })(this);*/
            }
        }
        $stateChanged = true;
    }
    this.$prevAr = $ar;

    if ($stateChanged)
        this.$_registerStateChanges();
    console.groupEnd();
};
