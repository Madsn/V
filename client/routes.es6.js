Router.route('/', function() {
  this.render('Home');
});

Router.route('/users/playerid/:playerid', function() {
  var player = Players.findOne(this.params.playerid);
  var user = Meteor.users.findOne(player.user);
  this.render('User', {data: user});
});

Router.route('/users/self', function() {
  console.log(Meteor.user());
  this.render('User', {data: Meteor.user()});
});

Router.route('/challenges', function() {
  this.render('Challenges');
});

Router.route('/challenge/:_id/:activity', function() {
  var challenge = Challenges.findOne({
    challenger: Meteor.userId(),
    opponent: this.params._id,
    activity: this.params.activity
  });
  this.render('Challenge', {data: challenge});
});

Router.route('/challenge/:_id', function() {
  var challenge = Challenges.findOne(this.params._id);
  this.render('Challenge', {data: challenge});
});

Router.route('/activities/:_id', function() {
  var activity = Activities.findOne({_id: this.params._id});
  this.render('ActivityDashboard', {data: activity});
});

Router.configure({
    layoutTemplate: 'layout'
});