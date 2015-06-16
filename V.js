if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.activitycard.helpers({
    activities: [
      {
        name: "Pool",
        img: "http://i.imgur.com/JN1Bgld.jpg"
      },
      {
        name: "Tabletennis",
        img: "http://i.imgur.com/iGB9C24.jpg"
      },
      {
        name: "Foosball",
        img: "http://i.imgur.com/pD6PNLE.jpg"
      }
    ]
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
