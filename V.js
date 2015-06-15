if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.activitycard.helpers({
    activities: [
      {
        name: "Pool"
      },
      {
        name: "Bordtennis"
      },
      {
        name: "Bowling"
      }
    ]
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
