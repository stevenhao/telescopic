const spacing = 30;
const radius = 2;
const bigRadius = 5;

var Slider = {
  controller: function(args={}) {
    var size = args.size || m.prop(5);
    var idx = args.current || m.prop(2);
    var dragPos = m.prop(null);
    var dragging = m.prop(false);
    var startIdx = 0;
    this.size = size;
    this.idx = idx;
    this.dragPos = dragPos;
    this.dragging = dragging;

    var startPageX;
    this.startDrag = function(ev) {
      dragging(true);
      startPageX = ev.target.getBoundingClientRect().left;
      startIdx = idx();
      var img = this.cloneNode(true);
      document.body.appendChild(img);
      img.style.opacity = 0;
      ev.dataTransfer.setDragImage(img, 0, 0);
    };

    this.drag = function(ev) {
      if (ev.pageX === 0) return;
      var pos = (ev.pageX - startPageX) / spacing;
      pos = Math.min(Math.max(pos, 0), size() - 1);
      dragPos(pos);
      args.onchange(Math.floor(dragPos() + .5));
    };

    this.endDrag = function() {
      dragging(false);
      dragPos(null);
    };
  },
  view: function(ctrl) {
    const n = ctrl.size();
    const bigPos = ctrl.idx();
    const dragPos = ctrl.dragPos();
    const dragging = ctrl.dragging();

    const center = function(i) {
      return i * spacing + bigRadius;
    };

    return m('.slider-container', m('.slider[draggable=true]', {
      style: {
        width: 2 * bigRadius + (n - 1) * spacing,
        height: 2 * bigRadius,
      },
      ondragstart: ctrl.startDrag,
      ondrag: ctrl.drag,
      ondragend: ctrl.endDrag,
    }, [
      m('.slider-dots', U.range(n).map(function(i) {
        return m('.slider-dot', { style: {
          left: center(i) - radius,
          top: bigRadius-radius,
          width: radius * 2 + 'px',
          height: radius * 2 + 'px',
          'border-radius': radius + 'px',
          } }, null);
      })),
      m('.slider-bar', null),
      m('.slider-big-dot', {
        className: dragging ? 'hot' : '',
        style: {
          left: center(dragging ? dragPos : bigPos) - bigRadius,
          top: 0,
          width: bigRadius * 2 + 'px',
          height: bigRadius * 2 + 'px',
          'border-radius': bigRadius + 'px',
        },
      }, null),
    ]));
  },
};
