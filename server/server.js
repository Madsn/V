Meteor.startup(function () {
// code to run on server at startup
if (Meteor.users.find().count() === 0){
  Accounts.createUser({
    username: "user1",
    email : "user1@example.com",
    password : "123456",
    profile  : {
    }
  });
  Accounts.createUser({
    username: "user2",
    email : "user2@example.com",
    password : "123456",
    profile  : {
    }
  });
  Accounts.createUser({
    username: "user3",
    email : "user3@example.com",
    password : "123456",
    profile  : {
    }
  });
} else {
  console.log("No users added");
}
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

Meteor.methods({
  removeFromList: function (activityId) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    var player = Players.findOne({
      activity: activityId,
      user: Meteor.userId()
    });
    Challenges.remove({
      $or: [{challenger: player._id}, {opponent: player._id}],
      activity: player.activity
    });
    Players.remove(player._id);
  },
  addToList: function(activityId) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Players.insert({
      activity: activityId,
      user: Meteor.userId()
    });
  }
});