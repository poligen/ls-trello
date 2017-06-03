var ListView = require('./list_view');
var sortable = require('jquery-ui/ui/widgets/sortable');

var ListCollectionView = Mn.CollectionView.extend({
  el: '#lists',
  // region: '#lists',
  childView: ListView,
  initialize: function() {
    this.sortableList();
  },
  sortableList: function() {
    this.$el.sortable({
      placeholder: "sortable-list-placeholder",
      forcePlaceholderSize: true,
      tolerance: 'pointer',
      handle: '> header',
      items: '> li',
      delay: 150,
      update: function(event, ui) {
        app.trigger('update-list-position',ui);
      }
    });
  },
});

module.exports = ListCollectionView;
