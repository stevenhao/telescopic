'use strict';
var Read = {
  viewmodel: function(paragraphs) {
    var nodes = [];
    // tree to list
    function dfs1(node) {
      var cur = {
        id: nodes.length,
        text: node.text,
        level: node.level,
        expanded: 0,
      };
      nodes.push(cur);
      if (cur.text.length > 1 || node.children && node.children.length) {
        cur.children = (node.children || []).map(dfs1);
        cur.levels = U.max(cur.children.map(function(ch) {
          return nodes[ch].level + 1;
        }).concat(cur.text.length));
        cur.leaf = false;
      } else {
        cur.leaf = true;
      }
      return cur.id;
    }

    var paragraphRoots = paragraphs.map(function(toplevel) {
      return dfs1({text: [], children: toplevel});
    });
    var numParagraphsExpanded = 1;

    this.getNumParagraphsExpanded = function() {
      return numParagraphsExpanded;
    };

    this.getTotalParagraphs = function() {
      return paragraphRoots.length;
    };

    this.getParagraphs = function() {
      // list to tree
      function dfs2(idx) {
        var cur = {
          id: nodes[idx].id,
          text: nodes[idx].text,
          level: nodes[idx].level,
          expanded: nodes[idx].expanded,
          leaf: nodes[idx].leaf,
        };
        if (!nodes[idx].leaf) {
          cur.levels = nodes[idx].levels,
          cur.children = nodes[idx].children.map(dfs2);
        }
        return cur;
      }
      var paragraphs = paragraphRoots.slice(0, numParagraphsExpanded).map(function(rootid) {
        var ret = dfs2(rootid);
        ret.expanded = 1;
        ret.isroot = true;
        return ret;
      });
      return paragraphs;
    };

    this.nextParagraph = function(backwards) {
      console.log('nextParagraph', backwards);
      if (backwards) {
        numParagraphsExpanded--;
        if (numParagraphsExpanded < 0) {
          numParagraphsExpanded = 0;
        }
      } else {
        numParagraphsExpanded++;
        if (numParagraphsExpanded > paragraphRoots.length) {
          numParagraphsExpanded = paragraphRoots.length;
        }
      }
    };

    this.toggleNode = function(id, backwards) {
      if (nodes[id].leaf) return;
      if (backwards) {
        if (nodes[id].expanded > 0) {
          nodes[id].expanded--;
        }
      } else {
        nodes[id].expanded++;
        if (nodes[id].expanded == nodes[id].levels) {
          nodes[id].expanded = 0;
        }
      }
    };
  },

  controller: function() {
    //this.vm = new Read.viewmodel(defaultText);

    var vm = new Read.viewmodel(unixText);
    var backtracking = m.prop(false);

    this.backtracking = backtracking;
    this.vm = vm;
    this.toggleNode = function(id, backwards) {
      vm.toggleNode(id, backwards);
    };
    this.nextParagraph = function(backwards) {
      vm.nextParagraph(backwards);
    };
    this.canExpandParagraph = function() {
      return vm.getNumParagraphsExpanded() < vm.getTotalParagraphs();
    };
    this.canCollapseParagraph = function() {
      return vm.getNumParagraphsExpanded() > 0;
    };
    this.keyboard = Keyboard({
      'Alt': backtracking,
    });
  },

  view: function(ctrl) {
    var paragraphs = ctrl.vm.getParagraphs();
    var backtracking = ctrl.backtracking();

    var sep = m('span.sep', ' ');
    function computeDepth(node) {
      if (node.leaf || !node.expanded) return 0;
      var ret = 0;
      node.children.filter(function(ch) {
        return ch.level <= node.expanded;
      }).forEach(function(ch) {
        var nxt = 1 + computeDepth(ch);
        if (nxt > ret) {
          ret = nxt;
        }
      });
      return ret;
    }

    function draw(node) {
      var text = node.text[U.min([node.expanded, node.text.length - 1])];
      if (node.leaf) {
        return m('span.t-lf', node.text);
      } else {
        var depth = computeDepth(node);
        var expandable = !backtracking && node.expanded + 1 < node.levels;
        var collapsible = ( !backtracking && node.expanded + 1 == node.levels ||
            backtracking && node.expanded - 1 >= 0);
        return m('span.group', {
          className: [
            node.isroot? 'root' : '' ,
            'depth-' + depth,
          ].join(' '),
          style: { 'z-index': node.isroot ? -1 : depth },
        }, [
          m('span.group-text', U.leave(sep, [
            m('span.t-node',
              {
                onclick: ctrl.toggleNode.bind(null, node.id, backtracking),
                onmousedown: U.consume, // prevent double-clicking
                className: [
                  collapsible ? 'collapsible' : '',
                  expandable ? 'expandable' : '',
                ].join(' '),
              },
              text),
          ].concat(node.children.filter(function(ch) {
            return ch.level <= node.expanded;
          }).map(draw)))),
        ]);
      }
    }

    var expandable = !backtracking && ctrl.canExpandParagraph();
    var collapsible = backtracking && ctrl.canCollapseParagraph();
    return m('.root[tabindex=1]', {
      config: function(ev) {
        ev.focus();
      },
      onblur: function() { this.focus(); },
      onkeydown: ctrl.keyboard.down,
      onkeyup: ctrl.keyboard.up,
    }, [
      paragraphs.map(function(root) {
        return m('p.t-container', draw(root));
      }),
      m('span', {
        onclick: ctrl.nextParagraph.bind(null, backtracking),
        onmousedown: U.consume, // prevent double-clicking
        className: [
          collapsible ? 'collapsible' : '',
          expandable ? 'expandable' : '',
        ].join(' '),
      }, "..."),
    ]);
  },
};
