import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { Grids } from '../api/grids.js';

Meteor.methods({
    'book': function(gridId, parkingNumber, startingTime, endingTime, user) {
        var grid = Grids.findOne({_id: gridId });
        var parking = grid.parkings[parkingNumber - 1];
        var bookings = parking.bookings;
        bookings.push({"_id": Random.id(), "user": user, "startingTime": startingTime, "endingTime": endingTime});
    	parking.bookings = bookings;
     	var mParkings = grid.parkings;
        mParkings[parkingNumber - 1] = parking;
        Grids.update({_id: gridId}, {
      		$set: {parkings: mParkings}
    	});
    },

    'updateParking': function(gridId, parkingNumber, taken, user) {
    var grid = Grids.findOne({_id: gridId });
    var parking = grid.parkings[parkingNumber - 1];
    parking.taken = taken;
    var mParkings = grid.parkings;
    mParkings[parkingNumber - 1] = parking;
    Grids.update({_id: gridId}, {
      	$set: {parkings: mParkings}
    });
    },

    checkPassword: function(digest) {
        if (this.userId) {
          var user = Meteor.user();
          var password = {digest: digest, algorithm: 'sha-256'};
          var result = Accounts._checkPassword(user, password);
          return result.error == null;
        } else {
          return false;
        }
    },

    'removeBooking': function(gridId, parkingNumber, bookingIndex) {
        var grid = Grids.findOne({_id: gridId });
        var parking = grid.parkings[parkingNumber - 1];
        var bookings = parking.bookings;
        if (bookingIndex > -1) {
          bookings.splice(bookingIndex, 1);
        }
        parking.bookings = bookings;
        var mParkings = grid.parkings;
        mParkings[parkingNumber - 1] = parking;
        Grids.update({_id: gridId}, {
          $set: {parkings: mParkings}
        });
    }
});
