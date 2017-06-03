var menuTemplate = require('../../templates/menu.handlebars');
var MenuView = Mn.View.extend({
  template: menuTemplate,
  tagName: 'section',
  className: 'modal',
  attributes: {
    id: 'menu',
  },
  events: {
    'click .close': 'hide',
    'click span.card-name': 'renderDetail',
  },
  renderDetail: function(e) {
    e.preventDefault();
    var title = this.$(e.currentTarget).text();
    var currentCard = app.cards.findWhere(function(card) {
      return card.get('title') === title;
    });
    app.trigger('detailCard', currentCard);
  },
  hide: function() {
    this.$el.animate({
      right: -999
    });
  },
  onRender: function() {
    this.$el.css({
      right: 0,
    });
    this.$('.card-name').css('cursor', 'pointer');
  },
});

module.exports = MenuView;
