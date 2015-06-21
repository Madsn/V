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
    Players.insert({
      activity: this._id,
      user: Meteor.userId()
    });
  },
  "click #removeMe": function(){
    var x = Players.findOne({
      activity: this._id,
      user: Meteor.userId()
    });
    var chal = Challenges.find({
      challenger: x._id, 
      activity: x.activity
    }).fetch();
    for (var i in chal) {
      Challenges.remove(chal[i]._id);
    }
    Players.remove(x._id);
  },
  "click .challengeLink": function(event){
    var player = Players.findOne({
      activity: this.activity,
      user: Meteor.userId()
    });
    var x = {
      activity: this.activity,
      challenger: player._id,
      opponent: event.target.id
    };
    Challenges.insert(x);
  },
  "click .deleteChallengeLink": deleteChallengeFn
})

Accounts.ui.config({
  passwordSignupFields: "USERNAME_AND_EMAIL"
});