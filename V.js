Activities = new Meteor.Collection('activities');

if (Meteor.isClient) {
  Meteor.subscribe('activities');

  Template.activitycard.helpers({
    activities: function() {
      return Activities.find();
    },
    count: function() {
      return Activities.find().count();
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
  });

}

Router.route('/', function () {
  this.render('Home');
});
