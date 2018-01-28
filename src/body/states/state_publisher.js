/***** class StatePublisher **************************
 *
 * Не допускайте подписывания одного и того же подписчика более одного раза!
 *
 * PREVENT MORE THEN ONCE SUBSCRIBING THE SAME SUBSCRIBER!
 *****************************************************
 */
var StatePublisher = function(){
	this.__state = {};//empty state by default untill be set
	this.__subscribers = [];
    this.__recursionLevel = 0;// <-- количество вложенных вызовов processStateChanges.
    //                      фиксируем для того, чтобы остановить гонку состояний раньше,
    //                      чем это сделает браузер
};
StatePublisher.prototype.state = function(){
	return this.__state;
};
StatePublisher.prototype.setState = function(state){//parameter is an Object
	this.__state = state;
    if (!this._nodebug)
        console.log('set state: '+JSON.stringify(state));
	for (var i = 0 ; i < this.__subscribers.length ; i++){
		var subscr = this.__subscribers[i];
        subscr.__d.state = state;
        //console.log('%csetState: '+JSON.stringify(this.__state), 'color: #f00');//<--
        var s = subscr.__getSubstate(state);
		subscr._state = s;
        if (Traliva.debug && Traliva.debug.state)
            this.__debugState(subscr, s);
		subscr.processStateChanges(s, true);
        //console.log('%c> setState: '+JSON.stringify(this.__state), 'color: #f00');//<--
	}
};
StatePublisher.prototype.registerSubscriber = function(subscr){
    if (Traliva.debug && Traliva.debug.state)
        console.log('%cregister '+subscr.constructor.name, 'color:#ffa');
	subscr.__m_publisher = this;
    try{
        subscr.__d.state = this.__state;
    }
    catch(e){
        console.error('В конструкторе класса подписчика \'' + subscr.constructor.name + '\'вы забыли вызвать конструктор базового класса');
    }
    //console.log('%csetState: '+JSON.stringify(this.__state), 'color: #f00');//<--
    var s = subscr.__getSubstate(this.__state);
	subscr._state = s;
    if (Traliva.debug && Traliva.debug.state)
        this.__debugState(subscr, s);
	subscr.processStateChanges(s, true);
	this.__subscribers.push(subscr);
    //console.log('%c> setState: '+JSON.stringify(this.__state), 'color: #f00');//<--
};
StatePublisher.prototype.unregisterSubscriber = function(subscr){
    if (Traliva.debug && Traliva.debug.state)
        console.log('%cunregister '+subscr.constructor.name, 'color:#ffa');
	var index = this.__subscribers.indexOf(subscr);
	if (index > -1)
		this.__subscribers.splice(index, 1);
	else
		console.log("epic fail");
};
StatePublisher.prototype._processStateChanges = function(sender, p_fromProcessStateChanges){
	this.__state = sender.__d.state;
    if (p_fromProcessStateChanges){
        if (this.__recursionLevel > 128){
            throw 'Предотвращена гонка состояний.';
        }
        this.__recursionLevel++;
    }
    else {
        this.__recursionLevel = 0;
    }
	for (var i = 0 ; i < this.__subscribers.length ; i++){
		var subscr = this.__subscribers[i];
		if (subscr == sender)
			continue;
        subscr.__d.state = this.__state;
        //console.log('%csetState: '+JSON.stringify(this.__state), 'color: #f00');//<--
        var s = subscr.__getSubstate(this.__state);
		subscr._state = s;
        if (Traliva.debug && Traliva.debug.state)
            this.__debugState(subscr, s);
        //console.log('%c> setState: '+JSON.stringify(this.__state), 'color: #f00');//<--
		subscr.processStateChanges(s, false);
	}
    //if (Traliva.debug && Traliva.debug.state){
    //    console.log('--');
    //}
};
StatePublisher.prototype.__debugState = function(p_subscriber, p_state, p_action){
    if (this._nodebug)
        return;
    if (p_action)
        console.log('%c' + p_action + ' ' + p_subscriber.constructor.name + ': ' + JSON.stringify(p_state), 'color:#ffa');
    else{
        console.log('%cprocess ' + p_subscriber.constructor.name + ': ' + JSON.stringify(p_state), 'color:#ffa');
        Traliva.__d.__debug.debugStatesStatesWidget.processState(p_subscriber, this.__state);
    }
};
function StatePublisherNoDebug(){
    StatePublisher.call(this);
    this._nodebug = true;
}
StatePublisherNoDebug.prototype = Object.create(StatePublisher.prototype);
StatePublisherNoDebug.prototype.constructor = StatePublisherNoDebug;
