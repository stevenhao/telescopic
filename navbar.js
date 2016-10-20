var NavBar = {
  controller: function() {
    this.getNewId = function() {
      for (var id = 1000; id < 5000; id += 1) {
        if (localStorage.getItem('text-' + id) == null) {
          return id;
        }
      }
    };
  },
  view: function(ctrl) {
    var newid = ctrl.getNewId();
    return m('div.nav', [
      m('section.sec', [
        m('a', 'Read'),
        m('.dropdown', U.map({
          a: {name: 'Text 1', author: 'Author 1'},
          b: {name: 'Text 2', author: 'Author 2'},
        }, function(id, meta) {
          var url = '#/read/' + id;
          return m('a.item', { href: url }, meta.name + ' by ' + meta.author);
        })),
      ]),
      m('section.sec', [
        m('a', 'Tools'),
        m('.dropdown.narrow', [
          m('a.item', { href: '#/edit/' + newid }, 'Compose'),
          m('a.item', { href: '#/upload' }, 'Publish'),
          m('a.item', { href: '#/download' }, 'Download'),
        ]),
      ]),

    ]);
  },
};
