$Traliva.$checkVisible = function($e) {
	var $rect = $e.getBoundingClientRect();
	var $viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
	return !($rect.bottom < 0 || $rect.top - $viewHeight >= 0);
}
