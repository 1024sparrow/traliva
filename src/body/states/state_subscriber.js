/****** class StateSubscriber ************************
 */

var StateSubscriber = function(){
	this._state = {};//empty state by default untill be set
};
StateSubscriber.prototype.processStateChanges = function(state, ifResetStateChain){
	console.log("critical error: method processStateChanges must be reimplemented! class '"+this.constructor.name+"'");
	//console.log("Class name: "+this.constructor);
};
StateSubscriber.prototype._registerStateChanges = function(){
	if (this.__m_publisher)
	{
		this.__m_publisher.processStateChanges(this);
//		console.log("xml subscriber : _registerStateChanges -> ok");
	}
//	else
//		console.log("xml subscriber : _registerStateChanges -> aborted");
};
