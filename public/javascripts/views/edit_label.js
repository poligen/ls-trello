var editLabelTemplate = require('../../templates/edit-label.handlebars');
var ChangeLabelView = require('./change_label');
var EditLabelView = Mn.View.extend({
  tagName: 'section',
  className: 'modal labels-form',
  template: editLabelTemplate,
  events: {
    'click .close': 'closeLabel',
    'click li.label': 'updateLabel',
    'click span.edit': 'changeLabel',
  },

  initialize: function(options) {
    this.collection = app.labels;
    this.card = options.card;
    this.position = options.position;
  },
  closeLabel: function() {
    this.destroy();
  },
  changeLabel: function(e) {
    var currentId = $(e.currentTarget).prev('li').data('id');
    var currentLabel = app.labels.findWhere({id: currentId});
    var edit = this;
    this.changeLabelView = new ChangeLabelView({
      model: currentLabel,
      currentId: currentId,
      edit: edit,
      editOptions: this.options
    });
    this.changeLabelView.render();
    this.$el.addClass('edit-label-form');
    this.$el.removeClass('labels-form');
    this.$el.html(this.changeLabelView.el);
  },
  updateLabel: function(e) {
    var label = e.currentTarget;
    var labelArray = this.card.get('labels') || [];
    if ( $(label).prop('checked') ) {
      $(label).prop('checked', false);
      $(label).find('i').remove();
      this.card.set('labels', _.without(labelArray, $(label).data('id')));
      this.card.save();
    } else {
      $(label).prop('checked', true);
      $(label).append('<i class="material-icons md-18 check">check</i>'); 
      labelArray.push($(label).data('id'));
      this.card.set('labels', labelArray);
      this.card.save();
    }
    app.trigger('toggleLabel', label);
  },
  onRender: function() {
    this.$el.html(this.template({labels: this.collection.models}));
    this.$el.css({
      top: this.position.top + 30,
      left: this.position.left,
    });
  },
  onAttach: function() {
    _(this.$('li.label')).each(function(label) {
      if ( _.contains(this.card.get('labels'), $(label).data('id')) ) {
        $(label).append('<i class="material-icons md-18 check">check</i>'); 
        $(label).prop('checked', true);
      } else {
        $(label).prop('checked', false);
      }
    }.bind(this));
  }
});

module.exports = EditLabelView;
