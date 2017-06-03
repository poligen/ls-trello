var Activity = require('../models/activity');
var Activities = Bb.Collection.extend({
  url: '/activities',
  model: Activity,
  comparator: function(activity) {
    return -activity.get('id');
  },
  getLastId: function() {
    return app.activities.max(function(act) {return act.id;}).id || 0;
  },
  createNewActivity: function(data) {
    this.create(data, {type: 'post', url: '/activities'});
    this.sort();
  },
  createNewCard: function(newcard) {
    var today = new Date();
    var data = {
      add: {
        cardName: newcard.get('title'),
        card: newcard.get('id'),
        listName: newcard.get('list').get('name'),
        date: today.toDateString(),
      },
      id:this.getLastId() + 1,
    };
    this.createNewActivity(data);
  },
  changeDueDate: function(card) {
    var today = new Date();
    var data = {
      change_due: {
        cardName: card.get('title'),
        due: card.get('dueDate'),
        card: card.get('id'),
        date: today.toDateString(),
      },
      id:this.getLastId() + 1,
    };
    this.createNewActivity(data);
    this.sendToNotif(data, 'change_due');
  },
  removeDueDate: function(card) {
    var today = new Date();
    var data = {
      remove_due: {
        cardName: card.get('title'),
        card: card.get('id'),
        date: today.toDateString(),
      },
      id:this.getLastId() + 1,
    };
    this.createNewActivity(data);
    this.sendToNotif(data, 'remove_due');
  },
  archiveCard: function(card) {
    var today = new Date();
    var data = {
      archive: {
        cardName: card.get('title'),
        card: card.get('id'),
        date: today.toDateString(),
      },

      id:this.getLastId() + 1,
    };
    this.createNewActivity(data);
  },
  moveCard: function(move) {
    var today = new Date();
    var data = {
      move: {
        originList: move.origin.get('name'),
        targetList: move.target.get('name'),
        card: move.card.get('id'),
        cardName: move.card.get('title'),
        date: today.toDateString(),
      },
      id:this.getLastId() + 1,
    };
    this.createNewActivity(data);
    this.sendToNotif(data, 'move');
  },
  copyCard: function(copy) {
    var today = new Date();
    var data = {
      copy: {
        originTitle: copy.originCard.title,
        targetTitle: copy.targetTitle,
        listName: copy.listName,
        card: copy.originCard.id,
      },
      id:this.getLastId() + 1,
    };
    this.createNewActivity(data);
    this.sendToNotif(data, 'copy');
  },
  sendToNotif: function(data, action) {
    var object = data[action];
    var notifLastId = app.notifications.max(function(notif) {return notif.id;}).id || 0;
    data.id = notifLastId + 1;
    var cardId = object.card;
    var currentCard = app.cards.findWhere(function(card) {
      return card.get('id') === cardId;
    });

    if (currentCard.get('subscribed')) {
      app.notifications.create(data, {type: 'post', url:'/notifications'});
      app.notifications.sort();
    }
    this.sort();
  },
  initialize: function() {
    this.on('create-new-card', this.createNewCard);
    this.on('change-due-date', this.changeDueDate);
    this.on('remove-due-date', this.removeDueDate);
    this.on('archive-card', this.archiveCard);
    this.on('move-card', this.moveCard);
    this.on('copy-card', this.copyCard);
  }
});

module.exports = Activities;
