'use strict';
m.route.mode = "hash";
var nav = document.querySelector('#nav');
var main = document.querySelector('#main');
m.mount(nav, NavBar);
m.route(main, "/read", {
    "/read": Read,
    "/write": Write,
});
