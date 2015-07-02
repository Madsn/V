// "use strict"; // can't be enabled in this file.

Activities = new Meteor.Collection('activities');
Players = new Meteor.Collection('players');
Challenges = new Meteor.Collection('challenges');

Activities.attachSchema(new SimpleSchema({
  name: {
    type: String
  },
  img: {
    type: String
  }
}));

Players.attachSchema(new SimpleSchema({
  activity: {
    type: String
  },
  rank: {
    type: Number
  },
  user: {
    type: String
  }
}));

Challenges.attachSchema(new SimpleSchema({
  activity: {
    type: String
  },
  challenger: {
    type: String
  },
  opponent: {
    type: String
  }
}));
