var LabelView = require('./label_view');
var LabelDetailView = require('./label_detail_view');
var LabelCollectionView = Mn.CollectionView.extend({
  initialize: function(options) {
    this.card = options.card;
    this.viewType = options.viewType;
  },
  tagName: 'ul',
  className:'labels',
  childView: function() {
    if (this.viewType === 'card') {
      return LabelView;
      } else if (this.viewType === 'detail') {
        return LabelDetailView;
      }
  },
  filter: function(child) {
    return _.contains(this.card.get('labels'), child.get('id'));
  },
});

module.exports = LabelCollectionView;
