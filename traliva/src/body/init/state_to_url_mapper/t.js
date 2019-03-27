{%% constructor.js %%}
$StateToUrlMapper.prototype = Object.create($StateSubscriber.prototype);
$StateToUrlMapper.prototype.constructor = $StateToUrlMapper;
/*
URL changed --> state --> URL corrected
state changed --> url
*/
{%% process_state_changes.js %%}
{%% update_for_url.js %%}

// в соответствии с текущим URL устанавливаем нужные значения в state
/*$StateToUrlMapper.prototype.$updateState = function(){
    console.log('---');
    var url = window.location.href.slice(this.$initPathLength);
    console.log('#############', this.$initPathLength, this.$initPath, url);
    var urlArr = [];
    var i;
    while ((i = url.indexOf('/'), i) >= 0){
        console.log('::', i);
    }
    this.$_registerStateChanges();
}*/
$StateToUrlMapper.prototype.$setSubstate = function($p_substate, $p_value){ // подсостояние здесь может задаваться только в строковом виде
    console.log('setSubstate: ', $p_substate, $p_value);
    if ($p_substate.length === 0){
        console.log('ошибка. указано некорректное подсостояние');
        return;
    }
    var $0 = this.$_state,
        $1 = $p_substate.split('/'),
        $2;
    while ($1.length > 1){
        $2 = $1.shift();
        if ($0.hasOwnProperty($2)){
            $0 = $0[$2];
        }
        else{
            if ($p_value === undefined)
                return;
            else{
                $0[$2] = {};
                $0 = $0[$2];
            }
        }
    }
    $0[$1[0]] = $p_value;
};
$StateToUrlMapper.prototype.$getSubstate = function($p_substate){
    console.log('-- getSubstate --');//
    var $0 = $p_substate.split('/'), $1 = this.$_state, $2;
    for ($2 = 0 ; $2 < $0.length ; ++$2){
        if (!($1 = $1[$0[$2]]))
            return $1;
    }
    return $1;
};
