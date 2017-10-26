/***** class SubstateMapper **************************
 *
 *****************************************************
 */

function SubstateMapper(selector){
    this._selector = selector;
    this._selectorType = typeof selector;
}
SubstateMapper.prototype.getSubstate = function(state){
    var retVal;
    var t, t2;
    if (this._selectorType === 'function')
        retVal = this._selector(state);
    else if (this._selectorType === 'string'){
        retVal = state;
        t = this._selector.split('/');
        while (t.length){
            t2 = t.shift();
            if (!retVal.hasOwnProperty(t2))
                return undefined;
            retVal = retVal[t2];
        }
        return retVal;
    }
    else
        return undefined;
}
SubstateMapper.prototype.setSubstate = function(state, substate){
}
