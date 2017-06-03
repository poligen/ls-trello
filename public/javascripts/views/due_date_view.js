var dueDateTemplate = require('../../templates/due_date.handlebars');
var datepicker = require('jquery-ui/ui/widgets/datepicker');
var DueDateView = Mn.View.extend({
  tagName: 'section',
  className: 'modal due-date-form',
  template: dueDateTemplate,
  initialize: function(options) {
    this.card = options.card;
    this.position = options.position;
  },
  events: {
    'change .datepicker': 'changeDate',
    'click .form-controls input[value="Save"]': 'saveDate',
    'click .form-controls input.remove': 'removeDueDate',
    'click .close': 'closeDue',
  },
  changeDate: function() {
    var dateValue = $.datepicker.formatDate("mm/dd/yy", this.$('.datepicker').datepicker("getDate"));
    this.$('input[type="text"]').val(dateValue);
  },
  saveDate: function(e) {
    e.preventDefault();
    var dueDate = this.$('input[type="text"]').val() + " "+ this.$('input[type="time"]').val();
    if (this.card.get('dueDate') !== '') {
      app.activities.trigger('change-due-date', this.card);
    }
    this.card.set('dueDate', dueDate);
    this.card.save();
    this.closeDue(e);
    e.stopPropagation();
  },
  removeDueDate: function(e) {
    e.preventDefault();
    this.card.set('dueDate', '');
    this.card.save();
    app.activities.trigger('remove-due-date', this.card);
    this.closeDue(e);
    e.stopPropagation();
  },
  onRender: function() {
    this.$el.css({
      top: this.position.top + 30,
      left: this.position.left,
    });
  },
  closeDue: function(e) {
    this.destroy();
    e.stopPropagation();
  },

  onAttach: function() {
    var dateValue;
    this.$('.datepicker').datepicker();
    dateValue = $.datepicker.formatDate("mm/dd/yy", this.$('.datepicker').datepicker("getDate"));
    this.$('input[type="text"]').val(dateValue);
  },
});


module.exports = DueDateView;
