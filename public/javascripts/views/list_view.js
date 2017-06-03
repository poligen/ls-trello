var listTemplate = require('../../templates/list_template.handlebars');
var ListActionView = require('./list_action');
var CardCollectionView = require('./card_collection_view');
var Card = require('../models/card');
var ListView = Mn.View.extend({
  initialize: function(options) {
    this.model = options.model;
  },
  tagName: 'li',
  className: 'list',
  attributes: function() {
    return {
      'data-id': this.model.get('id'),
      'data-position': this.model.get('position'),
    };
  },
  template: listTemplate,
  regions: {
    'cardRegion':{
      el: '.cards',
      replaceElement: true
    },
    'listAction': 'span.more div.list-action',
  },
  events: {
    "click .add-card a": "addCard",
    "click .form-controls a.close": "closeCard",
    'click .add-card .form-controls input[type="submit"]': "createCard",
    "click header": "changeListName",
    "keypress header": "enterListName",
    "blur header textarea": "updateListName",
    "click .list-icons span.more": 'showListAction',
  },
  showListAction: function(e) {
    this.showChildView('listAction', new ListActionView({ model: this.model}));
    return false;
  },
  changeListName: function(e) {
    this.$(e.currentTarget).find('textarea').prop('readonly', false);
  },
  enterListName: function(e) {
    if ( e.which === 13 ) {
      this.$(e.currentTarget).find('textarea').prop('readonly', true);
      this.$(e.currentTarget).find('textarea').blur();
    }
  },
  updateListName: function(e) {
    e.stopPropagation();
    var currentId = this.$(e.currentTarget).closest('li.list').data('id');
    var currentList = app.lists.findWhere({id: currentId});
    currentList.set('name', this.$(e.currentTarget).val());
    currentList.save();
  },
  addCard: function() {
    this.$('.add-card form textarea').val('');
    this.$('.add-card form').show();
  },
  closeCard: function() {
    this.$('.add-card form').hide();
  },
  createCard:function(e) {
    e.preventDefault();
    var lastCardId = app.cards.max(function(card) {return card.id;}).id || 0;
    var newCard = {
      id: lastCardId + 1,
      title: this.$('.add-card textarea').val(),
      list: this.model,
      position: +this.model.get('cards').length + 1,
    };
    var createNew = app.cards.create(newCard, {type:'post', url:'/cards'});
    app.activities.trigger('create-new-card',createNew);

    e.stopPropagation();
    this.closeCard();
  },
  onRender: function() {
    this.showChildView('cardRegion', new CardCollectionView({collection: this.model.get('cards')}));
  }
});

module.exports = ListView;
