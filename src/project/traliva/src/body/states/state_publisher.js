/***** class StatePublisher **************************
 *
 * Не допускайте подписывания одного и того же подписчика более одного раза!
 *
 * PREVENT MORE THEN ONCE SUBSCRIBING THE SAME SUBSCRIBER!
 *****************************************************
 */
var $StatePublisher = function(){
	this.$__state = {};//empty state by default untill be set
	this.$__subscribers = [];
    this.$__recursionLevel = 0;// <-- количество вложенных вызовов processStateChanges.
    //                      фиксируем для того, чтобы остановить гонку состояний раньше,
    //                      чем это сделает браузер
};
$StatePublisher.prototype.$state = function(){
	return this.$__state;
};
$StatePublisher.prototype.$setState = function($0){//parameter is an Object
    //$0 - state
    //$1 - i
    //$2 - subscr
    //$3 - s
	this.$__state = $0;
    if (!this.$_nodebug)
        console.log('set state: '+JSON.stringify($0));
	for (var $1 = 0 ; $1 < this.$__subscribers.length ; $1++){
		var $2 = this.$__subscribers[$1];
        $2.$__d.$0 = $0;
        //console.log('%csetState: '+JSON.stringify(this.$__state), 'color: #f00');//<--
        var $3 = $2.$__getSubstate($0);
		$2.$_state = $3;
        if ($Traliva.$debug && $Traliva.$debug.$state)
            this.$__debugState($2, $3);
		$2.$processStateChanges($3, true);
        //console.log('%c> setState: '+JSON.stringify(this.$__state), 'color: #f00');//<--
	}
};
$StatePublisher.prototype.$registerSubscriber = function($0){
    //$0 - state
    //$1 - e
    //$2 - s
    if ($Traliva.$debug && $Traliva.$debug.$state)
        console.log('%cregister '+$0.constructor.name, 'color:#ffa');
	$0.$__m_publisher = this;
    try{
        $0.$__d.$state = this.$__state;
    }
    catch($1){
        console.error('В конструкторе класса подписчика \'' + $0.constructor.name + '\'вы забыли вызвать конструктор базового класса');
    }
    //console.log('%csetState: '+JSON.stringify(this.$__state), 'color: #f00');//<--
    var $2 = $0.$__getSubstate(this.$__state);
	$0.$_state = $2;
    if ($Traliva.$debug && $Traliva.$debug.$state)
        this.$__debugState($0, $2);
	$0.$processStateChanges($2, true);
	this.$__subscribers.push($0);
    //console.log('%c> setState: '+JSON.stringify(this.$__state), 'color: #f00');//<--
};
$StatePublisher.prototype.$unregisterSubscriber = function($0){
    //$0 - state
    //$1 - index
    if ($Traliva.$debug && $Traliva.$debug.$state)
        console.log('%cunregister '+$0.constructor.name, 'color:#ffa');
	var $1 = this.$__subscribers.indexOf($0);
	if ($1 > -1)
		this.$__subscribers.splice($1, 1);
	else
		console.log("epic fail");
};
$StatePublisher.prototype.$_processStateChanges = function($0, $1){
    //$0 - sender
    //$1 - p_fromProcessStateChanges
    //$2 - i
    //$3 - subscr
    //$4 - s
	this.$__state = $0.$__d.$state;
    if ($1){
        if (this.$__recursionLevel > 128){
            throw 'Предотвращена гонка состояний.';
        }
        this.$__recursionLevel++;
    }
    else {
        this.$__recursionLevel = 0;
    }
	for (var $2 = 0 ; $2 < this.$__subscribers.length ; $2++){
		var $3 = this.$__subscribers[$2];
		if ($3 == $0)
			continue;
        $3.$__d.$state = this.$__state;
        //console.log('%csetState: '+JSON.stringify(this.$__state), 'color: #f00');//<--
        var $4 = $3.$__getSubstate(this.$__state);
		$3.$_state = $4;
        if ($Traliva.$debug && $Traliva.$debug.$state)
            this.$__debugState($3, $4);
        //console.log('%c> setState: '+JSON.stringify(this.$__state), 'color: #f00');//<--
		$3.$processStateChanges($4, false);
	}
    //if ($Traliva.$debug && $Traliva.$debug.$state){
    //    console.log('--');
    //}
};
$StatePublisher.prototype.$__debugState = function($0, $1, $2){
    //$0 - p_subscriber
    //$1 - p_state
    //$2 - p_action
    if (this.$_nodebug)
        return;
    if ($2)
        console.log('%c' + $2 + ' ' + $0.constructor.name + ': ' + JSON.stringify($1), 'color:#ffa');
    else{
        console.log('%cprocess ' + $0.constructor.name + ': ' + JSON.stringify($1), 'color:#ffa');
        $Traliva.$__d.$__debug.$debugStatesStatesWidget.$processState($0, this.$__state);
    }
};
function $StatePublisherNoDebug(){
    $StatePublisher.call(this);
    this.$_nodebug = true;
};
$StatePublisherNoDebug.prototype = Object.create($StatePublisher.prototype);
$StatePublisherNoDebug.prototype.constructor = $StatePublisherNoDebug;

// -- end of class $StatePublisher --
