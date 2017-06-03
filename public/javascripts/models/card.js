var Comment = require('./comment');
var CommentCollection = require('../collections/comments');
var Activity = require('./activity');
var ActivityCollection = require('../collections/activities');
var Card = Backbone.RelationalModel.extend({
  defaults: {
    archived: false,
    position: 1,
    dueDate: "",
    labels: "",
    comments: "",
    commentsCount: "",
    subscribed: false,
    description: "",
  },
  relations: [
    {
    type: Backbone.HasMany,
    key: 'comments',
    relatedModel: Comment,
    includeInJSON: false,
    collectionType: CommentCollection,
    reverseRelation: {
      key: 'card',
      includeInJSON: 'id'
    }
  },
    {
      type: Backbone.HasMany,
      key: 'activities',
      relatedModel: Activity,
      includeInJSON: false,
      collectionType: ActivityCollection,
      reverseRelation: {
        key: 'card',
        includeInJSON: 'id'
      }
    }
  ],
});

module.exports = Card;
