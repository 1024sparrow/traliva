
/*****
$set:
один параметр (массив) - полная замена массива
два параметра (индекс, значение) - замена отдельного элемента массива. Предполагается, что элемент изменился, и мы должны применить эти изменения.
*****/
Array.prototype.set = function($0, $1){
    if ($0 instanceof Array){
        Array.prototype.splice.apply(this, [0, this.length].concat($0));
    }
    else{
        this[$0] = $1;
    }
    return this;
};
var $WidgetStateSubscriber__makeArrayReportable = function($p_reportTaker, $p_arr, $p_id){
    if ($p_arr === undefined){
        // boris here
    }
    else{
        $p_arr.set = function($p_0, $p_1){
            var $tmp, $cand, $w, $0, $1, $2;
            if ($p_0 instanceof Array){
                // boris here
                // убираем старых детей
                for ($1 = $p_0.length ; $1 < $p_reportTaker.$__WidgetStateSubscriber.$childrenWidgets[$p_id].length ; ++$1){
                    console.log('-- removing child WSS --');
                    $tmp = $p_reportTaker.$__WidgetStateSubscriber.$childrenWidgets[$1];
                    $tmp.$destroy();
                    $Traliva.$__d.$publisher.$unregisterSubscriber($tmp);
                }
                $2 = $p_reportTaker.$__WidgetStateSubscriber.$childrenWidgets[$p_id].length - $p_0.length;
                if ($2 > 0)
                    $p_reportTaker.$__WidgetStateSubscriber.$childrenWidgets[$1].splice($p_0.length, $2);
                // добавляем новых детей
                for ($1 = $p_reportTaker.$__WidgetStateSubscriber.$childrenWidgets[$p_id].length ; $1 <= $p_0.length ; ++$1){
                    console.log('-- adding child WSS --');
                    $tmp = $p_reportTaker.$__WidgetStateSubscriber.$descr.$children[$p_id];
                    $w = new $Widget($p_reportTaker.$__WidgetStateSubscriber.$wContainer, undefined);// кстати, про второй параметр p_attr ...
                    $cand = new $tmp.$constructor($w, $tmp.$options, $tmp);
                    $cand.$useSubstate(($tmp.$substate || '') + '/' + ($1 - 1));
                    $p_reportTaker.$__WidgetStateSubscriber.$childrenWidgets[$p_id].push($cand);
                    $Traliva.$__d.$publisher.$registerSubscriber($cand);
                }
                $p_reportTaker.$__WidgetStateSubscriber.$childrenChanged[$p_id] = 1;
            }
            else{
                // boris here
            }
        };
        $p_arr.push = function($0){
            //boris here
        };
        $p_arr.pop = function($0){
            //boris here
        };
        $p_arr.shift = function($0){
            //boris here
        };
        $p_arr.unshift = function($0){
            //boris here
        };
        $p_arr.splice = function($p_0, $p_1){
            //boris here
        };
    }
};
