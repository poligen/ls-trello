var notificationTemplate = require('../../templates/notification.handlebars');
var NotificationView = Mn.View.extend({
  tagName: 'section',
  className: 'modal',
  template: notificationTemplate,
  events: {
    'click span.close': 'closeNotification',
  },
  toggleNotification: function(e) {
    e.preventDefault();
  },
  closeNotification:function(e) {
    this.destroy();
  },
  initialize: function(options) {
    this.collection = options.collection;
    this.listenTo(app.notifications,'add', this.render);
    this.listenTo(app.notifications,'update', this.render);
  },
});

module.exports = NotificationView;
