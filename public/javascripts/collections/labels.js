var Label = require('../models/label');
var Labels = Bb.Collection.extend({
  model: Label,
  url: '/labels',
});

module.exports = Labels;
