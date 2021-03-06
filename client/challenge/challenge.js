"use strict";

Template.Challenges.helpers({
  challenges: function() {
    return Challenges.find();
  }
});

Template.Challenges.events({
  "click .deleteChallengeLink": Meteor.C.deleteChallengeFn
});

Template.Challenge.events({
  "click #winButton": function() {
    Meteor.call("reportMatchWon", this._id);
    Router.go('/activities/' + this.activity);
  },
  "click #loseButton": function() {
    Meteor.call("reportMatchLost", this._id);
    Router.go('/activities/' + this.activity);
  }
});
