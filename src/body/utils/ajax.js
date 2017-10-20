/*
function ajax - take data from server (always asynchroniusly!). Realized partially (just simplest realization).
return value - none
if called without parameter will be printed short help in console
parameter is an object with the following fields:
	type		name		description
	+===		+===		+==========
	string		sourcePath	network path to load data from
	function	readyFunc(result) take result in this function
	function	errorFunc(isNetworkProblem)
					parameter of this function is Boolean
					("true" if caused of timeout or network connection breakup)
					default is write error to console
	int		timeout		timeout in milliseconds. default is 3000.
	string		dataToPost	if set, method is "post" instead of default "get". This data will be sent to server.
	string		mimetype	mimetype of content. default is "text/plain"
Caution: if some fields in parameter "p" absense, it will be added as undefined. Take this into account if you would use that object later.
*/
function ajax(p){
	if (!p){
		console.log("B.ajax(p). Available fileds for p: sourcePath, readyFunc(result), errorFunc(isNetworkProblem), timeout, dataToPost, mimetype*.");
		return;
	}
	var sourcePath = p.sourcePath;
	var readyFunc = p.readyFunc;
	var errorFunc = p.errorFunc;
	var timeout = p.timeout;
	var dataToPost = p.dataToPost;
	var mimetype = p.mimetype;//unsupported yet: only text
	var addonHttpHeaders = p.addonHttpHeaders;
/*
xhttp.setRequestHeader("Content-Type", "application/json");
xhttp.setRequestHeader('Content-Type', 'text/plain')
*/

	var xhttp=new XMLHttpRequest();
	xhttp.addEventListener(
		'load',
		function(e){
			if (readyFunc)
				readyFunc(xhttp.responseText);
		}
	);
	xhttp.addEventListener(
		'error',
		function(e){
			if (errorFunc)
				errorFunc(true);//
		}
	);
	xhttp.addEventListener(
		'abort',
		function(){
			if (errorFunc)
				errorFunc(false);
		}
	);
	xhttp.addEventListener(
		'timeout',
		function(){
			if (errorFunc)
				errorFunc(true);
		}
	);
	if (dataToPost)
		xhttp.open("POST", sourcePath, true);
	else
		xhttp.open("GET", sourcePath, true);
//	xhttp.setRequestHeader('Content-Type', 'text/plain');
	if (addonHttpHeaders){
		for (var i in addonHttpHeaders){
			xhttp.setRequestHeader(i, addonHttpHeaders[i]);
		}
	}
	if (timeout)
		xhttp.timeout = timeout;
	xhttp.send(dataToPost);
}
