var express = require('express');
var router = express.Router();
var path = require('path');
var _ = require('underscore');

var ParseFile = require(path.resolve(path.dirname(__dirname), "modules/parse"));

var listsData = Object.create(ParseFile).initialize('data/lists.json');
var cardsData = Object.create(ParseFile).initialize('data/cards.json');
var commentsData = Object.create(ParseFile).initialize('data/comments.json');
var noticsData = Object.create(ParseFile).initialize('data/notifications.json');
var activitiesData = Object.create(ParseFile).initialize('data/activities.json');
var labelsData = Object.create(ParseFile).initialize('data/labels.json');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    lists: listsData.get(),
    cards: cardsData.get(),
    lables: labelsData.get(),
    activities: activitiesData.get(),
    notifications: noticsData.get(),
    comments: commentsData.get(),

  });
});

//lists
router.route('/lists/last').get(function(req, res) {
  res.json(listsData.getLastId());
});

router.route('/lists')
  .get(function(req, res) {
    res.json(listsData.get());
  })
  .post(function(req, res) {
    var list = req.body;
    var lists = listsData.get();
    var onlyList = {};

    for (var key in list) {
      if (key !== "cards") {
        onlyList[key] = list[key];
      }
    }

    list.id = onlyList.id = Number(req.body.id);
    // res.json(list);
    if (req.body.cards) {
      var cards = cardsData.get();
      var count = 0;
      for (var i = 0; i < req.body.cards.length; i += 1) {
        var card = req.body.cards[i];
        count += 1;
        card.id = cardsData.getLastId() + count;
        cards.push(card);
      }
      cardsData.set(cards);
    }

    lists.push(onlyList);
    listsData.set(lists);
    res.json(onlyList);
  }).put(function(req, res) {
    var newLists = req.body;
    listsData.set(newLists);
    newLists.lastId = listsData.getLastId();
    res.json(newLists);
  });

router.route('/lists/:id')
  .put(function(req, res, next) {
    var lists = listsData.get();
    var listId = Number(req.params.id);
    var current_list = _(lists).findWhere({id: listId});
    _.extend(current_list, req.body);
    current_list.id = listId;
    lists.id = listsData.getLastId();
    listsData.set(lists);
    res.json(current_list);
  })
  .delete(function(req, res) {
    var lists = _(listsData.get()).reject(function(item) {
      return item.id === +req.params.id;
    });
    listsData.set(lists);
    res.status(200).end();
  });

//cards
router.route('/cards')
  .get(function(req, res) {
    res.json(cardsData.get());
  })
  .post(function(req, res) {

    var card = req.body;
    var cards = cardsData.get();
    card.id = Number(req.body.id);
    cards.push(card);
    cardsData.set(cards);
    // res.json(card);
  })
  .put(function(req, res) {
    var cards = req.body;
    cards.lastId = cardsData.getLastId();
    cardsData.set(cards);
    res.json(cards);
  });

router.route('/cards/:id')
  .put(function(req, res, next) {
    var cards = cardsData.get();
    var current_card = _(cards).findWhere({id: +req.body.id});
    _.extend(current_card, req.body);
    cardsData.set(cards);
    res.json(current_card);
  })
  .delete(function(req, res) {
    var cards = _(cardsData.get()).reject(function(item) {
      return item.id === +req.params.id;
    });
    cardsData.set(cards);
    res.status(200).end();
  });


//labels
router.route('/labels')
  .get(function(req, res) {
    res.json(labelsData.get());
  });

router.route('/labels/:id')
  .put(function(req, res, next) {
    var labels = labelsData.get();
    var current_label = _(labels).findWhere({id: +req.body.id});
    _.extend(current_label, req.body);
    labelsData.set(labels);
    res.json(current_label);
  });

//comments
router.route('/comments')
  .get(function(req, res) {
    res.json(commentsData.get());
  })
  .post(function(req, res) {
    var comment = req.body;
    var comments = commentsData.get();
    comment.id = Number(req.body.id);
    comments.push(comment);
    commentsData.set(comments);
    // res.json(card);
  })
  .put(function(req, res) {
    var comments = req.body;
    comments.lastId = commentsData.getLastId();
    commentsData.set(comments);
    res.json(comments);
  });

router.route('/comments/:id')
  .put(function(req, res, next) {
    var comments = commentsData.get();
    var current_comment = _(comments).findWhere({id: +req.body.id});
    _.extend(current_comment, req.body);
    commentsData.set(comments);
    res.json(current_comment);
  })
  .delete(function(req, res) {
    var comments = _(commentsData.get()).reject(function(item) {
      return item.id === +req.params.id;
    });
    commentsData.set(comments);
    res.status(200).end();
  });

//activities
router.route('/activities')
  .get(function(req, res) {
    res.json(activitiesData.get());
  })
  .post(function(req, res) {
    var activity = req.body;
    var activities = activitiesData.get();
    activity.id = Number(req.body.id);
    activities.push(activity);
    activitiesData.set(activities);
  });

router.route('/activities/:id')
  .put(function(req, res, next) {
    var activities = activitiesData.get();
    var current_activity = _(activities).findWhere({id: +req.body.id});
    _.extend(current_activity, req.body);
    activitiesData.set(activities);
    res.json(current_activity);
  })
  .delete(function(req, res) {
    var activities = _(activitiesData.get()).reject(function(item) {
      return item.id === +req.params.id;
    });
    activitiesData.set(activities);
    res.status(200).end();
  });


//notifications
router.route('/notifications')
  .get(function(req, res) {
    res.json(noticsData.get());
  })
  .post(function(req, res) {
    var notic = req.body;
    var notifications = noticsData.get();
    notic.id = Number(req.body.id);
    notifications.push(notic);
    noticsData.set(notifications);
  })
  .put(function(req, res) {
    var notic = req.body;
    noticsData.set(notic);
    notic.lastId = noticsData.getLastId();
    res.json(notic);
  });

router.route('/notifications/:id')
  .put(function(req, res, next) {
    var notifications = noticsData.get();
    var current_notic = _(notifications).findWhere({id: +req.body.id});
    _.extend(current_notic, req.body);
    noticsData.set(notifications);
    res.json(current_notic);
  })
  .delete(function(req, res) {
    var notifications = _(noticsData.get()).reject(function(item) {
      return item.id === +req.params.id;
    });
    noticsData.set(notifications);
    res.status(200).end();
  });



module.exports = router;
