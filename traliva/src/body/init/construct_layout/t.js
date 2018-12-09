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
        {%% object.js %%}
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
