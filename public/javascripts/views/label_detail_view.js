var labelTemplate = _.template("<%= name %>");
var LabelDetailView = Mn.View.extend({
  initialize: function(options) {
    this.viewType = options.viewType;
  },
  attributes: function() {
    return {
      'data-id': this.model.get('id'),
    };
  },
  tagName: 'li',
  className: 'label',
  template: labelTemplate,
  onRender: function() {
    this.$el.css({
      'background': this.model.get('color'),
    });
  },
});

module.exports = LabelDetailView;
