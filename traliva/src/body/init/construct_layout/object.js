
/*
формируем $retVal (виджет)
$p_widgetScope[$p_oLayout] - виджет-подписчик
*/
#USAGE_BEGIN#debug##
//if (!$p_oLayout.hasOwnProperty('$type'))
if (typeof $p_oLayout.$type !== 'function'){
    console.error('error: incorrect layout description: \'type\' should be and should be as function');
}
#USAGE_END#debug##
$retVal = new $Widget($p_wParent);
$childrenFields = $p_oLayout.$type.$widgetsFields;
$children = {};
$options = {};

if ($p_oLayout.hasOwnProperty('$_visibleSubstate')){
    console.log('*** *** *** ***');//
    if (!$Traliva.$__d.$visibilityMap.hasOwnProperty($p_oLayout.$_visibleSubstate))
        $Traliva.$__d.$visibilityMap[$p_oLayout.$_visibleSubstate] = {};
    $1 = $Traliva.$__d.$visibilityMap[$p_oLayout.$_visibleSubstate];
    $0 = $p_oLayout.$_visibleValue || '_';
    if (!$1.hasOwnProperty($0))
        $1[$0] = [];
    $1 = $1[$0];
    $1.push($retVal);
}
else
    console.log('*** ***', $p_oLayout);//

for ($1 in $p_oLayout){
    if ($1 === '$_visibleSubstate' || $1 === '$_visibleValue')
        continue;
    if (($childrenFields === undefined) || ($childrenFields.indexOf($1) < 0))
        $options[$1] = $p_oLayout[$1];
    else{
        $0 = $p_oLayout[$1];
        #USAGE_BEGIN#debug##
        if (!($0 instanceof Array)){
            console.log('error');
            return;
        }
        #USAGE_END#debug##
        $children[$1] = [];
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
            $3.$_widget = $construct_layout($retVal, $3.$_widget, $p_oLayout.$bg || $p_defaultBackground, $p_widgets, $p_widgetScope, $used);
            $children[$1].push($3);
        }
    }
}
$options.$_children = $children;
$cand = new $p_oLayout.$type($retVal, $options);
if ($p_oLayout.$_substate){
    $cand.$useSubstate($p_oLayout.$_substate);
    $p_widgetScope._.push($cand);
    $Traliva.$__d.$publisher.$registerSubscriber($cand);
}


//$p_widgetScope[$p_oLayout.$id] = $cand;


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
