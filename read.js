'use strict';
var Read = {
  /*
   * paragraphs: a list of paragraphs, e.g. unixText
   * */
  viewmodel: function(paragraphs) {
    var nodes = []; // nodes contains the List-form of the text

    /* converts the InputTree (given in unixText.js) into List-form.
     * node: an InputTreeNode. we will add its subtree to nodes.
     * */
    function dfs1(node) {

      // cur is a "ListNode" -- a node in the list representation of the text
      var cur = {
        id: nodes.length, // id is such that cur == nodes[id]
        text: node.text, // list of strings -- the different ways the node can be displayed
        level: node.level, // how many times you need to click cur's parent for cur to appear
        expanded: 0, // how many times you have clicked cur
      };
      nodes.push(cur);

      if (cur.text.length > 1 || node.children && node.children.length) {
        cur.children = (node.children || []).map(dfs1); // recurse on children, store their ids in cur.children
        cur.levels = U.max(cur.children.map(function(ch) {
          return nodes[ch].level + 1;
        }).concat(cur.text.length)); // levels is the maximum of your childrens' level.
      } else {
        cur.leaf = true; // if cur has no children, mark it as a leaf
      }
      return cur.id; // return id -- so your parent can store it
    }

    // paragraphRoots: a list of id's of paragraph roots
    var paragraphRoots = paragraphs.map(function(toplevel) {
      // each paragraph is a list of "toplevel" TreeNodes
      return dfs1({text: [], children: toplevel}); // call dfs on a dummy node with children = toplevel
    });
    var numParagraphsExpanded = 1;

    this.getNumParagraphsExpanded = function() {
      return numParagraphsExpanded;
    };

    this.getTotalParagraphs = function() {
      return paragraphRoots.length;
    };

    this.getParagraphs = function() {
      // converts List-form of the text to Tree-form
      // called by view during rendering
      function dfs2(idx) {
        // cur is a "TreeNode" -- a node in the tree representation of the text
        var cur = {
          id: nodes[idx].id,
          text: nodes[idx].text,
          level: nodes[idx].level,
          expanded: nodes[idx].expanded,
          leaf: nodes[idx].leaf,
        };
        if (!nodes[idx].leaf) {
          cur.levels = nodes[idx].levels;
          // children: a list of TreeNodes -- computed by recursively calling dfs2 on the children
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

    // handle opening/closing paragraphs
    this.nextParagraph = function(backwards) {
      console.log('nextParagraph', backwards);
      if (backwards) { // hide the last paragraph, if any
        numParagraphsExpanded--;
        if (numParagraphsExpanded < 0) {
          numParagraphsExpanded = 0;
        }
      } else { // show the next paragraph, if exists
        numParagraphsExpanded++;
        if (numParagraphsExpanded > paragraphRoots.length) {
          numParagraphsExpanded = paragraphRoots.length;
        }
      }
    };

    // handle collapsing/expanding nodes[id]
    this.toggleNode = function(id, backwards) {
      if (nodes[id].leaf) return;
      if (backwards) { // if backwards is true, we collapse
        if (nodes[id].expanded > 0) {
          nodes[id].expanded--;
        }
      } else { // otherwise, we expand
        nodes[id].expanded++;
        if (nodes[id].expanded == nodes[id].levels) {
          // cycle to the initial state if we reach the end
          nodes[id].expanded = 0;
        }
      }
    };
  },

  controller: function() {
    var vm = new Read.viewmodel(unixText);
    var backtracking = m.prop(false);

    this.backtracking = backtracking;

    this.vm = vm;

    /* called when user clicks a node
     * id: the (integer) id of the node
     * backwards: true if we are backtracking, false if expanding
     * */
    this.toggleNode = function(id, backwards) {
      vm.toggleNode(id, backwards);
    };

    /* called when user clicks a node
     * */
    this.nextParagraph = function(backwards) {
      vm.nextParagraph(backwards);
    };

    /* called by view to determine how to style text
     * */
    this.canExpandParagraph = function() {
      return vm.getNumParagraphsExpanded() < vm.getTotalParagraphs();
    };

    this.canCollapseParagraph = function() {
      return vm.getNumParagraphsExpanded() > 0;
    };

    /* Keyboard object (keyboard.js)
     * handles key events.
     * */
    this.keyboard = Keyboard({
      'Alt': backtracking, // pass backtracking as the callback function
      // since backtracking is a m.prop, it will be 1 when 'Alt' is pressed, and 0 when 'Alt' is not pressed
    });
  },

  // returns a virtual dom element for mithril to render
  view: function(ctrl) {
    var paragraphs = ctrl.vm.getParagraphs(); // list of TreeNodes
    var backtracking = ctrl.backtracking(); // true if alt is held down

    var sep = m('span.sep', ' '); // inserted between words.

    // helper function -- recursively creates a virtual dom element given a TreeNode
    function draw(node) {
      var text = node.text[U.min([node.expanded, node.text.length - 1])];
      if (node.leaf) {
        return m('span.t-lf', node.text);
      } else {
        var expandable = !backtracking && node.expanded + 1 < node.levels;
        var collapsible = ( !backtracking && node.expanded + 1 == node.levels ||
            backtracking && node.expanded - 1 >= 0);
        return m('span.group', [
          m('span.group-text', U.leave(sep, [ // [node's text element]
            m('span.t-node',
              {
                onclick: ctrl.toggleNode.bind(null, node.id, backtracking), // call toggleNode on click
                onmousedown: U.consume, // prevent double-clicking
                className: [
                  collapsible ? 'collapsible' : '',
                  expandable ? 'expandable' : '',
                ].join(' '),
              },
              text),
          ].concat(node.children.filter(function(ch) { // [node's visible children's text elements]
            return ch.level <= node.expanded;
          }).map(draw)))),
        ]);
      }
    }

    var expandable = !backtracking && ctrl.canExpandParagraph();
    var collapsible = backtracking && ctrl.canCollapseParagraph();

    // here we return the actual virtual dom element
    return m('.root[tabindex=1]', { // tabindex=1: so the div is allowed to have focus
      config: function(el) { el.focus(); }, // request focus when mounted
      onblur: function() { this.focus(); }, // keep focus
      onkeydown: ctrl.keyboard.down,
      onkeyup: ctrl.keyboard.up, // hook up the keyboard listener
    }, [
      paragraphs.map(function(root) {
        return m('p.t-container', draw(root)); // draw each paragraph
      }),
      m('span', { // draw the next-paragraph button
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
