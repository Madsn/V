Activities = new Meteor.Collection('activities');
Players = new Meteor.Collection('players');

Activities.helpers({
  players: function() {
    return Players.find({activity: this._id});
  }
});

Players.helpers({
  getActivity: function() {
    return Activities.findOne({id: this.activity});
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
    },
    userInPlayersList: function() {
      var x = Players.findOne({
        activity:this._id, 
        user: Meteor.userId()
      });
      return x ? true : false;
    }
  });
  
  Template.ActivityDashboard.events({
    "click #addMe": function(){
      Players.insert({
        playername: "foo",
        activity: this._id,
        user: Meteor.userId()
      });
    },
    "click #removeMe": function(){
      var x = Players.findOne({activity: this._id, user: Meteor.userId()});
      Players.remove(x._id);
    }
  })
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

Router.route('/activities/:_id', function () {
  var activity = Activities.findOne({_id: this.params._id});
  this.render('ActivityDashboard', {data: activity});
});

Router.configure({
    layoutTemplate: 'layout'
});
