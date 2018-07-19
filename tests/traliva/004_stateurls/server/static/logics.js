'use strict';

function Logics(){
    Traliva.LogicsStateSubscriber.call(this);
    this.__Logics = {
        //tab: undefined
    };
}
Logics.prototype = Object.create(Traliva.LogicsStateSubscriber.prototype);
Logics.prototype.constructor = Logics;
Logics.prototype.initializeGui = function(){
    this._updateVisibility();
}
Logics.prototype.processStateChanges = function(s){
    if (!s){
        console.log('epic fail');
        return;
    }
    if (s.tab_1 && (this.__Logics.tab !== 0)){
        if (s.tab_2){
            s.tab_2 = false;
            this._registerStateChanges();
        }
        this.__Logics.tab = 0;
    }
    else if (s.tab_2 && (this.__Logics.tab !== 1)){
        if (s.tab_1){
            s.tab_1 = false;
            this._registerStateChanges();
        }
        this.__Logics.tab = 1;
    }
    this._updateVisibility();
}
Logics.prototype._updateVisibility = function(){
    if (Traliva.widgets.hasOwnProperty('tab2_content')){
        if (this._state.tab_2 !== Traliva.widgets.tab2_content.isVisible()){
            Traliva.widgets.tab2_content.setVisible(this._state.tab_2);
        }
    }
}
