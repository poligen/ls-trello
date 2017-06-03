var copyListTemplate = require('../../templates/copy_list.handlebars');
var Card = require('../models/card');
var CopyListView = Mn.View.extend({
  tagName: 'section',
  className: 'copy',
  template: copyListTemplate,
  events: {
    'click textarea': 'typeText',
    'blur textarea': 'stopBlur',
    'click input[type="submit"]':'createNewList',
  },
  stopBlur: function(e) {
    e.stopPropagation();
  },
  typeText: function(e) {
    e.stopPropagation();
  },
  createNewList: function(e) {
    e.preventDefault();
    var lastListId = app.lists.max(function(list) {return list.id;}).id;
    var newName = this.$('dd textarea').val().trim();
    var newList = _.omit(_.clone(this.model.attributes),'name', 'position','id','cards');
    var copyList;
    var copyCards = this.model.get('cards')
        .map(function(card) {
          return _.omit(_.clone(card.attributes),'subscribed','list', 'id');
        });

    var increasedPosition = app.lists.filter(function(list) {
      return list.get('position') > this.model.get('position');
    }.bind(this));

    if (newName) {
      newList.name = newName;
      newList.id = lastListId + 1;
      newList.position = +this.model.get('position') + 1;
    }

    _(increasedPosition).each(function(list) {
      var positionAdded = Number(list.get('position')) + 1;
      list.set('position', positionAdded);
      list.save(positionAdded, {patch: true});
    });

    if (copyCards.length > 0) {
      newList.cards = copyCards;
      _(copyCards).each(function(card) {
        card.list = newList.id;
      });
    }
    $.ajax({
      url: '/lists',
      type: 'post',
      data: JSON.stringify(newList),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function(data) {
        app.lists.add(data);
        app.cards.add(copyCards);
      }
    });
    this.$('span.close').trigger('click');
    e.stopPropagation();
  },
});

module.exports = CopyListView;
