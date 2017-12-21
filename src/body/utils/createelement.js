Traliva.createElement = function(p_html, p_variables, p_classname){
    var retVal = document.createElement('div');
    if (p_classname)
        retVal.className = p_classname;
    retVal.innerHTML = p_html;

    var i, parent, list, stack;
    if (p_variables){
        stack = [retVal];
        while (stack.length){
            parent = stack.pop();
            list = parent.attributes;
            for (i = 0 ; i < list.length ; i++){
                if (list[i].name === 'traliva'){
                    p_variables[list[i].value] = parent;
                    break;
                }
            }
            list = parent.children;
            for (i = 0 ; i < list.length ; i++){
                stack.push(list[i]);
            }
        }
    }
    return retVal;
}
