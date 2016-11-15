'use strict';
m.route.mode = "hash";
var main = document.querySelector('#main');
m.route(main, "/read", {
    "/read": Read, // place the Read component in #main
    "/write": Write, // this is an unused route, for now
    "/slider": Slider, // this is an unused route, for now
});
