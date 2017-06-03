var moveAllCardsTemplate = require('../../templates/move_all_cards.handlebars');
var MoveAllCardsView = Mn.View.extend({
  template: moveAllCardsTemplate,
  tagName: 'section',
  className: 'move-all-cards',
  events: {
    'click .actions .action': 'moveCards',
  },
  moveCards: function(e) {
    e.preventDefault();
    var targetList = this.$(e.currentTarget).data('id');
    var copyCards = this.model.get('cards')
        .map(function(card) {
          return _.omit(_.clone(card.attributes), 'list');
        });
    _(copyCards).each(function(card) {
      card.list = targetList;
    });
    app.cards.set(copyCards,{remove: false});
    app.cards.sync('update', app.cards);
    this.$('span.close').trigger('click');
  },
  initialize: function() {
    this.collection = this.collection.reject(function(model) {
      return model.get('id') === this.model.get('id');
    }.bind(this));
    this.model.set('items', this.collection);
    this.cards = this.model.get('cards');
  }
});

module.exports = MoveAllCardsView;
