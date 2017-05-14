import { Mongo } from 'meteor/mongo';
 
export const Grids = new Mongo.Collection('grids');

if (Grids.find().count() == 0) {
	Grids.insert(
		{ "name" : "Demo Parking", "width" : 7, "height" : 6, "parkings" : 
		[ { "number": 1, "x" : 0, "y" : 0, "width" : 1, "height" : 2, "taken" : false, "bookings": [] }, 
		{ "number": 2, "x" : 2, "y" : 0, "width" : 1, "height" : 2, "taken" : false, "bookings": [] }, 
		{ "number": 3, "x" : 4, "y" : 0, "width" : 1, "height" : 2, "taken" : false, "bookings": [] }, 
		{ "number": 4, "x" : 6, "y" : 0, "width" : 1, "height" : 2, "taken" : false, "bookings": [] }, 
		{ "number": 5, "x" : 0, "y" : 4, "width" : 1, "height" : 2, "taken" : false, "bookings": [] }, 
		{ "number": 6, "x" : 2, "y" : 4, "width" : 1, "height" : 2, "taken" : false, "bookings": [] }, 
		{ "number": 7, "x" : 4, "y" : 4, "width" : 1, "height" : 2, "taken" : false, "bookings": [] }, 
		{ "number": 8, "x" : 6, "y" : 4, "width" : 1, "height" : 2, "taken" : false, "bookings": [] } ]
	});
}