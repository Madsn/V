"use strict";

Meteor.C = {
  deleteChallengeFn: function(event) {
    Meteor.call("deleteChallenge", event.target.id);
  }
}


Meteor.subscribe('activities');
Meteor.subscribe('players');
Meteor.subscribe('challenges');

Accounts.ui.config({
  passwordSignupFields: "USERNAME_AND_EMAIL"
});
