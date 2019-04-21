//'---------------init/construct_layout.js---------------';
// $p_widgets - конструкторы виджетов
// $p_widgetScope - здесь мы сохраняем наши виджеты
// в случае аварийного выхода (некорректные параметры) мы заботимся о корректном освобождении памяти и о снятии ненужных подписчиков
function $construct_layout($p_wParent, $p_oLayout, $p_defaultBackground, $p_widgets, $p_widgetScope, $p_innerCall){
    #USAGE_BEGIN#debug##
    //console.log('$construct_layout: ' + JSON.stringify($p_oLayout));
    #USAGE_END#debug##

    var $0, $cand, $w, $type = typeof $p_oLayout, $tmp,
        $options, $children, $childrenFields,
        $1, $2, $3, $4, $5,
        $retVal,
        $used = $p_innerCall || {}// множество использованных в новом лэйауте id-шников
    ;
    if (!$p_innerCall){
        if (!$p_widgetScope._)
            $p_widgetScope._ = [];
        for ($1 = 0 ; $1 < $p_widgetScope._.length ; ++$1){
            $0 = $p_widgetScope._[$1];
            $Traliva.$__d.$publisher.$unregisterSubscriber($0);
            $0.$destroy();
        }
        $p_widgetScope._ = [];
        $Traliva.$__d.$visibilityMap = {}; // связь виджетов с подсостояниями, в которых описывается их видимость (для тех виджетов, у которых видимость устанавливается в лейауте)
    }
    if (!$p_oLayout){
        // (пружинка)
    }
    if ($type === 'string'){
        {%% string.js %%}
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
            if ($0 === '_') // здесь у нас массив виджетов-контейнеров. Они всегда уничтожаются при смене лейаута.
                continue;
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
$Traliva.$_constructLayout = $construct_layout;
//'---------------init/construct_layout.js---------------';
