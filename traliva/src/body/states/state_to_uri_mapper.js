function $StateToUriMapper(p_statesObj){
    $StateSubscriber.call(this);
}
$StateToUriMapper.prototype = Object.create($StateSubscriber.prototype);
$StateToUriMapper.prototype.constructor = $StateToUriMapper;
$StateToUriMapper.prototype.$processStateChanges = function(s){
};
$StateToUriMapper.prototype.$updateForUrl = function(p_url){
};
$StateToUriMapper.prototype.$updateState = function(){
};
