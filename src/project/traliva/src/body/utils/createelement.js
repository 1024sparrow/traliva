$Traliva.$createElement = function($p_html, $p_variables, $p_classname){
    var $retVal = document.createElement('div');
    if ($p_classname)
        $retVal.className = $p_classname;
    $retVal.innerHTML = $p_html;

    var $0, $parent, $list, $stack;
    if ($p_variables){
        $stack = [$retVal];
        while ($stack.length){
            $parent = $stack.pop();
            $list = $parent.attributes;
            for ($0 = 0 ; $0 < $list.length ; $0++){
                if ($list[$0].name === 'traliva'){
                    $p_variables[$list[$0].value] = $parent;
                    break;
                }
            }
            $list = $parent.children;
            for ($0 = 0 ; $0 < $list.length ; $0++){
                $stack.push($list[$0]);
            }
        }
    }
    return $retVal;
}
