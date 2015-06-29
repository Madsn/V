Meteor.subscribe('activities');
Meteor.subscribe('players');
Meteor.subscribe('challenges');

Template.Activitycards.helpers({
  activities: () => {
    console.log("Fetching activities");
    return Activities.find();
  },
  count: () => {
    return Activities.find().count();
  }
});

Template.ActivityDashboard.helpers({
  players: () => {
    return Players.find({activity: this._id}, {sort: {rank: 1}});
  },
  userInPlayersList: () => {
    var x = Players.findOne({
      activity: this._id,
      user: Meteor.userId()
    });
    return x ? true : false;
  },
  getChallengeId: () => {
    var player = Players.findOne({user: Meteor.userId(), activity: this.activity});
    return Challenges.findOne({
      opponent: this._id,
      activity: this.activity,
      challenger: player._id
    })._id;
  },
  getRowClass: () => {
    if (Meteor.userId() === this.user) {
      return "info";
    }
    return "";
  }
});

var deleteChallengeFn = (event) => {
  Meteor.call("deleteChallenge", event.target.id);
};

Template.Challenges.helpers({
  challenges: () => {
    return Challenges.find();
  }
});

Template.Challenges.events({
  "click .deleteChallengeLink": deleteChallengeFn
});

Template.Challenge.events({
  "click #winButton": () => {
    Meteor.call("reportMatchWon", this._id);
    Router.go('/activities/' + this.activity);
  },
  "click #loseButton": () => {
    Meteor.call("reportMatchLost", this._id);
    Router.go('/activities/' + this.activity);
  }
});

Template.ActivityDashboard.events({
  "click #addMe": () => {
    Meteor.call("addToList", this._id);
  },
  "click #removeMe": () => {
    Meteor.call("removeFromList", this._id);
  },
  "click .challengeLink": (event) => {
    Meteor.call("createChallenge", event.target.id, this.activity);
  },
  "click .deleteChallengeLink": deleteChallengeFn
});

Accounts.ui.config({
  passwordSignupFields: "USERNAME_AND_EMAIL"
});
