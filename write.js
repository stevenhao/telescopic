var Write = {
  viewmodel: function(root) {
    var nodes = [];
    // tree to list
    function dfs1(root) {
      var cur = {
        id: nodes.length,
        text: root.text,
      };
      nodes.push(cur);
      if (root.children && root.children.length) {
        cur.children = root.children.map(dfs1);
        cur.expanded = false;
      }
      return cur.id;
    }

    var root = dfs1(root);

    this.getTree = function() {
      // list to tree
      function dfs2(idx) {
        var cur = {
          id: nodes[idx].id,
          text: nodes[idx].text,
        };
        if (nodes[idx].children) {
          cur.children = nodes[idx].children.map(dfs2);
          cur.expanded = nodes[idx].expanded;
        } else {
          cur.leaf = true;
        }
        return cur;
      }
      return dfs2(root);
    };

    this.toggleNode = function(id) {
      if (nodes[id].leaf) return;
      nodes[id].expanded = !nodes[id].expanded;
    };
  },

  controller: function() {
    this.vm = new Read.viewmodel(defaultText);
    this.toggleNode = function(id) {
      this.vm.toggleNode(id);
    };
  },

  view: function(ctrl) {
    var tree = ctrl.vm.getTree();
    function draw(node) {
      if (node.expanded) {
        return m('.group', [
          m('.group-close',
            { onclick: ctrl.toggleNode.bind(ctrl, node.id) },
            'x'),
          m('.group-text', node.children.map(draw)),
        ]);
      } else if (!node.leaf) {
        return m('.t-node',
          { onclick: ctrl.toggleNode.bind(ctrl, node.id) },
          node.text);
      } else {
        return m('.t-leaf', node.text);
      }
    }

    return m('div', [
      m('.t-container', text.map(draw)),
    ]);
  },
};

