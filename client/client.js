Meteor.subscribe('activities');
Meteor.subscribe('players');
Meteor.subscribe('challenges');

var deleteChallengeFn = function(event) {
  Meteor.call("deleteChallenge", event.target.id);
};

Accounts.ui.config({
  passwordSignupFields: "USERNAME_AND_EMAIL"
});
