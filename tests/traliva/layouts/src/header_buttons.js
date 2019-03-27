'use strict';

function HeaderButtonCatalogue(p_wContainer){
    Traliva.WidgetStateSubscriber.call(this, p_wContainer);
}
HeaderButtonCatalogue.prototype = Object.create(Traliva.WidgetStateSubscriber.prototype);
HeaderButtonCatalogue.prototype.constructor = HeaderButtonCatalogue;
HeaderButtonCatalogue.processStateChanges = function(s){
}

function HeaderButtonSaved(p_wContainer){
    Traliva.WidgetStateSubscriber.call(this, p_wContainer);
}
HeaderButtonSaved.prototype = Object.create(Traliva.WidgetStateSubscriber.prototype);
HeaderButtonSaved.prototype.constructor = HeaderButtonSaved;
HeaderButtonSaved.processStateChanges = function(s){
}

function HeaderButtonAuth(p_wContainer){
    Traliva.WidgetStateSubscriber.call(this, p_wContainer);
}
HeaderButtonAuth.prototype = Object.create(Traliva.WidgetStateSubscriber.prototype);
HeaderButtonAuth.prototype.constructor = HeaderButtonAuth;
HeaderButtonAuth.processStateChanges = function(s){
}
