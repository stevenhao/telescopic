'use strict';
m.route.mode = "hash";
var main = document.querySelector('#main');
m.route(main, "/read", {
    "/read": Read, // place the Read component in #main
});
