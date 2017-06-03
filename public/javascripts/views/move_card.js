var moveCardTemplate = require('../../templates/move_card.handlebars');
var MoveCardView = Mn.View.extend({
  tagName: 'section',
  className: 'modal move',
  template: moveCardTemplate,
  events: {
    'change .list-name select': 'setList',
    'click .card-position select': 'setPosition',
    'submit form': 'moveCard',
    'click .close': 'closeMove',
  },
  closeMove:function() {
    this.destroy();
  },
  moveCard: function(e) {
    e.preventDefault();
    var listId = +this.$('.list-name label p').data('id');
    var originListId = +this.card.get('list').get('id');
    var originList = app.lists.findWhere({id: originListId});
    var originPosition = +this.card.get('position');
    var targetList = app.lists.findWhere({id: listId});
    var movedPosition = +this.$('.card-position label p').text();

    if (listId !== originListId) {
      var move = {origin: originList, target: targetList, card: this.card };
      app.activities.trigger('move-card',move);
      //targetlist
      targetList.get('cards').each(function(card) {
        if (+card.get('position') >= movedPosition) {
          card.set('position', +card.get('position') + 1);
        }
      });
      this.card.set('list', listId);
      this.card.set('position', movedPosition);

      //originlist
      originList.get('cards').each(function(card) {
        if(+card.get('position') >= originPosition) {
          card.set('position', +card.get('position') - 1);
        }
      });
      originList.get('cards').sort();
      targetList.get('cards').sort();
    } else {
      if ( originPosition === movedPosition ) {
        return;
      } else {
        var restedList;
        this.card.set('position', movedPosition);
        restedList = targetList.get('cards').reject(function(card) {
          return card.get('id') === this.card.get('id');
        }.bind(this));
        _(restedList).each(function(card) {
          if (movedPosition > originPosition) {
            if (card.get('position') > originPosition && card.get('position') <= movedPosition) {
              card.set('position', +card.get('position') - 1);
            }
          } else if (originPosition > movedPosition) {
            if(card.get('position') >= movedPosition && card.get('position') < originPosition) {
              card.set('position', +card.get('position') + 1);
            }
          }
        });
        targetList.get('cards').sort();
      }

    }
    app.cards.sync('update', app.cards);
    this.closeMove();
    if (this.quickView) {
      this.quickView.destroy();
    }
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
    this.location = options.location;
    this.quickView = options.quickView;
    this.card = options.card;
    this.lists = options.lists.reject(function(list) {
      return list.get('id') === options.card.get('list').get('id');
    }.bind(this));
    var current = options.lists.findWhere(function(list) {
      return list.get('id') === options.card.get('list').get('id');
    });
    var positions = function() {
      var array = [];
      for (var i = 1; i <= current.get('cards').length; i += 1) {
        array.push(i);
      }
      array = _(array).reject(function(position) {
        return position === options.card.get('position');
      });
      return array;
    };
    this.item = {
      lists: this.lists,
      current: current,
      positions: positions(),
      currentPosition: options.card.get('position'),
    };
  },
  onRender: function() {
    this.$el.html(this.template(this.item));
    if (this.location) {
      this.$el.css({
        top: this.location.top + 30,
        left: this.location.left,
      });
    }
  }
});

module.exports = MoveCardView;
