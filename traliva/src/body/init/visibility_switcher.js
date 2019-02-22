function $VisibilitySwitcher(){
    $Traliva.$StateSubscriber.call(this);
    this.$_currentMap = {};// а надо ли как-то дестроить после смены лейаута?
};
$VisibilitySwitcher.prototype = Object.create($StateSubscriber.prototype);
$VisibilitySwitcher.prototype.constructor = $StateToUrlMapper;
$VisibilitySwitcher.prototype.$processStateChanges = function(s){
    // visibility map - at $Traliva.$__d.$visibilityMap
    var $0 = $Traliva.$__d.$visibilityMap;
    if (!$0)
        return;
    this.$_update();
};
$VisibilitySwitcher.prototype.$_update = function(){
    console.log('^^^^^^^^^^^^^^^^^^^^^');
    var $0 = $Traliva.$__d.$visibilityMap,
        $1, $2, $3, $4, $5
    ;
    console.log('^^ visibilityMap:', $0);//
    for ($1 in $0){
        // $1 - substate
        console.log('^^ substate: ', $1);//
        $2 = $0[$1];
        for ($2 in $0[$1]){
            // $2 - требуемое значение подсостояния
            $3 = $0[$1][$2]; // $3 - массив виджетов
            for ($4 = 0 ; $4 < $3.length ; ++$4){
                $5 = $StateToUrlMapper.prototype.$getSubstate.call(this, $1);
                console.log('*** curent substate value: ', $5);//
                $3[$4].$setVisible($2 === '_' ? $5 : $5 ===  $2);//
            }
        }
    }
};
