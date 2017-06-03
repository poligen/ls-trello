var detailTemplate = require('../../templates/detail_card.handlebars');
var LabelCollectionView = require('./label_colleciton');
var EditLabelView = require('./edit_label.js');
var DueDateView = require('./due_date_view');
var MoveCardView = require('./move_card');
var CopyCardView = require('./copy_card');
var CommentView = require('./comment');
var DetailCardView = Mn.View.extend({
  className: 'card-edit',
  attributes: function() {
    return {
      'id': 'card-details',
      "data-id": this.model.get('id'),
    };
  },
  template: detailTemplate,
  regions: {
    'labels': {
      el:'.details .attributes ul.labels',
      replaceElement: true,
    },
    'showAction': {
      el: '#show-action',
      replaceElement: true,
    },
    'comments':{
      el: 'section.activity ul.activities',
      replaceElement: true,
    },
  },
  events: {
    "click .overlay, i.close": "closeSingle",
    "click section.description a": 'editDescription',
    "click .description form a": 'closeDescription',
    'click .description form input[value="Save"]': 'saveDescription',
    "click li.labels, ul.labels li.label": 'editLabel',
    "click li.action.archive": 'archiveCard',
    'click a.due-date, li.action.due-date': 'showDueDate',
    'click .name a, li.action.move-card': 'moveCard',
    'click .actions .copy-card': 'copyCard',
    "click header": "changeCardName",
    "keypress header": "enterCardName",
    "blur header textarea": "updateCardName",
    "submit .add-comment form":'addComment',
    'click li.subscribe': 'toggleSubscribe',
  },
  initialize: function(options) {
    this.comments = options.comments;
    this.listenTo(this.model, 'change:dueDate', this.render);
  },
  changeCardName: function(e) {
    this.$(e.currentTarget).find('textarea').prop('readonly', false);
  },
  enterCardName: function(e) {
    if ( e.which === 13 ) {
      this.$(e.currentTarget).find('textarea').prop('readonly', true);
      this.$(e.currentTarget).find('textarea').blur();
    }
  },
  updateCardName: function(e) {
    e.stopPropagation();
    var currentId = this.$(e.currentTarget).closest('#card-details').data('id');
    var currentCard = app.cards.findWhere({id: currentId });
    currentCard.set('title', this.$(e.currentTarget).val());
    currentCard.save();
  },
  archiveCard: function() {
    app.activities.trigger('archive-card',this.model);
    app.notifications.trigger('archive-card', this.model);
    this.model.destroy();
    this.closeSingle();
  },
  editDescription: function(e) {
    e.preventDefault();
    this.$(e.currentTarget).hide();
    this.$('.description form').show();
  },
  closeDescription: function() {
    this.$('.description a').show();
    this.$('.description form').hide();
  },
  saveDescription: function(e) {
    e.preventDefault();
    e.stopPropagation();
    var description = this.$('.description textarea').val();
    var currentId = this.$(e.currentTarget).closest('#card-details').data('id');
    var currentCard = app.cards.findWhere({id: currentId });
    currentCard.set('description', description);
    currentCard.save();
    this.render();
    this.closeDescription();
  },
  showDueDate: function(e) {
    e.preventDefault();
    var currentPosition = this.$(e.currentTarget).offset();
    this.showChildView('showAction', new DueDateView({card: this.model, position: currentPosition}));
  },
  editLabel: function(e) {
    e.preventDefault();
    var currentPosition = this.$(e.currentTarget).offset();
    this.showChildView('showAction', new EditLabelView({card: this.model, position: currentPosition}));

  },
  closeSingle: function() {
    this.destroy();
  },
  toggleLabel: function() {
    if (this.$('ul.labels').length > 0) {
      this.labelView.render();
    } else {
      this.render();
    }
  },
  moveCard: function(e) {
    e.preventDefault();
    var currentLocation = this.$(e.currentTarget).offset();
    this.showChildView('showAction', new MoveCardView({card: this.model, lists: app.lists, location: currentLocation}));
  },
  copyCard: function() {
    this.showChildView('showAction', new CopyCardView({card: this.model, lists: app.lists}));
  },

  toggleSubscribe: function(e) {
    if (this.model.get('subscribed')) {
      this.model.set('subscribed', false);
      this.$(e.currentTarget).find('span').remove();
      app.notifications.trigger('unsubscribed', this.model);
    } else {
      this.model.set('subscribed', true);
      this.$(e.currentTarget).append('<span><i class="material-icons md-18">check</i></span>');
    }
    this.model.save();
  },

  addComment: function(e) {
    e.preventDefault();
    var currentView;
    var today = new Date();
    var content = this.$('.add-comment textarea').val();
    var lastCommentId = app.comments.max(function(comment) {return comment.id;}).id || 0;
    var commentData = {
      content: content,
      date: today.toDateString(),
      card: this.model.get('id'),
      id: lastCommentId + 1,
    };
    app.comments.create(commentData, {type: 'post', url: '/comments'});
    this.model.set('commentsCount', this.model.get('comments').length);
    this.model.save();
    this.$('.add-comment textarea').val('');
    this.render();

  },
  onBeforeRender() {
    this.listenTo(app, 'toggleLabel', this.toggleLabel);
    this.labelView = new LabelCollectionView({collection: app.labels,
                                              card: this.model,
                                              viewType: 'detail'});
    this.comments = app.comments.where(function(comment) {
      if (comment.get('card')) {
        return comment.get('card').get('id') === +this.model.get('id');
      }
    }.bind(this));
    this.commentView = new CommentView({collection: this.comments, cardId: this.model.get('id')});
  },
  onRender: function() {
    if (this.$('ul.labels').length > 0) {
      this.showChildView('labels', this.labelView);
    }
    if (this.comments.length > 0) {
      this.showChildView('comments', this.commentView);
    }
  }
});

module.exports = DetailCardView;
