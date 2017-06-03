require('../public/stylesheets/application.css');
require('jquery-ui/themes/base/all.css');


var Lists = require('./javascripts/collections/lists');
var Cards = require('./javascripts/collections/cards');
var Labels = require('./javascripts/collections/labels');

var Comments = require('./javascripts/collections/comments');

var Activities = require('./javascripts/collections/activities');

var Notifications = require('./javascripts/collections/notifications');

var BoardView = require('./javascripts/views/board');
var App = Mn.Application.extend({
  region: 'body',
  bindEvents: function() {
    _.extend(this, Bb.Events);
    this.on('update-list-position', this.updateList);
    this.on('update-card-position', this.updateCard);
    this.listenTo(this.activities, 'add', this.reduceActivities);
  },
  initialize: function() {
    this.lists = new Lists();
    this.cards = new Cards();
    this.labels = new Labels();
    this.comments = new Comments();
    this.activities = new Activities();
    this.notifications = new Notifications();
    this.bindEvents();
  },
  reduceActivities: function() {
    if (this.activities.length > 20) {
      var firstAct = this.activities.min(function(act) {return act.id; });
      console.log(firstAct);
      firstAct.destroy();
    }
  },
  updateCard: function(ui) {
    var currentCard = app.cards.findWhere({id: ui.item.data('id')});
    // start to sort position of cards

    var listId = ui.item.closest('li.list').data('id');
    var originListId = currentCard.get('list').get('id');
    var originList = app.lists.findWhere({id: originListId});
    var originPosition = currentCard.get('position');
    var targetList = app.lists.findWhere({id: listId});
    var movedPosition = ui.item.index() + 1;

    if (listId !== originListId) {
      var move = {origin: originList, target: targetList, card: currentCard };
      app.activities.trigger('move-card',move);
      //targetlist
      targetList.get('cards').each(function(card) {
        if (+card.get('position') >= movedPosition) {
          card.set('position', +card.get('position') + 1);
        }
      });
      currentCard.set('list', listId);
      currentCard.set('position', movedPosition);

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
        currentCard.set('position', movedPosition);
        restedList = targetList.get('cards').reject(function(card) {
          return card.get('id') === currentCard.get('id');
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

  },
  updateList: function(ui) {
    var listId = $(ui.item).data('id');
    var newPosition = $(ui.item).index() + 1;
    var currentList = app.lists.findWhere({id: listId});


    // start to sort position
    var start = newPosition;
    var stop = +currentList.get('position');
    var rangeArray;
    var changePosition;
    if (stop > start) {
      rangeArray = _.range(start, stop);
      changePosition = app.lists.filter(function(list) {
        return _.contains(rangeArray, list.get('position'));
      });
      _(changePosition).each(function(list) {
        list.set('position', Number(list.get('position')) + 1);
        list.save();
      });
    } else {
      rangeArray = _.range(stop+1, start+1);
      changePosition = app.lists.filter(function(list) {
        return _.contains(rangeArray, list.get('position'));
      });
      _(changePosition).each(function(list) {
        list.set('position', Number(list.get('position')) - 1);
        list.save();
      });
    }

    currentList.set('position', newPosition);
    currentList.save();
    app.lists.sort();
  },
  onBeforeStart: function() {
    this.cards.fetch();
    this.lists.fetch();
    this.labels.fetch();
    this.comments.fetch();
    this.activities.fetch();
    this.notifications.fetch();
    this.board = new BoardView({collection: this.lists});
  },
  onStart: function() {
    this.board.onRender();
  }
});

// start app
window.app = new App();
app.start();
