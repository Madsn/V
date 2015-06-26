Activities = new Meteor.Collection('activities');
Players = new Meteor.Collection('players');
Challenges = new Meteor.Collection('challenges');

Activities.helpers({
  players: function() {
    return Players.find({activity: this._id});
  }
});

Players.helpers({
  getUser: function() {
    return Meteor.users.findOne(this.user);
  },
  getActivity: function() {
    return Activities.findOne({id: this.activity});
  },
  getUsername: function() {
    var user = Meteor.users.findOne({_id: this.user});
    return user ? user.username : "";
  },
  getSentChallenges: function() {
    return Challenges.find({challenger: this._id});
  },
  getReceivedChallenges: function() {
    return Challenges.find({opponent: this._id});
  },
  alreadyChallenged: function() {
    var player = Players.findOne({activity: this.activity, user: Meteor.userId()});
    if (!player) return false;
    return Challenges.findOne({
      challenger: player._id,
      activity: this.activity,
      opponent: this._id
    });
  },
  canBeChallenged: function() {
    var player = Players.findOne({activity: this.activity, user: Meteor.userId()});
    if (!player) return false;
    return player.rank > this.rank && player.rank <= this.rank + 2;
  },
  userParticipatesInActivity: function() {
    var player = Players.findOne({activity: this.activity, user: Meteor.userId()});
    return player ? true : false;
  }
});

Challenges.helpers({
  challengerName: function(){
    var challenger = Players.findOne(this.challenger);
    return challenger ? challenger.getUsername() : "";
  },
  opponentName: function(){
    var opponent = Players.findOne(this.opponent);
    return opponent ? opponent.getUsername() : "";
  },
  getActivity: function(){
    var x = Activities.findOne(this.activity);
    return x;
  },
  getOpponent: function() {
    return Players.findOne(this.opponent);
  },
  getChallenger: function() {
    return Players.findOne(this.challenger);
  }
});