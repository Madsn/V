Activities = new Meteor.Collection('activities');
Players = new Meteor.Collection('players');

Activities.helpers({
  players: function() {
    return Players.find({activity: this._id});
  }
});

if (Meteor.isClient) {
  Meteor.subscribe('activities');
  Meteor.subscribe('players');
  
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
    }
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
    if (Players.find().count() === 0){
      Players.insert({
          playername: "Rip",
          activity: Activities.findOne({name: "Pool"})._id
        });
      Players.insert({
          playername: "Rap",
          activity: Activities.findOne({name: "Tabletennis"})._id
        });
      Players.insert({
          playername: "Rup",
          activity: Activities.findOne({name: "Foosball"})._id
        });
    }
  });

}

Router.route('/', function () {
  this.render('Home');
});

Router.route('/activities/:_id', function () {
  var activity = Activities.findOne({_id: this.params._id});
  this.render('ActivityDashboard', {data: activity});
});

Router.configure({
    layoutTemplate: 'layout'
});
