/*
 ctrl = m.prop(0);
 keys = {
  CtrlKey: ctrl,
 };
 */
Keyboard = function(keys) {
  var that = {};
  function make(val) {
    return function(ev) {
      if (ev.key in keys) {
        keys[ev.key](val);
      }
    };
  }

  that.up = make(0);
  that.down = make(1);

  that.addKey = function(key, prop) {
    keys[key] = prop;
  };
  return that;
};
