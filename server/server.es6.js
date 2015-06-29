var updateRanks = (challengeId, currentUserWon) => {
  var challenge = Challenges.findOne(challengeId);
  var challenger = challenge.getChallenger();
  var opponent = challenge.getOpponent();
  if (!Meteor.userId() ||
      !(opponent.user === Meteor.userId() ||
      challenger.user === Meteor.userId())) {
    throw new Meteor.Error("not-authorized");
  }
  var winner;
  var loser;
  if ((opponent.user === Meteor.userId() && currentUserWon) ||
      challenger.user === Meteor.userId() && !currentUserWon) {
    winner = opponent;
    loser = challenger;
  } else {
    winner = challenger;
    loser = opponent;
  }
  if (winner.rank < loser.rank) {
    return;
  }
  Players.find({activity: winner.activity,
                $and: [{rank: {$gte: loser.rank}},
                {rank: {$lt: winner.rank}}]})
              .forEach((doc) => {
    Players.update(doc._id, {$set: {rank: doc.rank + 1}});
  });
  Players.update(winner._id, {$set: {rank: loser.rank}});
};

Meteor.methods({
  removeFromList: (activityId) => {
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
    Players.find({activity: player.activity,
                  rank: {$gt: player.rank}}).forEach((doc) => {
      Players.update(doc._id, {$set: {rank: doc.rank - 1}});
    });
  },
  addToList: (activityId) => {
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
  createChallenge: (opponentId, activityId) => {
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
  deleteChallenge: (challengeId) => {
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
  },
  reportMatchWon: (challengeId) => {
    updateRanks(challengeId, true);
    var challenge = Challenges.findOne(challengeId);
    Challenges.remove(challengeId);
  },
  reportMatchLost: (challengeId) => {
    updateRanks(challengeId, false);
    Challenges.remove(challengeId);
  }
});