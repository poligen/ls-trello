var cardTemplate = require('../../templates/card.handlebars');
var LabelCollectionView = require('./label_colleciton.js');
var CardView = Mn.View.extend({
  template: cardTemplate,
  events: {
    'click span.edit': "quickEditCard",
  },
  triggers: {
    'click': 'render:single',
  },
  regions: {
    labels: {
      el: 'ul.labels',
      replaceElement: true,
    },
  },
  initialize: function(options) {
    this.model = options.model;
    this.listenTo(this.model, 'change:title', this.render);
    this.listenTo(this.model, 'change:commentsCount', this.render);
    this.listenTo(this.model, 'change:description', this.render);
    this.listenTo(this.model, 'change:dueDate', this.render);
    this.listenTo(this.model, 'change:subscribed', this.render);
    this.listenTo(app, 'toggleLabel', this.render);
  },
  quickEditCard: function(e) {
    var cardId = this.$(e.currentTarget).closest('li').data('id');
    var cardModel = this.model;
    var currentPosition = this.$(e.currentTarget).closest('li').offset();
    app.trigger('quickEdit', {cardModel, currentPosition});
    return false;
  },
  onRender: function() {
    // Get rid of that pesky wrapping-div.
    this.$el = this.$el.children();
    this.$el.unwrap();
    this.setElement(this.$el);
    this.showChildView('labels', new LabelCollectionView({collection: app.labels,
                                                          card: this.model,
                                                          viewType: 'card'}));
  },
});

module.exports = CardView;
