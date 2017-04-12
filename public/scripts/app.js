(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// Create object for name spacing
var googleDash = {};

// Connect to Firebase
var config = {
  apiKey: "AIzaSyD-eTMdDUW-vxtaMKpVlLGfbyywC5rJj84",
  authDomain: "beer-me-food.firebaseapp.com",
  databaseURL: "https://beer-me-food.firebaseio.com",
  projectId: "beer-me-food",
  storageBucket: "beer-me-food.appspot.com",
  messagingSenderId: "70902649271"
};

// Initializing Firebase
firebase.initializeApp(config);

// Referencing Firebase Database
var dbRef = firebase.database().ref();

googleDash.init = function () {
  googleDash.form();
  googleDash.events();
};

// Login form to get access to data with FB Authentication
googleDash.form = function () {
  $("form").on("submit", function (e) {
    e.preventDefault();
    // Get values from login form
    var userLogin = $('#userName').val();
    var userPassword = $('#password').val();

    firebase.auth().signInWithEmailAndPassword(userLogin, userPassword).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        alert(errorMessage);
      }
    });

    $('form').each(function () {
      this.reset();
    });
  });
};

// Main event function
googleDash.events = function () {
  googleDash.activeUser();
};

// If user is logged in, show the Google Chart data
googleDash.activeUser = function () {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      googleDash.drawVisualization();
      $('#loginModel').toggleClass('hideElement');
    } else {
      // run else code if necessary
    }
  });
};

// Getting data from Google SuperProxy and prints to page with Google Charts
googleDash.drawVisualization = function () {
  // Gets browser info from GA
  var browserWrapper = new google.visualization.ChartWrapper({
    "containerId": "browser",
    "dataSourceUrl": 'https://scenic-kiln-158617.appspot.com/query?id=ahRzfnNjZW5pYy1raWxuLTE1ODYxN3IVCxIIQXBpUXVlcnkYgICAgICAgAoM&format=data-table-response',
    "refreshInterval": 3600,
    "chartType": "PieChart",
    "options": {
      "showRowNumber": true,
      "width": 630,
      "height": 440,
      "is3D": true,
      "title": "Click Source"
    }
  });

  // Gets click source info from GA
  var browserWrapperTwo = new google.visualization.ChartWrapper({
    // Example Browser Share Query
    "containerId": "browserTwo",
    "dataSourceUrl": "https://scenic-kiln-158617.appspot.com/query?id=ahRzfnNjZW5pYy1raWxuLTE1ODYxN3IVCxIIQXBpUXVlcnkYgICAgLyhggoM&format=data-table-response",
    "refreshInterval": 3600,
    "chartType": "PieChart",
    "options": {
      "showRowNumber": true,
      "width": 630,
      "height": 440,
      "is3D": true,
      "title": "Most Used Browsers"
    }
  });

  // Calling the functions
  browserWrapper.draw();
  browserWrapperTwo.draw();
};

// Document ready
$(function () {
  googleDash.init();
});

// // Displaying Google AdWords data from sheets
// var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1KH19zyCNAX_xusWHbHStK70a1VaByqlWXaWXes8sxOc/pubhtml';

// function init() {
// Tabletop.init( { key: publicSpreadsheetUrl,
//                  callback: showInfo,
//                  simpleSheet: true } )
// }

// function showInfo(data, tabletop) {
// console.log(data);
// }

