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
  } else {
    console.log("No activities added");
  }
});
