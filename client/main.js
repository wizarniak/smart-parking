import '../imports/startup/accounts-config.js';
import '../imports/ui/body.js';

import './../imports/api/methods.js';

import { Meteor } from 'meteor/meteor';

import { Grids } from './../imports/api/grids.js';

FlowRouter.route('/', {
  name: 'Home',
  action() {
    BlazeLayout.render('App_body', {content: 'home'});
  }
});

FlowRouter.route('/grids/:_id', {
  name: 'Grids.show',
  action(params, queryParams) {
    BlazeLayout.render('App_body', {content: 'parking'});
  }
});

FlowRouter.route('/grids/:_id/:number', {
  name: 'Book-old',
  action(params, queryParams) {
    BlazeLayout.render('App_body', {content: 'booking'});
  }
});

FlowRouter.route('/grids/:_id/:number/update/:taken', {
  name: 'UpdateParking',
  action(params, queryParams) {
    console.log(params._id);
    Meteor.call("updateParking", params._id, params.number, params.taken == "true", Meteor.userId());
  }
});

FlowRouter.route('/profile', {
  name: 'Profile',
  action() {
    BlazeLayout.render('App_body', {content: 'profile'});
  }
});

FlowRouter.route('/book/:_id', {
  name: 'Book',
  action(params, queryParams) {
    BlazeLayout.render('App_body', {content: 'book'})
  }
});
