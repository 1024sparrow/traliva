/****** class StateDebugWidget ***********************
 */
var StateDebugWidget = function(divId){
	var eDiv = (typeof divId == 'string') ? document.getElementById(divId) : divId;
	this.__eTextEdit = document.createElement("textarea");
	this.__eTextEdit.setAttribute("rows", "16");
	this.__eTextEdit.setAttribute("cols", "64");
	this.__eTextEdit.value = "";
	var eBn = document.createElement("button");
	(function(button, textEdit, stateDebugWidget){
		button.onclick = function(){
			//stateDebugWidget._state = {stub:"stub"};//JSON.parse(textEdit.value);
			stateDebugWidget._state = JSON.parse(textEdit.value);
			stateDebugWidget._registerStateChanges();
		};
	})(eBn, this.__eTextEdit, this);
	var eBnText = document.createTextNode("Apply JSON");
	eBn.appendChild(eBnText);
	eDiv.appendChild(this.__eTextEdit);
	eDiv.appendChild(eBn);
};
StateDebugWidget.prototype = Object.create(StateSubscriber.prototype);
StateDebugWidget.prototype.constructor = StateDebugWidget;
StateDebugWidget.prototype.processStateChanges = function(s){
	this.__eTextEdit.value = JSON.stringify(s, undefined, 2);
};
