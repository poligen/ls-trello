var Comment = require('../models/comment');
var Comments = Bb.Collection.extend({
  url: '/comments',
  model: Comment,
});

module.exports = Comments;

