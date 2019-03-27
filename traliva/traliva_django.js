'use strict';

(function(){
	if (!(Traliva && Traliva.ajax)){
		console.log('fail. Traliva.ajax needed.');
		return;
	}
	function getCookie(name) {
		var cookieValue = null;
		if (document.cookie && document.cookie != '') {
			var cookies = document.cookie.split(';');
			for (var i = 0; i < cookies.length; i++) {
				var cookie = cookies[i].replace(/^\s+|\s+$/gm,'')//берём i-тый, убираем пробельные символы с краёв
				if (cookie.substring(0, name.length + 1) == (name + '=')) {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	}
	// проверка, не является ли это запросом на внешний адрес (не на наш сервер)
	function sameOrigin(url) {
		// test that a given url is a same-origin URL
		// url could be relative or scheme relative or absolute
		var host = document.location.host; // host + port
		var protocol = document.location.protocol;
		var sr_origin = '//' + host;
		var origin = protocol + sr_origin;
		// Allow absolute or scheme relative URLs to same origin
		return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
			(url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
			// or any other URL that isn't scheme relative or absolute i.e relative.
			!(/^(\/\/|http:|https:).*/.test(url));
	}
	
	var ajax_old = Traliva.ajax;
	Traliva.ajax = function(p){
		if (p && p.hasOwnProperty('dataToPost') && sameOrigin(p.sourcePath)){
			var csrftoken = getCookie('csrftoken');
			if (!csrftoken){
				//Мы перехватили случай, когда куки были почищены во время нахождения на сайте
				// Или сайт был запущен в браузере, где заблокированы куки.
				//Перед тем как ...
				//not implemented
				console.log('POST request blocked becase of cookie not found. I can\'t post data securely.');
				if (p.hasOwnProperty('errorFunc'))
					errorFunc(false);
				return;
			}
			p.addonHttpHeaders['X-CSRFToken'] = csrftoken;
		}
		return ajax_old(p);
	}
})();
