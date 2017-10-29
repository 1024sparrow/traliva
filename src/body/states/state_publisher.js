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
        subscr.__d.state = state;
        var s = subscr.__getSubstate(state);
		subscr._state = s;
        //console.log('process '+subscr.constructor.name + JSON.stringify(s));
		subscr.processStateChanges(s, true);
	}
};
StatePublisher.prototype.registerSubscriber = function(subscr){
    //console.log('register '+subscr.constructor.name);
	subscr.__m_publisher = this;
    subscr.__d.state = this.__state;
    var s = subscr.__getSubstate(this.__state);
	subscr._state = s;
    //console.log('process '+subscr.constructor.name + JSON.stringify(s));
	subscr.processStateChanges(s, true);
	this.__subscribers.push(subscr);
};
StatePublisher.prototype.unregisterSubscriber = function(subscr){
	var index = this.__subscribers.indexOf(subscr);
	if (index > -1)
		this.__subscribers.splice(index, 1);
	else
		console.log("epic fail");
};
StatePublisher.prototype._processStateChanges = function(sender){
	this.__state = sender.__d.state;
	for (var i = 0 ; i < this.__subscribers.length ; i++){
		var subscr = this.__subscribers[i];
		if (subscr == sender)
			continue;
        subscr.__d.state = this.__state;
        var s = subscr.__getSubstate(this.__state);
		subscr._state = s;
        //console.log('process '+subscr.constructor.name + JSON.stringify(s));
		subscr.processStateChanges(s, false);
	}
};
