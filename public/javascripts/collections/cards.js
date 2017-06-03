var Card = require('../models/card');
var Cards = Bb.Collection.extend({
  url: '/cards',
  model: Card,
  comparator: 'position',
});

module.exports = Cards;
