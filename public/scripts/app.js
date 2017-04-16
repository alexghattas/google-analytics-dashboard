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

// Initialize function (called in Document Ready at bottom)
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
    // Resets all form inputs to nothing
    $('form').each(function () {
      this.reset();
    });
  });
};

// Main event function
googleDash.events = function () {
  googleDash.activeUser();
};

googleDash.signOut = function () {
  $('#logOut').on("click", function (e) {
    e.preventDefault();
    firebase.auth().signOut().then(function () {
      console.log('Signed Out');
      window.location.reload(false);
    }, function (error) {
      console.error('Sign Out Error', error);
    });
  });
};

googleDash.getUserInfo = function () {
  var userEmail = firebase.auth().currentUser.email;
  $('#userEmail').append(userEmail);
};

googleDash.getDate = function () {
  var startDate = new Date(new Date().getTime() - 744 * 60 * 60 * 1000);
  var endDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
  $('#startDate').append(startDate);
  $('#endDate').append(endDate);
};

googleDash.getOtherData = function () {
  $.ajax({
    url: 'https://scenic-kiln-158617.appspot.com/query?id=ahRzfnNjZW5pYy1raWxuLTE1ODYxN3IVCxIIQXBpUXVlcnkYgICAgN7qiQoM',
    method: 'GET',
    dataType: 'jsonp'
  }).then(function (otherData) {
    console.log(otherData);
    var allOtherData = otherData.totalsForAllResults;
    var profileInfo = otherData["profileInfo"];
    console.log(allOtherData);

    // Google AdWords Data
    var costPerClick = allOtherData["ga:CPC"];
    var clickThroughRatio = allOtherData["ga:CTR"];
    var totalAdClicks = allOtherData["ga:adClicks"];
    var totalAdCost = allOtherData["ga:adCost"];
    var adImpressions = allOtherData["ga:impressions"];

    // Google Analytics Data
    var totalSessions = allOtherData["ga:sessions"];
    var bounceRate = allOtherData["ga:bounceRate"];
    var newUsers = allOtherData["ga:newUsers"];
    var averageSession = allOtherData["ga:sessionDuration"];

    // NavBar Information
    var gaWebProperty = profileInfo["webPropertyId"];

    $("#gaClicks").append(totalAdClicks);
    $("#gaCost").append(totalAdCost);
    $("#adCtr").append(clickThroughRatio);
    $("#adCpc").append(costPerClick);
    $("#adImpressions").append(adImpressions);

    $("#gaSessions").append(totalSessions);
    $("#gaBounceRate").append(bounceRate);
    $("#gaNewUsers").append(newUsers);
    $("#gaSessionDuration").append(averageSession);

    $("#gaWebProperty").append(gaWebProperty);
  });
};

// If user is logged in, show the Google Chart data
googleDash.activeUser = function () {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      googleDash.drawVisualization();
      $('#loginModel').toggleClass('hideElement');
      $('#navbarStatus').append('\
        <div class="navbar">\
          <div class="navbar__header">\
            <h2>Welcome</h2>\
            <img src="assets/footer_logo_color_trans.png" alt="">\
          </div>\
          <div class="navbar__timeFrame">\
            <p>Results Time Frame</p>\
            <div class="navbar__timeFrame--date">\
              <span id="startDate"></span> to <span id="endDate"></span>\
            </div>\
          </div>\
          <div class="navbar__profile">\
            <p>Your Google Analytics Web ID</p>\
            <div class="navbar__timeFrame--date">\
              <span id="gaWebProperty"></span>\
            </div>\
          </div>\
          <div class="navbar__footer">\
            <p>Logged In As:<br><span id="userEmail"></span></p>\
            <input type="submit" id="logOut" value="Sign Out" class="navbar__logOut"></input>\
          </div>\
        </div>');

      googleDash.getUserInfo();
      googleDash.getOtherData();
      googleDash.getDate();
      googleDash.signOut();
    } else {
      // run else code if necessary
    }
  });
};

