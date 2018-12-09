
/*
формируем $retVal (виджет)
$p_widgetScope[$p_oLayout] - виджет-подписчик
*/

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
            //boris here
            $childrenFields = $p_oLayout.$type.$widgetsFields;
            $children = 

            $tmp = $0.$options;
            if ($tmp && $tmp.hasOwnProperty('$bg') && ($tmp.$bg.length === 0))
                $tmp.$bg = $p_defaultBackground;
            $cand = new $0.$constructor($retVal, $tmp);
            if ($0.hasOwnProperty('$substate'))
                $cand = $cand.$useSubstate($0.$substate);
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
