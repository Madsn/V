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
  }
});

Challenges.helpers({
  challengerName: function(){
    var challenger = Meteor.users.findOne(this.challenger);
    return challenger ? challenger.username : "";
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
    }
  });
  
  Template.Challenges.helpers({
    challenges: function() {
      return Challenges.find(); 
    }
  });
  
  Template.ActivityDashboard.events({
    "click #addMe": function(){
      Players.insert({
        activity: this._id,
        user: Meteor.userId()
      });
    },
    "click #removeMe": function(){
      var x = Players.findOne({activity: this._id, user: Meteor.userId()});
      Players.remove(x._id);
    },
    "click .challengeLink": function(event){
      var x = {
        activity: this.activity,
        challenger: Meteor.userId(),
        opponent: event.target.id 
      };
      Challenges.insert(x);
    }
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

Router.route('/challenges', function () {
  this.render('Challenges');
});

Router.route('/activities/:_id', function () {
  var activity = Activities.findOne({_id: this.params._id});
  this.render('ActivityDashboard', {data: activity});
});

Router.configure({
    layoutTemplate: 'layout'
});
