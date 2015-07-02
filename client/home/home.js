"use strict";

Template.Activitycards.helpers({
  activities: function() {
    console.log("Fetching activities");
    return Activities.find();
  },
  count: function() {
    return Activities.find().count();
  }
});
