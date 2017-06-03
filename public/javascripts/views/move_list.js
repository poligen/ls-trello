var moveListTemplate = require('../../templates/move_list.handlebars');
var MoveListView = Mn.View.extend({
  tagName: 'section',
  className: 'move',
  template: moveListTemplate,
  events: {
    "click select": 'setPosition',
    'click form input[type="submit"]': 'movePosition'
  },
  setPosition: function(e) {
    var selectPosition = +this.$(e.currentTarget).val();
    this.$('label p').text(selectPosition);
  },
  movePosition: function(e) {
    e.preventDefault();
    var start = +this.$('label p').text();
    var stop = +this.model.get('position');
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
    this.model.set('position', +this.$('label p').text());
    this.model.save();
    app.lists.sort();
    this.$('span.close').trigger('click');
    e.stopPropagation();
  },
  initialize: function() {
    var positionArray = [];
    for (var i = 1; i <= app.lists.length; i += 1) {
      if (i === this.model.get('position')) {
        positionArray.push({current: i});
      } else {
        positionArray.push({position: i});
      }
    }
    this.model.set('positions', positionArray);
  }
});

module.exports = MoveListView;