// window.addEventListener('DOMContentLoaded', init)

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBO0FBQ0EsSUFBSSxhQUFhLEVBQWpCOztBQUVBO0FBQ0EsSUFBSSxTQUFTO0FBQ1gsVUFBUSx5Q0FERztBQUVYLGNBQVksOEJBRkQ7QUFHWCxlQUFhLHFDQUhGO0FBSVgsYUFBVyxjQUpBO0FBS1gsaUJBQWUsMEJBTEo7QUFNWCxxQkFBbUI7QUFOUixDQUFiOztBQVNBO0FBQ0EsU0FBUyxhQUFULENBQXVCLE1BQXZCOztBQUVBO0FBQ0EsSUFBSSxRQUFRLFNBQVMsUUFBVCxHQUFvQixHQUFwQixFQUFaOztBQUdBLFdBQVcsSUFBWCxHQUFrQixZQUFZO0FBQzFCLGFBQVcsSUFBWDtBQUNBLGFBQVcsTUFBWDtBQUNILENBSEQ7O0FBTUE7QUFDQSxXQUFXLElBQVgsR0FBa0IsWUFBVztBQUMzQixJQUFFLE1BQUYsRUFBVSxFQUFWLENBQWEsUUFBYixFQUF1QixVQUFTLENBQVQsRUFBWTtBQUMvQixNQUFFLGNBQUY7QUFDQTtBQUNBLFFBQUksWUFBWSxFQUFFLFdBQUYsRUFBZSxHQUFmLEVBQWhCO0FBQ0EsUUFBSSxlQUFlLEVBQUUsV0FBRixFQUFlLEdBQWYsRUFBbkI7O0FBRUEsYUFBUyxJQUFULEdBQWdCLDBCQUFoQixDQUEyQyxTQUEzQyxFQUFzRCxZQUF0RCxFQUFvRSxLQUFwRSxDQUEwRSxVQUFTLEtBQVQsRUFBZ0I7QUFDeEY7QUFDQSxVQUFJLFlBQVksTUFBTSxJQUF0QjtBQUNBLFVBQUksZUFBZSxNQUFNLE9BQXpCOztBQUVBLFVBQUksY0FBYyxxQkFBbEIsRUFBeUM7QUFDdkMsY0FBTSxpQkFBTjtBQUNELE9BRkQsTUFHSztBQUNILGNBQU0sWUFBTjtBQUNEO0FBQ0YsS0FYRDs7QUFhQSxNQUFFLE1BQUYsRUFBVSxJQUFWLENBQWUsWUFBVTtBQUNyQixXQUFLLEtBQUw7QUFDSCxLQUZEO0FBR0gsR0F0QkQ7QUF1QkQsQ0F4QkQ7O0FBMkJBO0FBQ0EsV0FBVyxNQUFYLEdBQW9CLFlBQVc7QUFDN0IsYUFBVyxVQUFYO0FBQ0QsQ0FGRDs7QUFLQTtBQUNBLFdBQVcsVUFBWCxHQUF3QixZQUFXO0FBQy9CLFdBQVMsSUFBVCxHQUFnQixrQkFBaEIsQ0FBbUMsVUFBUyxJQUFULEVBQWU7QUFDbEQsUUFBSSxJQUFKLEVBQVU7QUFDUixpQkFBVyxpQkFBWDtBQUNBLFFBQUUsYUFBRixFQUFpQixXQUFqQixDQUE2QixhQUE3QjtBQUNELEtBSEQsTUFHTztBQUNMO0FBQ0Q7QUFDRixHQVBDO0FBUUgsQ0FURDs7QUFZQTtBQUNBLFdBQVcsaUJBQVgsR0FBK0IsWUFBVztBQUN4QztBQUNBLE1BQUksaUJBQWlCLElBQUksT0FBTyxhQUFQLENBQXFCLFlBQXpCLENBQXNDO0FBQ3hELG1CQUFlLFNBRHlDO0FBRXhELHFCQUFpQix5SUFGdUM7QUFHeEQsdUJBQW1CLElBSHFDO0FBSXhELGlCQUFhLFVBSjJDO0FBS3hELGVBQVc7QUFDUix1QkFBa0IsSUFEVjtBQUVSLGVBQVMsR0FGRDtBQUdSLGdCQUFVLEdBSEY7QUFJUixjQUFRLElBSkE7QUFLUixlQUFTO0FBTEQ7QUFMNkMsR0FBdEMsQ0FBckI7O0FBY0E7QUFDQSxNQUFJLG9CQUFvQixJQUFJLE9BQU8sYUFBUCxDQUFxQixZQUF6QixDQUFzQztBQUMxRDtBQUNELG1CQUFlLFlBRjRDO0FBRzNELHFCQUFpQix5SUFIMEM7QUFJM0QsdUJBQW1CLElBSndDO0FBSzNELGlCQUFhLFVBTDhDO0FBTTNELGVBQVc7QUFDUix1QkFBa0IsSUFEVjtBQUVSLGVBQVMsR0FGRDtBQUdSLGdCQUFVLEdBSEY7QUFJUixjQUFRLElBSkE7QUFLUixlQUFTO0FBTEQ7QUFOZ0QsR0FBdEMsQ0FBeEI7O0FBZUE7QUFDQSxpQkFBZSxJQUFmO0FBQ0Esb0JBQWtCLElBQWxCO0FBRUQsQ0FwQ0Q7O0FBdUNBO0FBQ0EsRUFBRSxZQUFXO0FBQ1gsYUFBVyxJQUFYO0FBQ0QsQ0FGRDs7QUFnQkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBDcmVhdGUgb2JqZWN0IGZvciBuYW1lIHNwYWNpbmdcbnZhciBnb29nbGVEYXNoID0ge307XG5cbi8vIENvbm5lY3QgdG8gRmlyZWJhc2VcbnZhciBjb25maWcgPSB7XG4gIGFwaUtleTogXCJBSXphU3lELWVUTWREVVctdnh0YU1LcFZsTEdmYnl5d0M1ckpqODRcIixcbiAgYXV0aERvbWFpbjogXCJiZWVyLW1lLWZvb2QuZmlyZWJhc2VhcHAuY29tXCIsXG4gIGRhdGFiYXNlVVJMOiBcImh0dHBzOi8vYmVlci1tZS1mb29kLmZpcmViYXNlaW8uY29tXCIsXG4gIHByb2plY3RJZDogXCJiZWVyLW1lLWZvb2RcIixcbiAgc3RvcmFnZUJ1Y2tldDogXCJiZWVyLW1lLWZvb2QuYXBwc3BvdC5jb21cIixcbiAgbWVzc2FnaW5nU2VuZGVySWQ6IFwiNzA5MDI2NDkyNzFcIlxufTtcblxuLy8gSW5pdGlhbGl6aW5nIEZpcmViYXNlXG5maXJlYmFzZS5pbml0aWFsaXplQXBwKGNvbmZpZyk7XG5cbi8vIFJlZmVyZW5jaW5nIEZpcmViYXNlIERhdGFiYXNlXG52YXIgZGJSZWYgPSBmaXJlYmFzZS5kYXRhYmFzZSgpLnJlZigpO1xuXG5cbmdvb2dsZURhc2guaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICBnb29nbGVEYXNoLmZvcm0oKTtcbiAgICBnb29nbGVEYXNoLmV2ZW50cygpO1xufVxuXG5cbi8vIExvZ2luIGZvcm0gdG8gZ2V0IGFjY2VzcyB0byBkYXRhIHdpdGggRkIgQXV0aGVudGljYXRpb25cbmdvb2dsZURhc2guZm9ybSA9IGZ1bmN0aW9uKCkge1xuICAkKFwiZm9ybVwiKS5vbihcInN1Ym1pdFwiLCBmdW5jdGlvbihlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAvLyBHZXQgdmFsdWVzIGZyb20gbG9naW4gZm9ybVxuICAgICAgbGV0IHVzZXJMb2dpbiA9ICQoJyN1c2VyTmFtZScpLnZhbCgpO1xuICAgICAgbGV0IHVzZXJQYXNzd29yZCA9ICQoJyNwYXNzd29yZCcpLnZhbCgpO1xuXG4gICAgICBmaXJlYmFzZS5hdXRoKCkuc2lnbkluV2l0aEVtYWlsQW5kUGFzc3dvcmQodXNlckxvZ2luLCB1c2VyUGFzc3dvcmQpLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIC8vIEhhbmRsZSBFcnJvcnMgaGVyZS5cbiAgICAgICAgdmFyIGVycm9yQ29kZSA9IGVycm9yLmNvZGU7XG4gICAgICAgIHZhciBlcnJvck1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuXG4gICAgICAgIGlmIChlcnJvckNvZGUgPT09ICdhdXRoL3dyb25nLXBhc3N3b3JkJykge1xuICAgICAgICAgIGFsZXJ0KCdXcm9uZyBwYXNzd29yZC4nKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBhbGVydChlcnJvck1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgJCgnZm9ybScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICB9KTtcbiAgfSk7XG59XG5cblxuLy8gTWFpbiBldmVudCBmdW5jdGlvblxuZ29vZ2xlRGFzaC5ldmVudHMgPSBmdW5jdGlvbigpIHtcbiAgZ29vZ2xlRGFzaC5hY3RpdmVVc2VyKCk7XG59XG5cblxuLy8gSWYgdXNlciBpcyBsb2dnZWQgaW4sIHNob3cgdGhlIEdvb2dsZSBDaGFydCBkYXRhXG5nb29nbGVEYXNoLmFjdGl2ZVVzZXIgPSBmdW5jdGlvbigpIHtcbiAgICBmaXJlYmFzZS5hdXRoKCkub25BdXRoU3RhdGVDaGFuZ2VkKGZ1bmN0aW9uKHVzZXIpIHtcbiAgICBpZiAodXNlcikge1xuICAgICAgZ29vZ2xlRGFzaC5kcmF3VmlzdWFsaXphdGlvbigpO1xuICAgICAgJCgnI2xvZ2luTW9kZWwnKS50b2dnbGVDbGFzcygnaGlkZUVsZW1lbnQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gcnVuIGVsc2UgY29kZSBpZiBuZWNlc3NhcnlcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8vIEdldHRpbmcgZGF0YSBmcm9tIEdvb2dsZSBTdXBlclByb3h5IGFuZCBwcmludHMgdG8gcGFnZSB3aXRoIEdvb2dsZSBDaGFydHNcbmdvb2dsZURhc2guZHJhd1Zpc3VhbGl6YXRpb24gPSBmdW5jdGlvbigpIHtcbiAgLy8gR2V0cyBicm93c2VyIGluZm8gZnJvbSBHQVxuICBsZXQgYnJvd3NlcldyYXBwZXIgPSBuZXcgZ29vZ2xlLnZpc3VhbGl6YXRpb24uQ2hhcnRXcmFwcGVyKHtcbiAgICAgXCJjb250YWluZXJJZFwiOiBcImJyb3dzZXJcIixcbiAgICAgXCJkYXRhU291cmNlVXJsXCI6ICdodHRwczovL3NjZW5pYy1raWxuLTE1ODYxNy5hcHBzcG90LmNvbS9xdWVyeT9pZD1haFJ6Zm5OalpXNXBZeTFyYVd4dUxURTFPRFl4TjNJVkN4SUlRWEJwVVhWbGNua1lnSUNBZ0lDQWdBb00mZm9ybWF0PWRhdGEtdGFibGUtcmVzcG9uc2UnLFxuICAgICBcInJlZnJlc2hJbnRlcnZhbFwiOiAzNjAwLFxuICAgICBcImNoYXJ0VHlwZVwiOiBcIlBpZUNoYXJ0XCIsXG4gICAgIFwib3B0aW9uc1wiOiB7XG4gICAgICAgIFwic2hvd1Jvd051bWJlclwiIDogdHJ1ZSxcbiAgICAgICAgXCJ3aWR0aFwiOiA2MzAsXG4gICAgICAgIFwiaGVpZ2h0XCI6IDQ0MCxcbiAgICAgICAgXCJpczNEXCI6IHRydWUsXG4gICAgICAgIFwidGl0bGVcIjogXCJDbGljayBTb3VyY2VcIlxuICAgICB9XG4gICB9KTtcbiAgXG4gIC8vIEdldHMgY2xpY2sgc291cmNlIGluZm8gZnJvbSBHQVxuICBsZXQgYnJvd3NlcldyYXBwZXJUd28gPSBuZXcgZ29vZ2xlLnZpc3VhbGl6YXRpb24uQ2hhcnRXcmFwcGVyKHtcbiAgICAgIC8vIEV4YW1wbGUgQnJvd3NlciBTaGFyZSBRdWVyeVxuICAgICBcImNvbnRhaW5lcklkXCI6IFwiYnJvd3NlclR3b1wiLFxuICAgICBcImRhdGFTb3VyY2VVcmxcIjogXCJodHRwczovL3NjZW5pYy1raWxuLTE1ODYxNy5hcHBzcG90LmNvbS9xdWVyeT9pZD1haFJ6Zm5OalpXNXBZeTFyYVd4dUxURTFPRFl4TjNJVkN4SUlRWEJwVVhWbGNua1lnSUNBZ0x5aGdnb00mZm9ybWF0PWRhdGEtdGFibGUtcmVzcG9uc2VcIixcbiAgICAgXCJyZWZyZXNoSW50ZXJ2YWxcIjogMzYwMCxcbiAgICAgXCJjaGFydFR5cGVcIjogXCJQaWVDaGFydFwiLFxuICAgICBcIm9wdGlvbnNcIjoge1xuICAgICAgICBcInNob3dSb3dOdW1iZXJcIiA6IHRydWUsXG4gICAgICAgIFwid2lkdGhcIjogNjMwLFxuICAgICAgICBcImhlaWdodFwiOiA0NDAsXG4gICAgICAgIFwiaXMzRFwiOiB0cnVlLFxuICAgICAgICBcInRpdGxlXCI6IFwiTW9zdCBVc2VkIEJyb3dzZXJzXCJcbiAgICAgfVxuICAgfSk7XG5cbiAgLy8gQ2FsbGluZyB0aGUgZnVuY3Rpb25zXG4gIGJyb3dzZXJXcmFwcGVyLmRyYXcoKTtcbiAgYnJvd3NlcldyYXBwZXJUd28uZHJhdygpO1xuXG59XG5cblxuLy8gRG9jdW1lbnQgcmVhZHlcbiQoZnVuY3Rpb24oKSB7XG4gIGdvb2dsZURhc2guaW5pdCgpO1xufSk7XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbi8vIC8vIERpc3BsYXlpbmcgR29vZ2xlIEFkV29yZHMgZGF0YSBmcm9tIHNoZWV0c1xuLy8gdmFyIHB1YmxpY1NwcmVhZHNoZWV0VXJsID0gJ2h0dHBzOi8vZG9jcy5nb29nbGUuY29tL3NwcmVhZHNoZWV0cy9kLzFLSDE5enlDTkFYX3h1c1dIYkhTdEs3MGExVmFCeXFsV1hhV1hlczhzeE9jL3B1Ymh0bWwnO1xuXG4vLyBmdW5jdGlvbiBpbml0KCkge1xuLy8gVGFibGV0b3AuaW5pdCggeyBrZXk6IHB1YmxpY1NwcmVhZHNoZWV0VXJsLFxuLy8gICAgICAgICAgICAgICAgICBjYWxsYmFjazogc2hvd0luZm8sXG4vLyAgICAgICAgICAgICAgICAgIHNpbXBsZVNoZWV0OiB0cnVlIH0gKVxuLy8gfVxuXG4vLyBmdW5jdGlvbiBzaG93SW5mbyhkYXRhLCB0YWJsZXRvcCkge1xuLy8gY29uc29sZS5sb2coZGF0YSk7XG4vLyB9XG5cbi8vIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgaW5pdCkiXX0=
