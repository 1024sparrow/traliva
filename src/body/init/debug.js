function Button(p_wContainer, p_options){// options: title, color('#f00'), valueVarName - имя свойства, в которое сохранять значение
    StateSubscriber.call(this);
    var e = Traliva.createElement('<div class="traliva__debug_panel__bn" traliva="bnStates">' + p_options.title + '</div>', this);
    /*p_wContainer._onResized = (function(e){function(w,h){
        e.style.width = w + 'px';
        e.style.height = h + 'px';
    };})(this.bnStates);*/
    //e.className = 'traliva__debug_panel__bn';
    //e.style.margin = '6px';
    this.bnStates.style.border = '1px solid ' + p_options.color;
    this.bnStates.style.color = p_options.color;
    this.bnStates.addEventListener('click', function(self, opt){return function(){
        self._state[opt.valueVarName] = !self._state[opt.valueVarName];
        self._registerStateChanges();
    };}(this, p_options));
    p_wContainer.setContent(e);
    //p_wContainer._div.style.margin = '6px 2px';
}
Button.prototype = Object.create(Traliva.StateSubscriber.prototype);
Button.prototype.constructor = Button;
Button.prototype.processStateChanges = function(s){
}

function DebugPanelUrlWidget(p_wContainer){
    StateSubscriber.call(this);
    //p_wContainer._div.style.background = '#f00';
    this._bnBack = new Widget(p_wContainer);
    this._bnBack._div.className = 'traliva__debug_panel__bn_back';
    this._bnForward = new Widget(p_wContainer);
    this._bnForward._div.className = 'traliva__debug_panel__bn_forward';
    this._leUrl = new Widget(p_wContainer);
    var scope = {};
    var leUrl = Traliva.createElement('<input type="text" value="1234" traliva="le"></input>', scope, '__debug_panel_url');//boris here
    this._leUrl._onResized = function(w, h){
        //leUrl.style.width = w + 'px';
        scope.le.style.width = (w - 12) + 'px';
        scope.le.style.height = (h - 12) + 'px';
        //scope.le.style.margin = '3px';
        scope.le.style.background = '#000';
        scope.le.style.color = '#afa';
        scope.le.style.border = '1px solid #afa';
        scope.le.style.borderRadius = '5px';
    };
    this._leUrl.setContent(leUrl);
    this._bnEnter = new Widget(p_wContainer);
    this._bnEnter._div.className = 'traliva__debug_panel__bn_enter';

    this._layout = new Strip(Traliva.Strip__Orient__hor, p_wContainer);
    this._layout.addItem(this._bnBack, '32px');
    this._layout.addItem(this._bnForward, '32px');
    this._layout.addItem(this._leUrl);
    this._layout.addItem(this._bnEnter, '32px');
    p_wContainer.setContent(this._layout);
}
DebugPanelUrlWidget.prototype = Object.create(StateSubscriber.prototype);
DebugPanelUrlWidget.prototype.constructor = DebugPanelUrlWidget;
DebugPanelUrlWidget.prototype.processStateChanges = function(s){
}

function DebugStatesWidget(p_wContainer, p_wExtender, p_wStates){
    StateSubscriber.call(this);
    this._wContainer = p_wContainer;
    this._wContainer.setVisible(false);
    this._enabled = false;
    p_wContainer._div.className = 'traliva__debug_panel__states';

    this.DebugStatesWidget = {
        publisher: new StatePublisherNoDebug()
    };
    this.DebugStatesWidget.publisher.registerSubscriber(new DebugStatesExtenderWidget(p_wExtender));
    var tmp = new DebugStatesStatesWidget(p_wStates);
    Traliva.__d.__debug.debugStatesStatesWidget = tmp;
    this.DebugStatesWidget.publisher.registerSubscriber(tmp);
}
DebugStatesWidget.prototype = Object.create(StateSubscriber.prototype);
DebugStatesWidget.prototype.constructor = DebugStatesWidget;
DebugStatesWidget.prototype.processStateChanges = function(s){
    if (s.show_states !== this._enabled){
        this._wContainer.setVisible(s.show_states);
        this._enabled = s.show_states;
    }
    this.DebugStatesWidget.publisher.setState(s);
}

function DebugStatesStatesWidget(p_wContainer){
    StateSubscriber.call(this);
    p_wContainer._div.className = 'traliva__debug_panel__states_states';
    var wStrip = new Strip(Traliva.Strip__Orient__hor, p_wContainer);
    var wLeft = new Widget(p_wContainer);
    this.eState = document.createElement('textarea');
    this.eState.resize = 'none';
    this.eState.style.background = '#000';
    this.eState.style.border = 'none';
    this.eState.style.color = '#48f';
    wLeft.setContent(this.eState);
    wLeft._onResized = (function(e){return function(w,h){
        e.style.width = w + 'px';
        e.style.height = h + 'px';
    };})(this.eState);
    var wRight = new Strip(Traliva.Strip__Orient__vert, wStrip);
    var wBnApply = new Widget(wRight);
    //wBnApply._div.className = 'traliva__debug_panel__apply_state_button';
    wBnApply.setContent(Traliva.createElement('<div class="traliva__debug_panel__apply_state_button">Применить</div>'));
    wBnApply._div.addEventListener('click', (function(self){return function(){
        var s;
        try{
            s = JSON.parse(self.eState.value);
            self.lastValidState = s;
        }
        catch(e){
            alert('Ошибка: '+e);
            if (confirm('Откатить изменения?'))
                self.eState.value = JSON.stringify(self.lastValidState, undefined, 2);
        }
        if (s)
            Traliva.__d.publisher.setState(s);
    }})(this));
    wRight.addItem(wBnApply, '48px');
    wRight.addItem(new Widget(wRight));
    wStrip.addItem(wLeft);
    wStrip.addItem(wRight, '128px');
    p_wContainer.setContent(wStrip);
}
DebugStatesStatesWidget.prototype = Object.create(StateSubscriber.prototype);
DebugStatesStatesWidget.prototype.constructor = DebugStatesStatesWidget;
DebugStatesStatesWidget.prototype.processStateChanges = function(s){
    //this.eState.value = JSON.stringify(s, undefined, 2);
}
DebugStatesStatesWidget.prototype.processState = function(p_subscriber, p_state){
    this.lastValidState = p_state;
    this.eState.value = JSON.stringify(p_state, undefined, 2);
}

function DebugStatesExtenderWidget(p_wContainer){
    StateSubscriber.call(this);
    p_wContainer._div.className = 'traliva__debug_panel__states_extender';
}
DebugStatesExtenderWidget.prototype = Object.create(StateSubscriber.prototype);
DebugStatesExtenderWidget.prototype.constructor = DebugStatesExtenderWidget;
DebugStatesExtenderWidget.prototype.processStateChanges = function(s){
}
