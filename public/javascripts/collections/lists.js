var List = require('../models/list');

var Lists = Bb.Collection.extend({
  model: List,
  url: '/lists',
  comparator: 'position',
});

module.exports = Lists;
