var Card = require('./card');
var CardCollection = require('../collections/cards');
var List = Backbone.RelationalModel.extend({
  relations: [{
    type: Backbone.HasMany,
    key: 'cards',
    relatedModel: Card,
    includeInJSON: false,
    collectionType: CardCollection,
    reverseRelation: {
      key: 'list',
      includeInJSON: 'id'
    }
  }],
  defaults: {
    name: "",
    archived: false,
    position: 1,
  },
});

module.exports = List;
