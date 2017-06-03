var ListCollectionView = require('./list_collection_view');

var MenuView = require('./menu');
var NotificationView = require('./notification');
var SearchView = require('./search');
var QuickListCardView = require('./quick_list_card');
var DetailCardView = require('./detail_card');
var BoardView = Mn.View.extend({
  el: 'body',
  regions: {
    search: {
      el: 'section#search', 
      replaceElement: true,
    },
    notification: {
      el: 'div#notif section', 
      replaceElement: true,
    },
    lists: "#lists",
    menu: {
      el: '#menu',
      replaceElement: true,
    },
    quickEdit: {
      el: "#quick-edit",
      replaceElement: true,
    },
    detailCard: {
      el: '#card-details',
      replaceElement: true,
    }
  },
  events: {
    'focus header form input[type="text"]': 'startSearch',
    'click .overlay': 'closeSearch',
    'input header form input[type="text"]': 'matchSearch',
    'click header form span.close': 'closeSearch',
    "click .add-list": 'addList',
    "click .add-list  .close": 'closeList',
    "click .form-controls > input": "createList",
    "click section div.menu": 'showMenu',
    "click a.notif-btn": 'toggleNotif',

  },
  initialize: function() {
    this.listenTo(app, 'quickEdit', this.showQuickCard);
    this.listenTo(app, 'detailCard', this.showDetailCard);
    this.listenTo(app, 'closeSearch', this.closeSearch);
  },
  showMenu:function(e) {
    this.showChildView('menu', new MenuView({collection: app.activities}));
  },
  toggleNotif: function(e) {
    e.preventDefault();
    if (this.$('#notif section.modal').attr('style') === "display: block;") {
      this.$('#notif section.modal').hide();
    } else {
      this.showChildView('notification', new NotificationView({collection: app.notifications}));
      this.$('#notif section.modal').show();
    }
  },
  addList: function(e) {
    e.preventDefault();
    this.$('.add-list').addClass('show');
  },
  closeList: function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.$('.add-list').removeClass('show');
    this.$('input[type="text"]').val('');
  },
  createList: function(e) {
    e.preventDefault();

    var lastListId = app.lists.max(function(list) { return list.id; }).id || 0;
    var newList = {
      name: this.$('.add-list input[type="text"]').val(),
      position: app.lists.length + 1,
      id: lastListId + 1,};
    $.ajax({
      url: '/lists',
      type: 'post',
      data: newList,
      success: function(data) {
        app.lists.add(newList);
      }
    });
    e.stopPropagation();
    this.$('.add-list').removeClass('show');
    this.$('input[type="text"]').val('');
  },
  showQuickCard: function(options) {
    this.showChildView('quickEdit', new QuickListCardView({ model: options.cardModel, position: options.currentPosition}));
  },
  showDetailCard: function(model) {
    this.showChildView('detailCard', new DetailCardView({ model: model}));
  },
  startSearch: function(e) {
    this.$(e.currentTarget).addClass("focus");
  },
  closeSearch: function() {
    this.$('header form input').removeClass("focus");
    this.$('header form input').val('');
    this.detachChildView('search');
  },
  matchSearch: function(e) {
    var searchTerm = this.$(e.currentTarget).val();
    var matchResults = app.cards.where(function(card) {
      return card.get('title').includes(searchTerm);
    });
    _(matchResults).each(function(card) {
      card.set('listName', card.get('list').get('name'));
    });
    this.showChildView('search', new SearchView({collection: matchResults}));
    if (searchTerm.length === 0) {
      this.detachChildView('search');
    }
  },
  onRender: function() {
    this.showChildView('lists', new ListCollectionView({collection: app.lists}));
  }
});

module.exports = BoardView;
