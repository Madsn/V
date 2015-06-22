Meteor.subscribe('activities');
Meteor.subscribe('players');
Meteor.subscribe('challenges');

Template.registerHelper('equals', function (a, b) {
  return a === b;
});

Template.Activitycards.helpers({
  activities: function() {
    return Activities.find();
  },
  count: function() {
    return Activities.find().count();
  }
});

Template.ActivityDashboard.helpers({
  players: function() {
    return this.players().map(function(document, index){
      document.index = index + 1;
      return document;
    });
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

var deleteChallengeFn = function(event) {
  console.log(event.target);
  var x = Challenges.findOne(event.target.id);
  if (x) {
    Challenges.remove(x._id);
  } else {
    console.error("Challenge with ID " + event.target.id + " not found");
  }
};

Template.Challenges.helpers({
  challenges: function() {
    return Challenges.find(); 
  }
});

Template.Challenges.events({
  "click .deleteChallengeLink": deleteChallengeFn
});

Template.ActivityDashboard.events({
  "click #addMe": function(){
    Meteor.call("addToList", this._id);
  },
  "click #removeMe": function(){
    Meteor.call("removeFromList", this._id);
  },
  "click .challengeLink": function(event){
    Meteor.call("createChallenge", event.target.id, this.activity);
  },
  "click .deleteChallengeLink": deleteChallengeFn
});

Accounts.ui.config({
  passwordSignupFields: "USERNAME_AND_EMAIL"
});