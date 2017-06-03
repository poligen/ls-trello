var copyCardTemplate = require('../../templates/copy_card.handlebars');
var CopyCardView = Mn.View.extend({
  tagName: 'section',
  className: 'modal copy',
  template: copyCardTemplate,
  events: {
    'change .list-name select': 'setList',
    'click .card-position select': 'setPosition',
    'submit form': 'copyCard',
    'click .close': 'closeCopy',

  },
  copyCard: function(e) {
    e.preventDefault();
    var copy;
    var checkedLabel = this.$('.labels-comments input[name="labels"]').prop('checked');
    var checkedComment = this.$('.labels-comments input[name="comments"]').prop('checked');
    var copyComments;
    var targetList;
    var targetListId;
    var copyActivity;
    copy = _(this.card).pick('archived','dueDate','description');

    copy.id = app.cards.max(function(card) {return card.id;}).id + 1;
    copy.title = this.$('.card-name textarea').val();

    //trigger activity
    copyActivity = {
      originCard: this.card,
      targetTitle: copy.title,
      listName: this.card.list.get('name'),
    };
    app.activities.trigger('copy-card', copyActivity);

    // check label
    if (checkedLabel) {
      copy.labels = this.card.labels;
    } else {
      copy.labels = "";
    }

    //check comments
    if (checkedComment) {
      copyComments = this.card.comments.map(function(comment) {
        return _.omit(_.clone(comment.attributes),'id', 'card');
      });
      copy.comments = copyComments;
      _(copyComments).each(function(comment) {
        comment.card = copy.id;
        comment.id = app.comments.max(function(comment) {return comment.id;}).id + 1;
      });

      copy.commentsCount = copyComments.length;
    } else {
      copy.comments = "";
    }

    targetListId = +this.$('.list-name label p').data('id');
    copy.list = targetListId;
    copy.position = +this.$('.card-position label p').text();

    targetList = app.lists.findWhere({id: targetListId});
    targetList.get('cards').each(function(card) {
      if ( +card.get('position') >= copy.position ) {
        card.set('position', +card.get('position') + 1);
      }
    });
    targetList.get('cards').sort();
    app.cards.add(copy);
    app.comments.add(copyComments);
    app.cards.sync('update', app.cards);
    app.comments.sync('update', app.comments);
    this.closeCopy();
    if (this.quickView) {
      this.quickView.destroy();
    }
  },
  closeCopy:function() {
    this.destroy();
  },
  setPosition: function(e) {
    var select = this.$(e.target).find('option:selected').val();
    this.$('.card-position label p').text(select);
  },
  setList: function(e) {
    var selectList = this.$(e.target).find('option:selected').val();
    var selectId = this.$(e.target).find('option:selected').data('id');
    this.$('.list-name label p').text(selectList);
    this.$('.list-name label p').data('id', selectId);
    this.triggerMethod('change:position', selectId);
  },
  onChangePosition: function(selectId) {
    var selectedList = app.lists.findWhere({id: selectId});
    var positions = selectedList.get('cards').length + 1;
    var positionArray = [];
    for (var i = 1; i <= positions; i += 1) {
      positionArray.push(i);
    }
    this.triggerMethod('render:position', positionArray);
  },
  onRenderPosition: function(positions) {
    var template = _.template('<% _.each(positions, function(i) { %>  <option value="<%= i %>"><%= i %></option> <% }); %>'
                             );
    this.$('.card-position label p').html(positions.length);
    this.$('.card-position select').html(template({positions: positions}));
  },
  initialize: function(options) {
    var positions;
    this.quickView = options.quickView;
    this.card = options.card.attributes;
    this.lists = options.lists.reject(function(list) {
      return list.get('id') === options.card.get('list').get('id');
    }.bind(this));
    if (options.card.get('labels').length > 0 ) {
      this.card.labelsCount = options.card.get('labels').length;
    }

    if (options.card.get('comments').length > 0 ) {
      this.card.commentsCount = options.card.get('comments').length;
    }

    if (this.card.labelsCount > 0 || this.card.commentsCount > 0) {
      this.card.labelsComments = true;
    }

    positions = function() {
      var array = [];
      for (var i = 1; i <= options.card.get('list').get('cards').length + 1; i += 1) {
        array.push(i);
      }
      array = _(array).reject(function(position) {
        return position === options.card.get('position');
      });
      return array;
    };
    this.card.currentPosition = options.card.get('position'),
    this.card.currentList = options.card.get('list');
    this.card.lists = this.lists;
    this.card.positions = positions();
  },
  onRender: function() {
    this.$el.html(this.template(this.card));
  }
});
module.exports = CopyCardView;
