import { Template } from 'meteor/templating';

import { Grids } from '../api/grids.js';

import { Meteor } from 'meteor/meteor';

import './body.html';

import './../api/methods.js';

Template.home.helpers({
	grids() {
		return Grids.find({});
	},
});

Template.App_body.onCreated(function() {
	this.subscribe("grids");
});

Template.canvas.rendered = function() {
	var grid = Grids.findOne({_id: FlowRouter.getParam("_id") });
	var width = grid.width * 50;
	var height = grid.height * 50;
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	canvas.width  = width;
	canvas.height = height;
	var canvasLeft = canvas.offsetLeft;
	var canvasTop = canvas.offsetTop;
	grid.parkings.forEach(function(i) {
		if (i.taken) {
			ctx.fillStyle = "#FF0000";
		} else if (! i.taken) {
			ctx.fillStyle = "#00FF00";
		}
		ctx.fillRect(i.x * 50, i.y * 50, i.width * 50, i.height * 50);
		canvas.addEventListener('click', function(event) {
			var x = event.pageX - canvasLeft,
			y = event.pageY - canvasTop;

		    // Collision detection between clicked offset and element.
		    if (y > i.y * 50 && y < i.y * 50 + i.height * 50
		    	&& x > i.x * 50 && x < i.x * 50 + i.width * 50) {
		    	FlowRouter.go('Book', {_id: grid._id,  number: i.number });
		}

	}, false);
	});

}

Template.booking.onRendered(function() {
	function pad(d) {
    	return (d < 10) ? '0' + d.toString() : d.toString();
	}

	function formatDate(date) {
		var d = new Date(date),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();

		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;

		return [year, month, day].join('-');
	}
	var curr = new Date;
	var first = curr.getDate()
	var firstday = (new Date(curr.setDate(first))).toString();
	var datemenu = document.getElementById('datemenu');
	var startingHour = document.getElementById('starting_hour');
	var startingMinute = document.getElementById('starting_minute');
	var durationHour = document.getElementById('duration_hour');
	var durationMinute = document.getElementById('duration_minute');
	for (var i = 0; i < 7; i++) {
		var next = new Date(curr.getTime());
		next.setDate(first + i);
		var newOption = document.createElement('option');
		newOption.innerHTML = formatDate((next.toString()));
		datemenu.appendChild(newOption);
	}
	
	for (var i=0; i < 24; i++) {
		var newOption = document.createElement('option');
		newOption.innerHTML = pad(i);
		startingHour.appendChild(newOption);
		var newOption = document.createElement('option');
		newOption.innerHTML = pad(i);
		durationHour.appendChild(newOption);
	}

	for (var i=0; i < 12; i++) {
		var newOption = document.createElement('option');
		newOption.innerHTML = pad(i * 5);
		startingMinute.appendChild(newOption);
		var newOption = document.createElement('option');
		newOption.innerHTML = pad(i * 5);
		durationMinute.appendChild(newOption);
	}

	document.getElementById('confirm_booking').onclick = function() {
		var grid = Grids.findOne({_id: FlowRouter.getParam("_id") });
		var parkingSpot = grid.parkings[Number(FlowRouter.getParam("number")) - 1];
		var dateBooking = datemenu.options[datemenu.selectedIndex].value;
		var timeStartHour = startingHour.options[startingHour.selectedIndex].value;
		var timeStartMinute = startingMinute.options[startingMinute.selectedIndex].value;
		var timeDurationHour = durationHour.options[durationHour.selectedIndex].value;
		var timeDurationMinute = durationMinute.options[durationMinute.selectedIndex].value;

		var timeStart = new Date(dateBooking + " " + timeStartHour + ":" + timeStartMinute + ":" + "00");
		var timeStop = new Date(timeStart.getTime() + timeDurationMinute*60000 + timeDurationHour*3600000);

		var message = "Booking Successful! You have booked this parking slot from " + timeStart + " to " + timeStop;
		parkingSpot.bookings.some(function(booking) {
    		if (timeStart <= booking.timeStart && booking.timeStart <= timeStop) {
    			message = "Booking unsuccessful. Your booking overlaps with another booking which starts from " + 
    			booking.timeStart + " and ends at " + booking.timeStop;
    			return true;
    		}
    		else if (timeStart <= booking.timeStop   && booking.timeStop   <= timeStop) {
    			message = "Booking unsuccessful. Your booking overlaps with another booking which starts from " + 
    			booking.timeStart + " and ends at " + booking.timeStop;
    			return true;
    		}
    		else if (booking.timeStart <  timeStart && timeStop   <  booking.timeStop) {
    			message = "Booking unsuccessful. Your booking overlaps with another booking which starts from " + 
    			booking.timeStart + " and ends at " + booking.timeStop;
    			return true;
    		} 
		});
		if (message == "Booking Successful! You have booked this parking slot from " + timeStart + " to " + timeStop) {
			Meteor.call("book", grid._id, parkingSpot.number, timeStart, timeStop, Meteor.userId());
			alert(message);
		}
   	};
	
});

Template.out.onRendered(function() {
	document.getElementById('logout').onclick = function() {
		Meteor.logout();
		FlowRouter.go("/");
	}
});

