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
      console.log(node);
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

    this.hasMoreParagraphs = function() {
      return numParagraphsExpanded < paragraphRoots.length;
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

    this.nextParagraph = function() {
      numParagraphsExpanded = numParagraphsExpanded + 1;
      if (numParagraphsExpanded > paragraphRoots.length) {
        numParagraphsExpanded = 1;
      }
    };

    this.toggleNode = function(id) {
      if (nodes[id].leaf) return;
      nodes[id].expanded = (nodes[id].expanded + 1) % (nodes[id].levels);
    };
  },

  controller: function() {
    //this.vm = new Read.viewmodel(defaultText);
    this.vm = new Read.viewmodel(unixText);
    this.toggleNode = function(id, ev) {
      U.consume(ev);
      this.vm.toggleNode(id);
    };
    this.nextParagraph = function() {
      this.vm.nextParagraph();
    };
    this.hasMoreParagraphs = function() {
      return this.vm.hasMoreParagraphs();
    };
  },

  view: function(ctrl) {
    var paragraphs = ctrl.vm.getParagraphs();
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
        return m('span.group', {
          className: [node.isroot? 'root' : '' , 'depth-' + depth].join(' '),
          style: { 'z-index': node.isroot ? -1 : depth },
          //onclick: depth <= 1 ? ctrl.toggleNode.bind(ctrl, node.id) : null,
          //onmousedown: U.consume, // prevent double-clicking
        }, [
          m('span.group-text', U.leave(sep, [
            m('span.t-node',
              {
                onclick: ctrl.toggleNode.bind(ctrl, node.id),
                onmousedown: U.consume, // prevent double-clicking
                className: (node.expanded + 1 == node.levels ? 'collapsible' : 'expandable')
              },
              text),
          ].concat(node.children.filter(function(ch) {
            return ch.level <= node.expanded;
          }).map(draw)))),
        ]);
      }
    }

    return m('div', [
      paragraphs.map(function(root) {
        return m('p.t-container', draw(root));
      }),
      m('span', {
        onclick: ctrl.nextParagraph.bind(ctrl),
        onmousedown: U.consume, // prevent double-clicking
        className: ctrl.hasMoreParagraphs() ? 'expandable' : 'collapsible',
      }, "..."),
    ]);
  },
};
