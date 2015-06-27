Activities = new Meteor.Collection('activities');
Players = new Meteor.Collection('players');
Challenges = new Meteor.Collection('challenges');

Activities.helpers({
  players: () => {
    return Players.find({activity: this._id});
  }
});

Players.helpers({
  getUser: () => {
    return Meteor.users.findOne(this.user);
  },
  getActivity: () => {
    return Activities.findOne({id: this.activity});
  },
  getUsername: () => {
    var user = Meteor.users.findOne({_id: this.user});
    return user ? user.username : "";
  },
  getSentChallenges: () => {
    return Challenges.find({challenger: this._id});
  },
  getReceivedChallenges: () => {
    return Challenges.find({opponent: this._id});
  },
  alreadyChallenged: () => {
    var player = Players.findOne({activity: this.activity, user: Meteor.userId()});
    if (!player) return false;
    return Challenges.findOne({
      challenger: player._id,
      activity: this.activity,
      opponent: this._id
    });
  },
  canBeChallenged: () => {
    var player = Players.findOne({activity: this.activity, user: Meteor.userId()});
    if (!player) return false;
    return player.rank > this.rank && player.rank <= this.rank + 2;
  },
  userParticipatesInActivity: () => {
    var player = Players.findOne({activity: this.activity, user: Meteor.userId()});
    return player ? true : false;
  }
});

Challenges.helpers({
  challengerName: () => {
    var challenger = Players.findOne(this.challenger);
    return challenger ? challenger.getUsername() : "";
  },
  opponentName: () => {
    var opponent = Players.findOne(this.opponent);
    return opponent ? opponent.getUsername() : "";
  },
  getActivity: () => {
    var x = Activities.findOne(this.activity);
    return x;
  },
  getOpponent: () => {
    return Players.findOne(this.opponent);
  },
  getChallenger: () => {
    return Players.findOne(this.challenger);
  }
});