Template.App_body.helpers({
  noUser: function() {
  	if (Meteor.userId() == null) {
    	return true
  	}
  },
   currentUser: function() {
  	if (Meteor.userId() != null) {
    	return true
  	}
  }

});

Template.App_body.events({
    'click #logout': function(){
        Meteor.logout();
        FlowRouter.go("/");
    }
});

Template.profile.events({
  'click #check-password': function() {
    var digest = Package.sha.SHA256(document.getElementById("password-first").value);
    Meteor.call('checkPassword', digest, function(err, result) {
      if (result) {
    	document.getElementById("profile-form").style.display = "block";
      }
    });
  }
});

Template.book.helpers({
	available: function() {
		var parkingsAvailable = 0;
    	Grids.findOne({_id: FlowRouter.getParam("_id") }).parkings.forEach(function(i) {
      		if (! i.taken) {
        		parkingsAvailable += 1;
      		}
    	});
    	return parkingsAvailable;
	}

});

Template.book.onRendered(function() {
	function pad(d) {
    	return (d < 10) ? '0' + d.toString() : d.toString();
	}

	function formatDate(date) {
		var d = new Date(date),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();

		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;

		return [year, month, day].join('-');
	}
	var curr = new Date;
	var first = curr.getDate()
	var firstday = (new Date(curr.setDate(first))).toString();
	var datemenu = document.getElementById('datemenu');
	var startingHour = document.getElementById('starting_hour');
	var startingMinute = document.getElementById('starting_minute');
	var durationHour = document.getElementById('duration_hour');
	var durationMinute = document.getElementById('duration_minute');
	for (var i = 0; i < 7; i++) {
		var next = new Date(curr.getTime());
		next.setDate(first + i);
		var newOption = document.createElement('option');
		newOption.innerHTML = formatDate((next.toString()));
		datemenu.appendChild(newOption);
	}
	
	for (var i=0; i < 24; i++) {
		var newOption = document.createElement('option');
		newOption.innerHTML = pad(i);
		startingHour.appendChild(newOption);
		var newOption = document.createElement('option');
		newOption.innerHTML = pad(i);
		durationHour.appendChild(newOption);
	}

	for (var i=0; i < 12; i++) {
		var newOption = document.createElement('option');
		newOption.innerHTML = pad(i * 5);
		startingMinute.appendChild(newOption);
		var newOption = document.createElement('option');
		newOption.innerHTML = pad(i * 5);
		durationMinute.appendChild(newOption);
	}

	document.getElementById('confirm-booking').onclick = function() {
		var grid = Grids.findOne({_id: FlowRouter.getParam("_id") });
		var dateBooking = datemenu.options[datemenu.selectedIndex].value;
		var timeStartHour = startingHour.options[startingHour.selectedIndex].value;
		var timeStartMinute = startingMinute.options[startingMinute.selectedIndex].value;
		var timeDurationHour = durationHour.options[durationHour.selectedIndex].value;
		var timeDurationMinute = durationMinute.options[durationMinute.selectedIndex].value;

		var timeStart = new Date(dateBooking + " " + timeStartHour + ":" + timeStartMinute + ":" + "00");
		var timeStop = new Date(timeStart.getTime() + timeDurationMinute*60000 + timeDurationHour*3600000);

		if (bookingLogic(FlowRouter.getParam("_id"), curr, timeStart, timeStop)) {
			FlowRouter.go('Grids.show', {_id: FlowRouter.getParam("_id")});
		}
   	};
});

Template.book.events({
	'click #book-yes': function() {
		document.getElementById("booking-date").style.display = "block";
		document.getElementById("booking-start").style.display = "block";
		document.getElementById("booking-end").style.display = "block";
		document.getElementById("confirm-booking").style.display = "block";
	},

	'click #book-no': function() {
		FlowRouter.go('Grids.show', {_id: FlowRouter.getParam("_id")});
	}
});

function bookingLogic(gridId, currentTime, startTime, endTime) {
	var grid = Grids.findOne({_id: gridId});
	if (currentTime > startTime) {
		alert("Starting time of the booking must not be before the current time. Please try again.");
		return false;
	}
	var booked = false;
	grid.parkings.forEach(function(parking) {
		var available = true;
		parking.bookings.forEach(function(booking) {
			if (startTime <= booking.startingTime && booking.startTime <= endTime) {
    			available = false;
    		}
    		else if (startTime <= booking.endingTime   && booking.endingTime   <= endingTime) {
    			available = false;
    		}
    		else if (booking.startingTime <  startTime && endTime   <  booking.endingTime) {
    			available = false;
    		} 
		});
		if (available && ! booked) {
			Meteor.call("book", grid._id, parking.number, startTime, endTime, Meteor.userId());
			alert("Booking Successful! You have booked parking slot number " + parking.number + " from " + startTime + " to " + 
				endTime);
			booked = true;
		}
		
	});
	if (booked) {
		return true;
	}
}

Template.profile.helpers({
	email() {
		var user = Meteor.user();
  		if (user && user.emails) {
    		return user.emails[0].address;
		}
	},

	phone() {
		return Meteor.user().profile.phone;
	},

	plate() {
		return Meteor.user().profile.number;
	}
});