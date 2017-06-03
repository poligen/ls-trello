var commentTemplate = require('../../templates/comment.handlebars');
var CommentView = Mn.View.extend({
  initialize: function(options) {
    this.cardId = options.cardId;
    this.listenTo(app.comments, 'change:content', this.render);
    this.listenTo(app.comments, 'add', this.addNewOne);
  },
  tagName: 'ul',
  className: 'activities',
  template: commentTemplate,
  events: {
    'click footer a.edit': 'editComment',
    'click footer a.delete': 'deleteComment',
    'click a.close': 'closeEdit',
    'click .comment input[type="submit"]': 'changeComment',
  },
  addNewOne: function(model) {
    this.$el.append(this.template({items: [model.attributes]}));
    this.$('form').hide();
  },
  editComment: function(e) {
    e.preventDefault();
    this.$(e.currentTarget).closest('li').find('p').hide();
    this.$(e.currentTarget).closest('li').find('form').show();
  },
  closeEdit: function(e) {
    e.preventDefault();
    this.$(e.currentTarget).closest('li').find('p').show();
    this.$(e.currentTarget).closest('li').find('form').hide();
    e.stopPropagation();
  },
  changeComment: function(e) {
    e.stopPropagation();
    e.preventDefault();
    var currentId = +this.$(e.currentTarget).closest('li').data('id');
    var currentComment = app.comments.findWhere({id: currentId});
    var today = new Date();
    var changeContent = this.$(e.currentTarget).closest('form').find('textarea').val();
    currentComment.set('content', changeContent);
    currentComment.set('date', today.toDateString());
    this.closeEdit(e);
    currentComment.save();
  },
  deleteComment: function(e) {
    e.preventDefault();
    var currentId = +this.$(e.currentTarget).closest('li').data('id');
    var currentComment = app.comments.findWhere({id: currentId});
    currentComment.destroy();
    var currentCard = app.cards.findWhere({id: +this.cardId});
    this.$(e.currentTarget).closest('li').remove();
    currentCard.set('commentsCount', currentCard.get('comments').length);
    currentCard.save();
  },
  onRender: function() {
    this.$('form').hide();
  },
});
module.exports = CommentView;
