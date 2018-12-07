//'---------------init/construct_layout.js---------------';
// $p_widgets - конструкторы виджетов
// $p_widgetScope - здесь мы сохраняем наши виджеты
// в случае аварийного выхода (некорректные параметры) мы заботимся о корректном освобождении памяти и о снятии ненужных подписчиков
function $construct_layout($p_wParent, $p_oLayout, $p_defaultBackground, $p_widgets, $p_widgetScope, $p_innerCall){
    #USAGE_BEGIN#debug##
    console.log('$construct_layout: ' + JSON.stringify($p_oLayout));
    #USAGE_END#debug##

    var $0, $cand, $w, $type = typeof $p_oLayout, $tmp,
        $1, $2,
        $retVal,
        $used = $p_innerCall || {}// множество использованных в новом лэйауте id-шников
    ;
    if (!$p_oLayout){
        // (пружинка)
    }
    if ($type === 'string'){
        /*if ($p_widgetScope.hasOwnProperty($p_oLayout)){
            console.log('error: идентификаторы пользовательских виджетов должны иметь уникальные значения');
            return;// возможно, это зря. Особо не думал.
        }*/
        #USAGE_BEGIN#debug##
        if ($p_oLayout.hasOwnProperty('$id')){
            if ($Traliva.$widgets.hasOwnProperty($p_oLayout.$id))
                console.error('Обнаружено дублирование идентификаторов виджетов. Идентификатор конфликта - ' + $p_oLayout.$id);
        }
        #USAGE_END#debug##
        if ($p_widgetScope.hasOwnProperty($p_oLayout))
            $retVal = $p_widgetScope[$p_oLayout].$__WidgetStateSubscriber.$wContainer;
        else{
            $retVal = new $Widget($p_wParent);
            if ($p_widgets.hasOwnProperty($p_oLayout)){
                // вызываем конструктор..
                $0 = $p_widgets[$p_oLayout];
                if (typeof $0 === 'function')
                    $cand = new $0($retVal);
                else{
                    $tmp = $0.$options;
                    if ($tmp && $tmp.hasOwnProperty('$bg') && ($tmp.$bg.length === 0))
                        $tmp.$bg = $p_defaultBackground;
                    $cand = new $0.$constructor($retVal, $tmp);
                    if ($0.hasOwnProperty('$substate'))
                        $cand = $cand.$useSubstate($0.$substate);
                    //$cand = new $0[0]($retVal).$substate($0[1]);// согласно спецификации, если не конструктор, то массив из конструктора и (чего-то, описывающего подсостояние)
                }
            }
            else{
                // создаём виджет-заглушку
                //console.log('создаётся виджет-заглушка для элемента лейаута с $id = \''+$p_oLayout+'\'');
                $cand = new $StubWidget($retVal, $p_oLayout);
            }
            //$retVal.setContent($cand);$cand - не виджет, а его представитель из мира Подписчиков
            $Traliva.$__d.$widgets[$p_oLayout] = $retVal;
            $p_widgetScope[$p_oLayout] = $cand;
            $Traliva.$__d.$publisher.$registerSubscriber($cand);
        }
        $used[$p_oLayout] = 1;
    }
    else if ($type === 'object'){ // пользовательский контейнер
        #USAGE_BEGIN#debug##
        if (!$p_oLayout.hasOwnProperty('$type'))
            console.error('error: incorrect layout description: \'type\' should be');
        #USAGE_END#debug##
        $type = $p_oLayout.$type;
        if (typeof $type === 'function'){
        }
        else if (typeof $type === 'string'){
            #USAGE_BEGIN#debug##
            if (!$p_widgets[$type])
                console.log('error: не найден описатель виджета \'' + $type + '\'');
            #USAGE_END#debug##
            $type = $p_widgets[$type].$constructor;
        }
        #USAGE_BEGIN#debug##
        else{
            console.log('oops..');
            return;
        }
        if (!$type){
            console.log('error');
            return;
        }
        #USAGE_END#debug##
        $retVal = new $Widget($p_wParent);
        var $childrenFields = $type.$widgetsFields;
        var $children = {};
        var $options = {};
        var $3;
        for ($1 in $p_oLayout){
            if ($childrenFields.indexOf($1) < 0)
                $options[$1] = $p_oLayout[$1];
            else{
                $0 = $p_oLayout[$1];
                #USAGE_BEGIN#debug##
                if (!($0 instanceof Array)){
                    console.log('error');
                    return;
                }
                $children[$1] = [];
                #USAGE_END#debug##
                for ($2 = 0 ; $2 < $0.length ; ++$2){
                    $3 = $0[$2];
                    if (typeof $3 === 'string')
                        $3 = {$_widget: $3};
                    else{
                        #USAGE_BEGIN#debug##
                        if (!$3.$_widget){
                            console.log('error');
                            return;
                        }
                        #USAGE_END#debug##
                    }
                    $3 = $construct_layout($retVal, $3.$_widget, $p_oLayout.$bg || $p_defaultBackground, $p_widgets, $p_widgetScope, $p_innerCall || $used);
                    $children[$1].push($3);
                }
            }
        }
        $cand = new $type($retVal, $options, $children);


        /*$tmp = $type.$options;
        if ($tmp && $tmp.hasOwnProperty('$bg') && ($tmp.$bg.length === 0))
            $tmp.$bg = $p_defaultBackground;
        $cand = new $type.$constructor($retVal, $tmp);
        $0 = $type.$widgetsFields || [];*/

        /*else if (typeof $type === 'function'){
            $0 = $type.$widgetsFields || [];
            $cand = [];
            for ($1 = 0 ; $1 < $0.length ; ++$1){
                $2 = $0[$1];
                if ($p_oLayout[$2]){
                    $w = $construct_layout();
                    $cand.push($p_oLayout[$2]); // должны вставить конструкцию виджета по лейауту
                }
                else{
                    //
                }
            }
        }*/

        /*if ($type === '$strip'){
            #USAGE_BEGIN#debug##
            if (!$p_oLayout.hasOwnProperty('$orient'))
                console.error('error: layout must have property \'$orient\'');
            #USAGE_END#debug##
            var $orient;
            if ($p_oLayout.$orient === 'h')
                $orient = $Traliva.$Strip__Orient__hor;
            else if ($p_oLayout.$orient === 'v')
                $orient = $Traliva.$Strip__Orient__vert;
            #USAGE_BEGIN#debug##
            else
                console.error('error: incorrect value of a strip orientation. Possible values: \'h\',\'v\'.');
            #USAGE_END#debug##
            $retVal = new $Strip($orient, $p_wParent, $p_oLayout.$scroll);
            if ($p_oLayout.hasOwnProperty('$items')){
                for ($0 = 0 ; $0 < $p_oLayout.$items.length ; $0++){
                    //console.log('item '+$0);
                    $cand = $p_oLayout.$items[$0];
                    if (typeof $cand === 'string'){
                        $cand = {$widget: $cand};
                    }
                    if ($cand.$widget){
                        $w = $construct_layout($retVal, $cand.$widget, $p_oLayout.$bg || $p_defaultBackground, $p_widgets, $p_widgetScope, $p_innerCall || $used);
                    }
                    else{
                        $w = new $Widget($retVal);
                    }
                    #USAGE_BEGIN#debug##
                    if (!$w)
                        console.error('oops');// error ocurred in internal self calling
                    console.log('widget added to layout');
                    #USAGE_END#debug##
                    $retVal.$addItem($w, $cand.$size);
                }
            }
        }
        else if ($type === '$stack'){
            $retVal = new $Stack($p_wParent, $p_oLayout.$scroll);
            for ($0 = 0 ; $0 < $p_oLayout.$items.length ; $0++){
                $cand = $p_oLayout.$items[$0];
                if (typeof $cand === 'string' || $cand.hasOwnProperty('$type'))
                    $cand = {$widget: $cand};
                $w = $construct_layout($retVal, $cand.$widget, $p_oLayout.$bg || $p_defaultBackground, $p_widgets, $p_widgetScope, $p_innerCall || $used);
                #USAGE_BEGIN#debug##
                if (!$w)
                    console.error('oops'); // error ocurred in internal self calling
                #USAGE_END#debug##
                $retVal.$addItem($w);
            }
        }
        #USAGE_BEGIN#debug##
        else{
            console.error('error: incorrect type of a layout item');
        }
        #USAGE_END#debug##
        */
    }
    if ($p_oLayout.hasOwnProperty('$bg')){
        $cand = ($p_oLayout.$bg.length) ? $p_oLayout.$bg : $p_defaultBackground;
        if ($cand)
            $retVal.$_div.style.background = $cand;
    }

    if (!$p_innerCall){
        // уничтожаем те виджеты, $id которых не попали в $used
        for ($0 in $p_widgetScope){
            if (!$used.hasOwnProperty($0)){
                $Traliva.$__d.$publisher.$unregisterSubscriber($p_widgetScope[$0]);
                $w = $p_widgetScope[$0].$destroy(); // $w - DOM-элемент...
                delete $p_widgetScope[$0];
            }
        }
    }
    if ($p_oLayout.hasOwnProperty('$id')){
        $Traliva.$widgets[$p_oLayout.$id] = $retVal;
    }
    return $retVal; // возврат из функции должен быть здесь
};
//'---------------init/construct_layout.js---------------';
