var listActionTemplate = require('../../templates/list_action.handlebars');
var CopyListView = require('./copy_list');
var MoveListView = require('./move_list');
var MoveAllCardsView = require('./move_all_cards');
var ListActionView = Mn.View.extend({
  template: listActionTemplate,
  tagName: 'section',
  className: 'modal',
  events: {
    "click span.close": 'closeAction',
    "click": 'clicked',
    "click li.archive-list": 'archiveList',
    "click .action.copy-list": 'copyList',
    "click .action.move-list": 'moveList',
    "click span.prev": "renderListAction",
    "click .action.archive-cards": 'archiveAllCards',
    "click .action.move-cards":'moveAllCards',
  },
  regions: {
    actionRegion: '#show-action-form',
  },
  initialize: function() {
    _.bindAll(this, 'remove');
  },
  copyList:function(e) {
    this.$('h3, ul.actions, hr').hide();
    this.showChildView('actionRegion', new CopyListView({model: this.model}));
  },
  moveAllCards: function(e) {
    this.$('h3, ul.actions, hr').hide();
    this.showChildView('actionRegion', new MoveAllCardsView({collection: app.lists, model: this.model}));
  },
  moveList: function(e) {
    this.$('h3, ul.actions, hr').hide();
    this.showChildView('actionRegion', new MoveListView({collection: app.lists, model: this.model}));
  },
  renderListAction: function(e) {
    var actionRegion = this.getRegion('actionRegion');
    actionRegion.empty();
    this.$('h3, ul.actions, hr').show();
    e.stopPropagation();
  },
  closeAction: function() {
    this.remove();
  },
  clicked: function() {
    return false; // Don't bubble up to document, another is in ListView
  },
  onRender: function() {
    this.$el.css({
      display: 'block',
    });
    $(document).on('click', this.remove);
  },
  remove: function() {
    $(document).off('click', this.remove);
    this.$el.remove();
  },
  archiveAllCards: function() {
    var selectedCard = app.cards.filter({list: this.model});
    _(selectedCard).each(function(model) {
      model.destroy();
    });
    app.cards.sync('update', app.cards);
    this.remove();
  },
  archiveList: function() {
    this.archiveAllCards();
    this.model.destroy();
  }
});

module.exports = ListActionView;
