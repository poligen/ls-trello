var CardView = require('./card_view');
var sortable = require('jquery-ui/ui/widgets/sortable');
var CardCollectionView = Mn.CollectionView.extend({
  tagName: 'ul',
  className: 'cards',
  childView: CardView,
  initialize: function(options) {
    this.collection = options.collection;
    this.sortableCard();
  },
  onChildviewRenderSingle: function(childView) {
    var cardModel = childView.model;
    app.trigger('detailCard', cardModel);
  },
  sortableCard: function() {
    this.$el.sortable({
      connectWith: '.cards',
      forcePlaceholderSize: true,
      placeholder: "sortable-card-placeholder",
      items: '> li',
      delay: 150,
      stop: function(event, ui) {
        app.trigger('update-card-position',ui);
      }
    });
  },
});

module.exports = CardCollectionView;
