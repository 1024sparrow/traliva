function HistorySubstitute(){
    this._initState = JSON.parse(JSON.stringify(p_initState));
    this.__copy = function(o){return JSON.parse}
}

// Альтернативная версия Истории, используемая только в случае режима отладки 'url'
Traliva.history = {
    __paths: ['/'],
    __currentIndex: 0,
    replaceState: function(p_a, p_b, p_path){
        console.log('%creplaceState(url) --> '+p_path, 'color: #faa');
        this.__paths[this.__currentIndex] = p_path;
        this._updateUrl(p_path)
    },
    pushState: function(p_a, p_b, p_path){
        console.log('%cpushState(url) --> '+p_path, '#faa');
        this.__currentIndex++;
        if (this.__currentIndex < this.__paths.length)
            this.__paths[this.__currentIndex] = p_path;
        else
            this.__paths.push(p_path);
        this._updateUrl(p_path)
    },
    _goNext: function(){
        if ((this.__currentIndex + 1) < this.__paths.length){
            this.__currentIndex++;
            this._updateUrl(this.__paths[this.__currentIndex])
        }
    },
    _goBack: function(){
        if (this.__currentIndex > 0){
            this.__currentIndex--;
            this._updateUrl(this.__paths[this.__currentIndex])
        }
    },
    // сюда в классе виджета,отображающего URL в отладочной панели, должна быть записана функция, обновляющая URL в отладочной панели.
    _updateUrl: function(){console.log('oops..');}
}
