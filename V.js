Activities = new Meteor.Collection('activities');
Players = new Meteor.Collection('players');
Challenges = new Meteor.Collection('challenges');

Activities.helpers({
  players: function() {
    return Players.find({activity: this._id});
  }
});

Players.helpers({
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
      activity: this.activity
    });
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
  }
});

if (Meteor.isClient) {
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
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    if (Activities.find().count() === 0){
      Activities.insert({
          name: "Pool",
          img: "http://i.imgur.com/JN1Bgld.jpg"
        });
      Activities.insert({
          name: "Tabletennis",
          img: "http://i.imgur.com/iGB9C24.jpg"
        });
      Activities.insert({
          name: "Foosball",
          img: "http://i.imgur.com/pD6PNLE.jpg"
        });
    }
  });

}

Router.route('/', function () {
  this.render('Home');
});

Router.route('/users/playerid/:playerid', function () {
  var player = Players.findOne(this.params.playerid);
  var user = Meteor.users.findOne(player.user);
  this.render('User', {data: user});
});

Router.route('/users/self', function () {
  console.log(Meteor.user());
  this.render('User', {data: Meteor.user()});
});

Router.route('/challenges', function () {
  this.render('Challenges');
});

Router.route('/challenge/:_id/:activity', function () {
  var challenge = Challenges.findOne({
    challenger: Meteor.userId(),
    opponent: this.params._id,
    activity: this.params.activity
  });
  this.render('Challenge', {data: challenge});
});

Router.route('/challenge/:_id', function () {
  var challenge = Challenges.findOne(this.params._id);
  this.render('Challenge', {data: challenge});
});

Router.route('/activities/:_id', function () {
  var activity = Activities.findOne({_id: this.params._id});
  this.render('ActivityDashboard', {data: activity});
});

Router.configure({
    layoutTemplate: 'layout'
});
