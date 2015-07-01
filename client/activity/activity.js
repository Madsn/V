Template.ActivityDashboard.helpers({
  players: function() {
    return Players.find({activity: this._id}, {sort: {rank: 1}});
  },
  userInPlayersList: function() {
    var x = Players.findOne({
      activity: this._id,
      user: Meteor.userId()
    });
    return x ? true : false;
  },
  getChallengeId: function() {
    var player = Players.findOne({user: Meteor.userId(), activity: this.activity});
    return Challenges.findOne({
      opponent: this._id,
      activity: this.activity,
      challenger: player._id
    })._id;
  },
  getRowClass: function() {
    if (Meteor.userId() === this.user) {
      return "info";
    }
    return "";
  }
});

Template.ActivityDashboard.events({
  "click #addMe": function(){
    Meteor.call("addToList", this._id);
  },
  "click #removeMe": function() {
    Meteor.call("removeFromList", this._id);
  },
  "click .challengeLink": function(event) {
    Meteor.call("createChallenge", event.target.id, this.activity);
  },
  "click .deleteChallengeLink": deleteChallengeFn
});
