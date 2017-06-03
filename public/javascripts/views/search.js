var searchTemplate = require('../../templates/search.handlebars');
var SearchView = Mn.View.extend({
  tagName: 'section',
  className: 'search-results modal',
  template: searchTemplate,
  events: {
    'click .card-results a': 'showCard',
  },
  showCard: function(e) {
    e.preventDefault();
    var cardTitle = this.$(e.currentTarget).text();
    var currentCard = app.cards.findWhere(function(card) {
      return card.get('title') === cardTitle;
    });
    this.destroy();
    app.trigger('detailCard', currentCard);
    app.trigger('closeSearch');
  },
});

module.exports = SearchView;
