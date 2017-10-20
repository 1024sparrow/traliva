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
};
StatePublisher.prototype.state = function(){
	return this.__state;
};
StatePublisher.prototype.setState = function(state){//parameter is an Object
	this.__state = state;
	for (var i = 0 ; i < this.__subscribers.length ; i++){
		var subscr = this.__subscribers[i];
		subscr._state = state;
		subscr.processStateChanges(state, true);
	}
};
StatePublisher.prototype.registerSubscriber = function(subscr){
	subscr.__m_publisher = this;
	subscr._state = this.__state;
	subscr.processStateChanges(this.__state, true);
	this.__subscribers.push(subscr);
};
StatePublisher.prototype.unregisterSubscriber = function(subscr){
	var index = this.__subscribers.indexOf(subscr);
	if (index > -1)
		this.__subscribers.splice(index, 1);
	else
		console.log("epic fail");
};
StatePublisher.prototype.processStateChanges = function(sender){
	this.__state = sender._state;
	for (var i = 0 ; i < this.__subscribers.length ; i++){
		var subscr = this.__subscribers[i];
		if (subscr == sender)
			continue;
		subscr._state = this.__state;
		subscr.processStateChanges(this.__state, false);
	}
};