// Getting data from Google SuperProxy and prints to page with Google Charts
googleDash.drawVisualization = function () {
  // Gets browser info from GA
  var usersBrowser = new google.visualization.ChartWrapper({
    "containerId": "usersBrowser",
    "dataSourceUrl": 'https://scenic-kiln-158617.appspot.com/query?id=ahRzfnNjZW5pYy1raWxuLTE1ODYxN3IVCxIIQXBpUXVlcnkYgICAgICAgAoM&format=data-table-response',
    "refreshInterval": 3600,
    "chartType": "PieChart",
    "options": {
      "showRowNumber": true,
      "width": 500,
      "height": 300,
      "is3D": false,
      "title": "Click Source"
    }
  });

  // Gets click source info from GA
  var usersClickSource = new google.visualization.ChartWrapper({
    // Example Browser Share Query
    "containerId": "usersClickSource",
    "dataSourceUrl": "https://scenic-kiln-158617.appspot.com/query?id=ahRzfnNjZW5pYy1raWxuLTE1ODYxN3IVCxIIQXBpUXVlcnkYgICAgLyhggoM&format=data-table-response",
    "refreshInterval": 3600,
    "chartType": "PieChart",
    "options": {
      "showRowNumber": true,
      "width": 500,
      "height": 300,
      "is3D": false,
      "title": "Most Used Browsers"
    }
  });

  // Gets click source info from GA
  var usersCampaignSources = new google.visualization.ChartWrapper({
    // Example Browser Share Query
    "containerId": "usersCampaignSources",
    "dataSourceUrl": "https://scenic-kiln-158617.appspot.com/query?id=ahRzfnNjZW5pYy1raWxuLTE1ODYxN3IVCxIIQXBpUXVlcnkYgICAgNq3lwoM&format=data-table-response",
    "refreshInterval": 3600,
    "chartType": "PieChart",
    "options": {
      "showRowNumber": true,
      "width": 500,
      "height": 300,
      "is3D": false,
      "title": "AdWords Campaign Source"
    }
  });

  // Gets click source info from GA
  var usersOperatingSystem = new google.visualization.ChartWrapper({
    // Example Browser Share Query
    "containerId": "usersOperatingSystem",
    "dataSourceUrl": "https://scenic-kiln-158617.appspot.com/query?id=ahRzfnNjZW5pYy1raWxuLTE1ODYxN3IVCxIIQXBpUXVlcnkYgICAgN6MkAoM&format=data-table-response",
    "refreshInterval": 3600,
    "chartType": "PieChart",
    "options": {
      "showRowNumber": true,
      "width": 500,
      "height": 300,
      "is3D": false,
      "title": "Operating Systems"
    }
  });

  // Calling the functions to print charts in DOM
  usersBrowser.draw();
  usersClickSource.draw();
  usersCampaignSources.draw();
  usersOperatingSystem.draw();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBO0FBQ0EsSUFBSSxhQUFhLEVBQWpCOztBQUVBO0FBQ0EsSUFBSSxTQUFTO0FBQ1gsVUFBUSx5Q0FERztBQUVYLGNBQVksOEJBRkQ7QUFHWCxlQUFhLHFDQUhGO0FBSVgsYUFBVyxjQUpBO0FBS1gsaUJBQWUsMEJBTEo7QUFNWCxxQkFBbUI7QUFOUixDQUFiOztBQVNBO0FBQ0EsU0FBUyxhQUFULENBQXVCLE1BQXZCOztBQUVBO0FBQ0EsSUFBSSxRQUFRLFNBQVMsUUFBVCxHQUFvQixHQUFwQixFQUFaOztBQUVBO0FBQ0EsV0FBVyxJQUFYLEdBQWtCLFlBQVk7QUFDMUIsYUFBVyxJQUFYO0FBQ0EsYUFBVyxNQUFYO0FBQ0gsQ0FIRDs7QUFNQTtBQUNBLFdBQVcsSUFBWCxHQUFrQixZQUFXO0FBQzNCLElBQUUsTUFBRixFQUFVLEVBQVYsQ0FBYSxRQUFiLEVBQXVCLFVBQVMsQ0FBVCxFQUFZO0FBQy9CLE1BQUUsY0FBRjtBQUNBO0FBQ0EsUUFBSSxZQUFZLEVBQUUsV0FBRixFQUFlLEdBQWYsRUFBaEI7QUFDQSxRQUFJLGVBQWUsRUFBRSxXQUFGLEVBQWUsR0FBZixFQUFuQjs7QUFFQSxhQUFTLElBQVQsR0FBZ0IsMEJBQWhCLENBQTJDLFNBQTNDLEVBQXNELFlBQXRELEVBQW9FLEtBQXBFLENBQTBFLFVBQVMsS0FBVCxFQUFnQjtBQUN4RjtBQUNBLFVBQUksWUFBWSxNQUFNLElBQXRCO0FBQ0EsVUFBSSxlQUFlLE1BQU0sT0FBekI7O0FBRUEsVUFBSSxjQUFjLHFCQUFsQixFQUF5QztBQUN2QyxjQUFNLGlCQUFOO0FBQ0QsT0FGRCxNQUdLO0FBQ0gsY0FBTSxZQUFOO0FBQ0Q7QUFDRixLQVhEO0FBWUE7QUFDQSxNQUFFLE1BQUYsRUFBVSxJQUFWLENBQWUsWUFBVTtBQUNyQixXQUFLLEtB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dUIsSUFBSSxPQUFPLGFBQVAsQ0FBcUIsWUFBekIsQ0FBc0M7QUFDN0Q7QUFDRCxtQkFBZSxzQkFGK0M7QUFHOUQscUJBQWlCLHlJQUg2QztBQUk5RCx1QkFBbUIsSUFKMkM7QUFLOUQsaUJBQWEsVUFMaUQ7QUFNOUQsZUFBVztBQUNSLHVCQUFrQixJQURWO0FBRVIsZUFBUyxHQUZEO0FBR1IsZ0JBQVUsR0FIRjtBQUlSLGNBQVEsS0FKQTtBQUtSLGVBQVM7QUFMRDtBQU5tRCxHQUF0QyxDQUEzQjs7QUFlQTtBQUNBLE1BQUksdUJBQXVCLElBQUksT0FBTyxhQUFQLENBQXFCLFlBQXpCLENBQXNDO0FBQzdEO0FBQ0QsbUJBQWUsc0JBRitDO0FBRzlELHFCQUFpQix5SUFINkM7QUFJOUQsdUJBQW1CLElBSjJDO0FBSzlELGlCQUFhLFVBTGlEO0FBTTlELGVBQVc7QUFDUix1QkFBa0IsSUFEVjtBQUVSLGVBQVMsR0FGRDtBQUdSLGdCQUFVLEdBSEY7QUFJUixjQUFRLEtBSkE7QUFLUixlQUFTO0FBTEQ7QUFObUQsR0FBdEMsQ0FBM0I7O0FBZ0JBO0FBQ0EsZUFBYSxJQUFiO0FBQ0EsbUJBQWlCLElBQWpCO0FBQ0EsdUJBQXFCLElBQXJCO0FBQ0EsdUJBQXFCLElBQXJCO0FBQ0QsQ0F0RUQ7O0FBeUVBO0FBQ0EsRUFBRSxZQUFXO0FBQ1gsYUFBVyxJQUFYO0FBQ0QsQ0FGRDs7QUFnQkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBDcmVhdGUgb2JqZWN0IGZvciBuYW1lIHNwYWNpbmdcbnZhciBnb29nbGVEYXNoID0ge307XG5cbi8vIENvbm5lY3QgdG8gRmlyZWJhc2VcbnZhciBjb25maWcgPSB7XG4gIGFwaUtleTogXCJBSXphU3lELWVUTWREVVctdnh0YU1LcFZsTEdmYnl5d0M1ckpqODRcIixcbiAgYXV0aERvbWFpbjogXCJiZWVyLW1lLWZvb2QuZmlyZWJhc2VhcHAuY29tXCIsXG4gIGRhdGFiYXNlVVJMOiBcImh0dHBzOi8vYmVlci1tZS1mb29kLmZpcmViYXNlaW8uY29tXCIsXG4gIHByb2plY3RJZDogXCJiZWVyLW1lLWZvb2RcIixcbiAgc3RvcmFnZUJ1Y2tldDogXCJiZWVyLW1lLWZvb2QuYXBwc3BvdC5jb21cIixcbiAgbWVzc2FnaW5nU2VuZGVySWQ6IFwiNzA5MDI2NDkyNzFcIlxufTtcblxuLy8gSW5pdGlhbGl6aW5nIEZpcmViYXNlXG5maXJlYmFzZS5pbml0aWFsaXplQXBwKGNvbmZpZyk7XG5cbi8vIFJlZmVyZW5jaW5nIEZpcmViYXNlIERhdGFiYXNlXG52YXIgZGJSZWYgPSBmaXJlYmFzZS5kYXRhYmFzZSgpLnJlZigpO1xuXG4vLyBJbml0aWFsaXplIGZ1bmN0aW9uIChjYWxsZWQgaW4gRG9jdW1lbnQgUmVhZHkgYXQgYm90dG9tKVxuZ29vZ2xlRGFzaC5pbml0ID0gZnVuY3Rpb24gKCkge1xuICAgIGdvb2dsZURhc2guZm9ybSgpO1xuICAgIGdvb2dsZURhc2guZXZlbnRzKCk7XG59XG5cblxuLy8gTG9naW4gZm9ybSB0byBnZXQgYWNjZXNzIHRvIGRhdGEgd2l0aCBGQiBBdXRoZW50aWNhdGlvblxuZ29vZ2xlRGFzaC5mb3JtID0gZnVuY3Rpb24oKSB7XG4gICQoXCJmb3JtXCIpLm9uKFwic3VibWl0XCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIC8vIEdldCB2YWx1ZXMgZnJvbSBsb2dpbiBmb3JtXG4gICAgICBsZXQgdXNlckxvZ2luID0gJCgnI3VzZXJOYW1lJykudmFsKCk7XG4gICAgICBsZXQgdXNlclBhc3N3b3JkID0gJCgnI3Bhc3N3b3JkJykudmFsKCk7XG5cbiAgICAgIGZpcmViYXNlLmF1dGgoKS5zaWduSW5XaXRoRW1haWxBbmRQYXNzd29yZCh1c2VyTG9naW4sIHVzZXJQYXNzd29yZCkuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgLy8gSGFuZGxlIEVycm9ycyBoZXJlLlxuICAgICAgICB2YXIgZXJyb3JDb2RlID0gZXJyb3IuY29kZTtcbiAgICAgICAgdmFyIGVycm9yTWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG5cbiAgICAgICAgaWYgKGVycm9yQ29kZSA9PT0gJ2F1dGgvd3JvbmctcGFzc3dvcmQnKSB7XG4gICAgICAgICAgYWxlcnQoJ1dyb25nIHBhc3N3b3JkLicpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGFsZXJ0KGVycm9yTWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgLy8gUmVzZXRzIGFsbCBmb3JtIGlucHV0cyB0byBub3RoaW5nXG4gICAgICAkKCdmb3JtJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgIH0pO1xuICB9KTtcbn1cblxuXG4vLyBNYWluIGV2ZW50IGZ1bmN0aW9uXG5nb29nbGVEYXNoLmV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICBnb29nbGVEYXNoLmFjdGl2ZVVzZXIoKTtcbn1cblxuXG5nb29nbGVEYXNoLnNpZ25PdXQgPSBmdW5jdGlvbigpIHtcbiAgJCgnI2xvZ091dCcpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7IFxuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBmaXJlYmFzZS5hdXRoKCkuc2lnbk91dCgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICBjb25zb2xlLmxvZygnU2lnbmVkIE91dCcpO1xuICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZChmYWxzZSk7XG4gICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1NpZ24gT3V0IEVycm9yJywgZXJyb3IpO1xuICAgIH0pO1xuICB9KTtcbn1cblxuZ29vZ2xlRGFzaC5nZXRVc2VySW5mbyA9IGZ1bmN0aW9uKCkge1xuICBsZXQgdXNlckVtYWlsID0gZmlyZWJhc2UuYXV0aCgpLmN1cnJlbnRVc2VyLmVtYWlsO1xuICAkKCcjdXNlckVtYWlsJykuYXBwZW5kKHVzZXJFbWFpbCk7XG59XG5cbmdvb2dsZURhc2guZ2V0RGF0ZSA9IGZ1bmN0aW9uKCkge1xuICBsZXQgc3RhcnREYXRlID0gbmV3IERhdGUobmV3IERhdGUoKS5nZXRUaW1lKCkgLSA3NDQgKiA2MCAqIDYwICogMTAwMCk7XG4gIGxldCBlbmREYXRlID0gbmV3IERhdGUobmV3IERhdGUoKS5nZXRUaW1lKCkgLSAyNCAqIDYwICogNjAgKiAxMDAwKTtcbiAgJCgnI3N0YXJ0RGF0ZScpLmFwcGVuZChzdGFydERhdGUpO1xuICAkKCcjZW5kRGF0ZScpLmFwcGVuZChlbmREYXRlKTtcbn1cblxuZ29vZ2xlRGFzaC5nZXRPdGhlckRhdGEgPSBmdW5jdGlvbigpIHtcbiAgJC5hamF4KHtcbiAgICB1cmw6ICdodHRwczovL3NjZW5pYy1raWxuLTE1ODYxNy5hcHBzcG90LmNvbS9xdWVyeT9pZD1haFJ6Zm5OalpXNXBZeTFyYVd4dUxURTFPRFl4TjNJVkN4SUlRWEJwVVhWbGNua1lnSUNBZ043cWlRb00nLFxuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgZGF0YVR5cGU6ICdqc29ucCdcbiAgfSkudGhlbihmdW5jdGlvbihvdGhlckRhdGEpIHtcbiAgICBjb25zb2xlLmxvZyhvdGhlckRhdGEpO1xuICAgIGxldCBhbGxPdGhlckRhdGEgPSBvdGhlckRhdGEudG90YWxzRm9yQWxsUmVzdWx0cztcbiAgICBsZXQgcHJvZmlsZUluZm8gPSBvdGhlckRhdGFbXCJwcm9maWxlSW5mb1wiXTtcbiAgICBjb25zb2xlLmxvZyhhbGxPdGhlckRhdGEpO1xuICAgIFxuICAgIC8vIEdvb2dsZSBBZFdvcmRzIERhdGFcbiAgICBsZXQgY29zdFBlckNsaWNrID0gYWxsT3RoZXJEYXRhW1wiZ2E6Q1BDXCJdO1xuICAgIGxldCBjbGlja1Rocm91Z2hSYXRpbyA9IGFsbE90aGVyRGF0YVtcImdhOkNUUlwiXTtcbiAgICBsZXQgdG90YWxBZENsaWNrcyA9IGFsbE90aGVyRGF0YVtcImdhOmFkQ2xpY2tzXCJdO1xuICAgIGxldCB0b3RhbEFkQ29zdCA9IGFsbE90aGVyRGF0YVtcImdhOmFkQ29zdFwiXTtcbiAgICBsZXQgYWRJbXByZXNzaW9ucyA9IGFsbE90aGVyRGF0YVtcImdhOmltcHJlc3Npb25zXCJdO1xuXG4gICAgLy8gR29vZ2xlIEFuYWx5dGljcyBEYXRhXG4gICAgbGV0IHRvdGFsU2Vzc2lvbnMgPSBhbGxPdGhlckRhdGFbXCJnYTpzZXNzaW9uc1wiXTtcbiAgICBsZXQgYm91bmNlUmF0ZSA9IGFsbE90aGVyRGF0YVtcImdhOmJvdW5jZVJhdGVcIl07XG4gICAgbGV0IG5ld1VzZXJzID0gYWxsT3RoZXJEYXRhW1wiZ2E6bmV3VXNlcnNcIl07XG4gICAgbGV0IGF2ZXJhZ2VTZXNzaW9uID0gYWxsT3RoZXJEYXRhW1wiZ2E6c2Vzc2lvbkR1cmF0aW9uXCJdO1xuXG4gICAgLy8gTmF2QmFyIEluZm9ybWF0aW9uXG4gICAgbGV0IGdhV2ViUHJvcGVydHkgPSBwcm9maWxlSW5mb1tcIndlYlByb3BlcnR5SWRcIl07XG5cbiAgICAkKFwiI2dhQ2xpY2tzXCIpLmFwcGVuZCh0b3RhbEFkQ2xpY2tzKTtcbiAgICAkKFwiI2dhQ29zdFwiKS5hcHBlbmQodG90YWxBZENvc3QpO1xuICAgICQoXCIjYWRDdHJcIikuYXBwZW5kKGNsaWNrVGhyb3VnaFJhdGlvKTtcbiAgICAkKFwiI2FkQ3BjXCIpLmFwcGVuZChjb3N0UGVyQ2xpY2spO1xuICAgICQoXCIjYWRJbXByZXNzaW9uc1wiKS5hcHBlbmQoYWRJbXByZXNzaW9ucyk7XG5cbiAgICAkKFwiI2dhU2Vzc2lvbnNcIikuYXBwZW5kKHRvdGFsU2Vzc2lvbnMpO1xuICAgICQoXCIjZ2FCb3VuY2VSYXRlXCIpLmFwcGVuZChib3VuY2VSYXRlKTtcbiAgICAkKFwiI2dhTmV3VXNlcnNcIikuYXBwZW5kKG5ld1VzZXJzKTtcbiAgICAkKFwiI2dhU2Vzc2lvbkR1cmF0aW9uXCIpLmFwcGVuZChhdmVyYWdlU2Vzc2lvbik7XG5cbiAgICAkKFwiI2dhV2ViUHJvcGVydHlcIikuYXBwZW5kKGdhV2ViUHJvcGVydHkpO1xuXG4gIH0pO1xufVxuXG5cbi8vIElmIHVzZXIgaXMgbG9nZ2VkIGluLCBzaG93IHRoZSBHb29nbGUgQ2hhcnQgZGF0YVxuZ29vZ2xlRGFzaC5hY3RpdmVVc2VyID0gZnVuY3Rpb24oKSB7XG4gICAgZmlyZWJhc2UuYXV0aCgpLm9uQXV0aFN0YXRlQ2hhbmdlZChmdW5jdGlvbih1c2VyKSB7XG4gICAgaWYgKHVzZXIpIHtcbiAgICAgIGdvb2dsZURhc2guZHJhd1Zpc3VhbGl6YXRpb24oKTtcbiAgICAgICQoJyNsb2dpbk1vZGVsJykudG9nZ2xlQ2xhc3MoJ2hpZGVFbGVtZW50Jyk7XG4gICAgICAkKCcjbmF2YmFyU3RhdHVzJykuYXBwZW5kKCdcXFxuICAgICAgICA8ZGl2IGNsYXNzPVwibmF2YmFyXCI+XFxcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibmF2YmFyX19oZWFkZXJcIj5cXFxuICAgICAgICAgICAgPGgyPldlbGNvbWU8L2gyPlxcXG4gICAgICAgICAgICA8aW1nIHNyYz1cImFzc2V0cy9mb290ZXJfbG9nb19jb2xvcl90cmFucy5wbmdcIiBhbHQ9XCJcIj5cXFxuICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm5hdmJhcl9fdGltZUZyYW1lXCI+XFxcbiAgICAgICAgICAgIDxwPlJlc3VsdHMgVGltZSBGcmFtZTwvcD5cXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm5hdmJhcl9fdGltZUZyYW1lLS1kYXRlXCI+XFxcbiAgICAgICAgICAgICAgPHNwYW4gaWQ9XCJzdGFydERhdGVcIj48L3NwYW4+IHRvIDxzcGFuIGlkPVwiZW5kRGF0ZVwiPjwvc3Bhbj5cXFxuICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJuYXZiYXJfX3Byb2ZpbGVcIj5cXFxuICAgICAgICAgICAgPHA+WW91ciBHb29nbGUgQW5hbHl0aWNzIFdlYiBJRDwvcD5cXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm5hdmJhcl9fdGltZUZyYW1lLS1kYXRlXCI+XFxcbiAgICAgICAgICAgICAgPHNwYW4gaWQ9XCJnYVdlYlByb3BlcnR5XCI+PC9zcGFuPlxcXG4gICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm5hdmJhcl9fZm9vdGVyXCI+XFxcbiAgICAgICAgICAgIDxwPkxvZ2dlZCBJbiBBczo8YnI+PHNwYW4gaWQ9XCJ1c2VyRW1haWxcIj48L3NwYW4+PC9wPlxcXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIGlkPVwibG9nT3V0XCIgdmFsdWU9XCJTaWduIE91dFwiIGNsYXNzPVwibmF2YmFyX19sb2dPdXRcIj48L2lucHV0PlxcXG4gICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgPC9kaXY+Jyk7XG5cbiAgICAgIGdvb2dsZURhc2guZ2V0VXNlckluZm8oKTtcbiAgICAgIGdvb2dsZURhc2guZ2V0T3RoZXJEYXRhKCk7XG4gICAgICBnb29nbGVEYXNoLmdldERhdGUoKTtcbiAgICAgIGdvb2dsZURhc2guc2lnbk91dCgpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHJ1biBlbHNlIGNvZGUgaWYgbmVjZXNzYXJ5XG4gICAgfVxuICB9KTtcbn1cblxuXG4vLyBHZXR0aW5nIGRhdGEgZnJvbSBHb29nbGUgU3VwZXJQcm94eSBhbmQgcHJpbnRzIHRvIHBhZ2Ugd2l0aCBHb29nbGUgQ2hhcnRzXG5nb29nbGVEYXNoLmRyYXdWaXN1YWxpemF0aW9uID0gZnVuY3Rpb24oKSB7XG4gIC8vIEdldHMgYnJvd3NlciBpbmZvIGZyb20gR0FcbiAgbGV0IHVzZXJzQnJvd3NlciA9IG5ldyBnb29nbGUudmlzdWFsaXphdGlvbi5DaGFydFdyYXBwZXIoe1xuICAgICBcImNvbnRhaW5lcklkXCI6IFwidXNlcnNCcm93c2VyXCIsXG4gICAgIFwiZGF0YVNvdXJjZVVybFwiOiAnaHR0cHM6Ly9zY2VuaWMta2lsbi0xNTg2MTcuYXBwc3BvdC5jb20vcXVlcnk/aWQ9YWhSemZuTmpaVzVwWXkxcmFXeHVMVEUxT0RZeE4zSVZDeElJUVhCcFVYVmxjbmtZZ0lDQWdJQ0FnQW9NJmZvcm1hdD1kYXRhLXRhYmxlLXJlc3BvbnNlJyxcbiAgICAgXCJyZWZyZXNoSW50ZXJ2YWxcIjogMzYwMCxcbiAgICAgXCJjaGFydFR5cGVcIjogXCJQaWVDaGFydFwiLFxuICAgICBcIm9wdGlvbnNcIjoge1xuICAgICAgICBcInNob3dSb3dOdW1iZXJcIiA6IHRydWUsXG4gICAgICAgIFwid2lkdGhcIjogNTAwLFxuICAgICAgICBcImhlaWdodFwiOiAzMDAsXG4gICAgICAgIFwiaXMzRFwiOiBmYWxzZSxcbiAgICAgICAgXCJ0aXRsZVwiOiBcIkNsaWNrIFNvdXJjZVwiXG4gICAgIH1cbiAgIH0pO1xuICBcbiAgLy8gR2V0cyBjbGljayBzb3VyY2UgaW5mbyBmcm9tIEdBXG4gIGxldCB1c2Vyc0NsaWNrU291cmNlID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLkNoYXJ0V3JhcHBlcih7XG4gICAgICAvLyBFeGFtcGxlIEJyb3dzZXIgU2hhcmUgUXVlcnlcbiAgICAgXCJjb250YWluZXJJZFwiOiBcInVzZXJzQ2xpY2tTb3VyY2VcIixcbiAgICAgXCJkYXRhU291cmNlVXJsXCI6IFwiaHR0cHM6Ly9zY2VuaWMta2lsbi0xNTg2MTcuYXBwc3BvdC5jb20vcXVlcnk/aWQ9YWhSemZuTmpaVzVwWXkxcmFXeHVMVEUxT0RZeE4zSVZDeElJUVhCcFVYVmxjbmtZZ0lDQWdMeWhnZ29NJmZvcm1hdD1kYXRhLXRhYmxlLXJlc3BvbnNlXCIsXG4gICAgIFwicmVmcmVzaEludGVydmFsXCI6IDM2MDAsXG4gICAgIFwiY2hhcnRUeXBlXCI6IFwiUGllQ2hhcnRcIixcbiAgICAgXCJvcHRpb25zXCI6IHtcbiAgICAgICAgXCJzaG93Um93TnVtYmVyXCIgOiB0cnVlLFxuICAgICAgICBcIndpZHRoXCI6IDUwMCxcbiAgICAgICAgXCJoZWlnaHRcIjogMzAwLFxuICAgICAgICBcImlzM0RcIjogZmFsc2UsXG4gICAgICAgIFwidGl0bGVcIjogXCJNb3N0IFVzZWQgQnJvd3NlcnNcIlxuICAgICB9XG4gICB9KTtcblxuICAvLyBHZXRzIGNsaWNrIHNvdXJjZSBpbmZvIGZyb20gR0FcbiAgbGV0IHVzZXJzQ2FtcGFpZ25Tb3VyY2VzID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLkNoYXJ0V3JhcHBlcih7XG4gICAgICAvLyBFeGFtcGxlIEJyb3dzZXIgU2hhcmUgUXVlcnlcbiAgICAgXCJjb250YWluZXJJZFwiOiBcInVzZXJzQ2FtcGFpZ25Tb3VyY2VzXCIsXG4gICAgIFwiZGF0YVNvdXJjZVVybFwiOiBcImh0dHBzOi8vc2NlbmljLWtpbG4tMTU4NjE3LmFwcHNwb3QuY29tL3F1ZXJ5P2lkPWFoUnpmbk5qWlc1cFl5MXJhV3h1TFRFMU9EWXhOM0lWQ3hJSVFYQnBVWFZsY25rWWdJQ0FnTnEzbHdvTSZmb3JtYXQ9ZGF0YS10YWJsZS1yZXNwb25zZVwiLFxuICAgICBcInJlZnJlc2hJbnRlcnZhbFwiOiAzNjAwLFxuICAgICBcImNoYXJ0VHlwZVwiOiBcIlBpZUNoYXJ0XCIsXG4gICAgIFwib3B0aW9uc1wiOiB7XG4gICAgICAgIFwic2hvd1Jvd051bWJlclwiIDogdHJ1ZSxcbiAgICAgICAgXCJ3aWR0aFwiOiA1MDAsXG4gICAgICAgIFwiaGVpZ2h0XCI6IDMwMCxcbiAgICAgICAgXCJpczNEXCI6IGZhbHNlLFxuICAgICAgICBcInRpdGxlXCI6IFwiQWRXb3JkcyBDYW1wYWlnbiBTb3VyY2VcIlxuICAgICB9XG4gICB9KTtcblxuICAvLyBHZXRzIGNsaWNrIHNvdXJjZSBpbmZvIGZyb20gR0FcbiAgbGV0IHVzZXJzT3BlcmF0aW5nU3lzdGVtID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLkNoYXJ0V3JhcHBlcih7XG4gICAgICAvLyBFeGFtcGxlIEJyb3dzZXIgU2hhcmUgUXVlcnlcbiAgICAgXCJjb250YWluZXJJZFwiOiBcInVzZXJzT3BlcmF0aW5nU3lzdGVtXCIsXG4gICAgIFwiZGF0YVNvdXJjZVVybFwiOiBcImh0dHBzOi8vc2NlbmljLWtpbG4tMTU4NjE3LmFwcHNwb3QuY29tL3F1ZXJ5P2lkPWFoUnpmbk5qWlc1cFl5MXJhV3h1TFRFMU9EWXhOM0lWQ3hJSVFYQnBVWFZsY25rWWdJQ0FnTjZNa0FvTSZmb3JtYXQ9ZGF0YS10YWJsZS1yZXNwb25zZVwiLFxuICAgICBcInJlZnJlc2hJbnRlcnZhbFwiOiAzNjAwLFxuICAgICBcImNoYXJ0VHlwZVwiOiBcIlBpZUNoYXJ0XCIsXG4gICAgIFwib3B0aW9uc1wiOiB7XG4gICAgICAgIFwic2hvd1Jvd051bWJlclwiIDogdHJ1ZSxcbiAgICAgICAgXCJ3aWR0aFwiOiA1MDAsXG4gICAgICAgIFwiaGVpZ2h0XCI6IDMwMCxcbiAgICAgICAgXCJpczNEXCI6IGZhbHNlLFxuICAgICAgICBcInRpdGxlXCI6IFwiT3BlcmF0aW5nIFN5c3RlbXNcIlxuICAgICB9XG4gICB9KTtcblxuXG4gIC8vIENhbGxpbmcgdGhlIGZ1bmN0aW9ucyB0byBwcmludCBjaGFydHMgaW4gRE9NXG4gIHVzZXJzQnJvd3Nlci5kcmF3KCk7XG4gIHVzZXJzQ2xpY2tTb3VyY2UuZHJhdygpO1xuICB1c2Vyc0NhbXBhaWduU291cmNlcy5kcmF3KCk7XG4gIHVzZXJzT3BlcmF0aW5nU3lzdGVtLmRyYXcoKTtcbn1cblxuXG4vLyBEb2N1bWVudCByZWFkeVxuJChmdW5jdGlvbigpIHtcbiAgZ29vZ2xlRGFzaC5pbml0KCk7XG59KTtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuLy8gLy8gRGlzcGxheWluZyBHb29nbGUgQWRXb3JkcyBkYXRhIGZyb20gc2hlZXRzXG4vLyB2YXIgcHVibGljU3ByZWFkc2hlZXRVcmwgPSAnaHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vc3ByZWFkc2hlZXRzL2QvMUtIMTl6eUNOQVhfeHVzV0hiSFN0SzcwYTFWYUJ5cWxXWGFXWGVzOHN4T2MvcHViaHRtbCc7XG5cbi8vIGZ1bmN0aW9uIGluaXQoKSB7XG4vLyBUYWJsZXRvcC5pbml0KCB7IGtleTogcHVibGljU3ByZWFkc2hlZXRVcmwsXG4vLyAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBzaG93SW5mbyxcbi8vICAgICAgICAgICAgICAgICAgc2ltcGxlU2hlZXQ6IHRydWUgfSApXG4vLyB9XG5cbi8vIGZ1bmN0aW9uIHNob3dJbmZvKGRhdGEsIHRhYmxldG9wKSB7XG4vLyBjb25zb2xlLmxvZyhkYXRhKTtcbi8vIH1cblxuLy8gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBpbml0KSJdfQ==
