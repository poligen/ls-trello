var changeLabelTemplate = require('../../templates/change_label.handlebars');
var ChangeLabelView = Mn.View.extend({
  template: changeLabelTemplate,
  events: {
    'click form input[type="submit"]': 'updateLabel',
    'click span.close': 'renderEditLabel',
  },
  initialize: function(options) {
    this.currentId = options.currentId;
    this.edit = options.edit;
    this.editOptions = options.editOptions;
  },
  updateLabel: function(e) {
    e.preventDefault();
    var changeName = this.$('label input[type="text"]').val();
    var currentLabel = app.labels.findWhere({id: this.currentId});
    currentLabel.set('name', changeName);
    currentLabel.save();
    app.trigger('toggleLabel');
    this.renderEditLabel();
  },
  renderEditLabel: function(e) {
    this.edit.onRender(this.editOptions);
    this.$('section.modal').removeClass('edit-label-form');
    this.$('section.modal').addClass('labels-form');
    this.edit.onAttach();
  },
});

module.exports = ChangeLabelView;
