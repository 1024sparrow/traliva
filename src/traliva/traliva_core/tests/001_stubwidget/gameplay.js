'use strict';

var wRoot = new Traliva.Strip(Traliva.Strip__Orient__hor);
var w, stub;

w = new Traliva.Widget(wRoot);
stub = new Traliva.StubWidget(w, 'первый');
wRoot.addItem(w);

w = new Traliva.Widget(wRoot);
stub = new Traliva.StubWidget(w, 'второй');
wRoot.addItem(w);
