var Notification = require('../models/notification');
var Notifications = Bb.Collection.extend({
  url: '/notifications',
  model: Notification,
  comparator: function(notification) {
    return -notification.get('id');
  },
  archiveCard: function(card) {
    this.unsubscribeCard(card);
  },
  unsubscribeCard: function(card) {
    var remains = this.reject(function(notification) {
      var array = [];
      for (var i in notification.attributes) {
        array.push(notification.attributes[i])
      }
      return array[0].card === card.get('id');
    }.bind(this));
    app.notifications.set(remains);
    app.notifications.sort();
    app.notifications.sync('update', app.notifications);
  },
  initialize: function() {
    this.on('archive-card', this.archiveCard);
    this.on('unsubscribed', this.unsubscribeCard);
  }
});

module.exports = Notifications;
