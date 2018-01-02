function Button(p_wContainer, p_options){// options: title, color('#f00'), valueVarName - имя свойства, в которое сохранять значение
    StateSubscriber.call(this);
    var e = Traliva.createElement(p_options.title);
    p_wContainer._onResized = function(w,h){
        e.style.width = (w - 12) + 'px';
        e.style.height = (h - 12) + 'px';
    };
    //e.style.margin = '6px';
    e.style.margin = 0;
    e.style.border = '1px solid ' + p_options.color;
    e.style.borderRadius = '5px';
    e.style.color = p_options.color;
    e.style.textAlign = 'center';
    //e.style.cursor = 'pointer';
    e.addEventListener('click', function(self, opt){return function(){
        self._state[opt.valueVarName] = !self._state[opt.valueVarName];
        self._registerStateChanges();
    };}(this, p_options));
    p_wContainer.setContent(e);
    p_wContainer._div.style.margin = '6px 2px';
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
    var leUrl = Traliva.createElement('<input type="text" value="1234" traliva="le"></input>', scope, '__debug_panel_url');
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
        publisher: new StatePublisher()
    };
    this.DebugStatesWidget.publisher.registerSubscriber(new DebugStatesExtenderWidget(p_wExtender));
    this.DebugStatesWidget.publisher.registerSubscriber(new DebugStatesStatesWidget(p_wStates));
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
    var wRight = new Strip(Traliva.Strip__Orient__vert, wStrip);
    var wBnApply = new Widget(wRight);
    wBnApply._div.className = 'traliva__debug_panel__apply_state_button';
    wBnApply.setContent(Traliva.createElement('Применить'));
    wBnApply.addEventListener('click', (function(self){return function(){
        self._state = JSON.parse(self.eState.value);
        self._registerStateChanges();
    }})(this));
    wRight.addItem(wBnApply, '16px');
    wRight.addItem(new Widget(wRight));
    wStrip.addItem(wLeft);
    wStrip.addItem(wRight, '128px');
    p_wContainer.setContent(wStrip);
}
DebugStatesStatesWidget.prototype = Object.create(StateSubscriber.prototype);
DebugStatesStatesWidget.prototype.constructor = DebugStatesStatesWidget;
DebugStatesStatesWidget.prototype.processStateChanges = function(s){
    this.eState.value = JSON.stringify(s, undefined, 2);
}

function DebugStatesExtenderWidget(p_wContainer){
    StateSubscriber.call(this);
    p_wContainer._div.className = 'traliva__debug_panel__states_extender';
}
DebugStatesExtenderWidget.prototype = Object.create(StateSubscriber.prototype);
DebugStatesExtenderWidget.prototype.constructor = DebugStatesExtenderWidget;
DebugStatesExtenderWidget.prototype.processStateChanges = function(s){
}
