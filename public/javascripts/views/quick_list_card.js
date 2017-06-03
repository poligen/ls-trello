var quickListCardTemplate = require('../../templates/quick_list_card.handlebars');
var LabelCollectionView = require('./label_colleciton.js');
var EditLabelView = require('./edit_label.js');
var DueDateView = require('./due_date_view');
var MoveCardView = require('./move_card');
var CopyCardView = require('./copy_card');
var QuickListCardView = Mn.View.extend({
  tagName: 'section',
  className: 'modal card-edit',
  template: quickListCardTemplate,
  attributes: function() {
    return {
      "data-id": this.model.get('id'),
      "id": "card-quick-edit",
    };
  },
  regions: {
    'showAction': {
      el: '.show-action',
      replaceElement: true,
    },
    labels: {
      el: 'ul.labels',
      replaceElement: true,
    },
  },
  events: {
    "click .overlay": "closeQuick",
    'click .form-controls input[type="submit"]': 'updateCard',
    'click .actions .labels': 'editLabel',
    'click .actions .archive': 'archiveCard',
    'click .actions .due-date': 'showDueDate',
    'click .actions .move-card': 'showMoveCard',
    'click .actions .copy-card': 'showCopyCard',

  },
  initialize: function() {
    this.listenTo(app, 'toggleLabel', this.renderLabel);
  },
  closeQuick: function() {
    this.destroy();
  },
  showDueDate: function(e) {
    e.preventDefault();
    var currentPosition = this.$(e.currentTarget).offset();
    this.showChildView('showAction', new DueDateView({card: this.model, position: currentPosition}));
  },
  showMoveCard: function() {
    this.showChildView('showAction', new MoveCardView({card: this.model, lists: app.lists, quickView: this}));
  },
  showCopyCard: function() {
    this.showChildView('showAction', new CopyCardView({card: this.model, lists: app.lists, quickView: this}));
  },
  editLabel: function(e) {
    e.preventDefault();
    var currentPosition = this.$(e.currentTarget).offset();
    this.showChildView('showAction', new EditLabelView({card: this.model, position: currentPosition}));
  },
  editDescription: function(e) {
    e.preventDefault();
    this.$(e.currentTarget).hide();
    this.$('.description form').show();
  },
  archiveCard: function(e) {
    app.activities.trigger('archive-card',this.model);
    app.notifications.trigger('archive-card', this.model);
    this.model.destroy();
    this.destroy();
  },
  updateCard: function(e) {
    this.model.set('title', this.$('textarea').val());
    this.model.save();
    this.destroy();
  },
  renderLabel: function() {
    var labels = this.getChildView('labels');
    labels.render();
  },
  onRender: function() {
    this.showChildView('labels', new LabelCollectionView({collection: app.labels,
                                                          card: this.model,
                                                          viewType: 'card'}));
    this.$el.css({
      top: this.options.position.top,
      left: this.options.position.left,
    });
  }
});

module.exports = QuickListCardView;
