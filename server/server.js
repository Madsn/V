Meteor.methods({
  removeFromList: function (activityId) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    var player = Players.findOne({
      activity: activityId,
      user: Meteor.userId()
    });
    Challenges.remove({
      $or: [{challenger: player._id}, {opponent: player._id}],
      activity: player.activity
    });
    Players.remove(player._id);
    var players = Players.find({rank: {$gt: player.rank}}).fetch();
    for (var i in players) {
      Players.update(players[i]._id, {$set: {rank: players[i].rank - 1}});
    }
  },
  addToList: function(activityId) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    var rank = Players.find({activity: activityId}).count();
    Players.insert({
      rank: rank + 1,
      activity: activityId,
      user: Meteor.userId()
    });
  },
  createChallenge: function(opponentId, activityId) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    var player = Players.findOne({
      user: Meteor.userId(), 
      activity: activityId
    });
    Challenges.insert({ 
      activity: activityId,
      challenger: player._id,
      opponent: opponentId 
    });
  },
  deleteChallenge: function(challengeId) {
    var challenge = Challenges.findOne(challengeId);
    var player = Players.findOne({
      activity: challenge.activity,
      user: Meteor.userId()
    });
    if (!player || !challenge ||
       player._id !== challenge.challenger) {
      throw new Meteor.Error("not-authorized");
    }
    Challenges.remove(challenge._id);
  }
});
