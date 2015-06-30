Activities = new orion.collection('activities', {
  singularName: 'activity',
  pluralName: 'activities',
  link: {
    title: 'Activities'
  },
  tabular: {
    columns: [
      { data: "name", title: "Name" }
    ]
  }
});
Players = new orion.collection('players', {
  singularName: 'player',
  pluralName: 'players',
  link: {
    title: 'Players'
  },
  tabular: {
    columns: [
      { data: "activity", title: "Activity" },
      { data: "rank", title: "Rank" },
      { data: "user", title: "User" }
    ]
  }
});
Challenges = new orion.collection('challenges', {
  singularName: 'challenge',
  pluralName: 'challenges',
  link: {
    title: 'Challenges'
  },
  tabular: {
    columns: [
      { data: "challenger", title: "Challenger" },
      { data: "opponent", title: "Opponent" },
      { data: "activity", title: "Activity" },
      orion.attributeColumn('createdAt', 'createdAt', 'Created At')
    ]
  }
});

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
  },
  createdAt: orion.attribute('createdAt')
}));
