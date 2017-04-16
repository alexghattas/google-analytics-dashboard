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
  $('#otherDataMain').hide();
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

  // Show and hide info div for definitions
  $('#showInfo__clicks, #showInfo__total, #showInfo__ctr, #showInfo__cpc, #showInfo__impressions, #showInfo__visits, #showInfo__bounce, #showInfo__newUsers, #showInfo__sessions').on('click', function () {
    $(this).children('.otherData__showInfo').fadeToggle();
  });
};

googleDash.signOut = function () {
  $('#logOut').on("click", function (e) {
    e.preventDefault();
    firebase.auth().signOut().then(function () {
      $('#otherDataMain').hide();
      window.location.reload(false);
    }, function (error) {
      console.error('Sign Out Error', error);
    });
  });
};

// Get users profile information from Firebase
googleDash.getUserInfo = function () {
  var userEmail = firebase.auth().currentUser.email;
  $('#userEmail').append(userEmail);
};

// Gets data, from yesterday to 30 days before, convert string to "Day Month Year"
googleDash.getDate = function () {
  var startDate = new Date(new Date().getTime() - 744 * 60 * 60 * 1000);
  startDate = new Date(startDate).toUTCString();
  startDate = startDate.split(' ').slice(1, 4).join(' ');

  var endDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
  endDate = new Date(endDate).toUTCString();
  endDate = endDate.split(' ').slice(1, 4).join(' ');

  $('#startDate').append(startDate);
  $('#endDate').append(endDate);
};

// Get other data from Google Superproxy
googleDash.getOtherData = function () {
  $.ajax({
    url: 'https://scenic-kiln-158617.appspot.com/query?id=ahRzfnNjZW5pYy1raWxuLTE1ODYxN3IVCxIIQXBpUXVlcnkYgICAgN7qiQoM',
    method: 'GET',
    dataType: 'jsonp'
  }).then(function (otherData) {
    var allOtherData = otherData.totalsForAllResults;
    var profileInfo = otherData["profileInfo"];

    // Google AdWords Data
    var costPerClick = allOtherData["ga:CPC"];
    costPerClick = costPerClick.substring(0, 4);
    var clickThroughRatio = allOtherData["ga:CTR"];
    clickThroughRatio = clickThroughRatio.substring(0, 4);

    var totalAdClicks = allOtherData["ga:adClicks"];
    var totalAdCost = allOtherData["ga:adCost"];
    var adImpressions = allOtherData["ga:impressions"];

    // Google Analytics Data
    var totalSessions = allOtherData["ga:sessions"];
    var bounceRate = allOtherData["ga:bounceRate"];
    bounceRate = bounceRate.substring(0, 4);
    var newUsers = allOtherData["ga:newUsers"];
    var averageSession = allOtherData["ga:sessionDuration"];

    // NavBar Information
    var gaWebProperty = profileInfo["webPropertyId"];

    // Print AdWords data to DOM
    $("#gaClicks").append(totalAdClicks);
    $("#gaCost").append(totalAdCost);
    $("#adCtr").append(clickThroughRatio);
    $("#adCpc").append(costPerClick);
    $("#adImpressions").append(adImpressions);

    // Print GA data to DOM
    $("#gaSessions").append(totalSessions);
    $("#gaBounceRate").append(bounceRate);
    $("#gaNewUsers").append(newUsers);
    $("#gaSessionDuration").append(averageSession);

    // Print user profile information to DOM
    $("#gaWebProperty").append(gaWebProperty);
  });
};

// If user is logged in, show the Google Chart data
googleDash.activeUser = function () {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      googleDash.drawVisualization();
      $('#loginModel').toggleClass('hideElement');
      $('#otherDataMain').show();
      $('#navbarStatus').append('\
        <div class="navbar">\
          <div class="navbar__header">\
            <h2>Welcome</h2>\
            <img src="assets/footer_logo_color_trans.png" alt="">\
          </div>\
          <div class="navbar__timeFrame">\
            <p>Results Time Frame:</p>\
            <div class="navbar__timeFrame--date">\
              <p><span id="startDate"></span><br>to<br><span id="endDate"></span></p>\
            </div>\
          </div>\
          <div class="navbar__profile">\
            <p>Your Google Analytics Web ID:</p>\
            <div class="navbar__timeFrame--date">\
              <p><span id="gaWebProperty"></span></p>\
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBO0FBQ0EsSUFBSSxhQUFhLEVBQWpCOztBQUVBO0FBQ0EsSUFBSSxTQUFTO0FBQ1gsVUFBUSx5Q0FERztBQUVYLGNBQVksOEJBRkQ7QUFHWCxlQUFhLHFDQUhGO0FBSVgsYUFBVyxjQUpBO0FBS1gsaUJBQWUsMEJBTEo7QUFNWCxxQkFBbUI7QUFOUixDQUFiOztBQVNBO0FBQ0EsU0FBUyxhQUFULENBQXVCLE1BQXZCOztBQUVBO0FBQ0EsSUFBSSxRQUFRLFNBQVMsUUFBVCxHQUFvQixHQUFwQixFQUFaOztBQUVBO0FBQ0EsV0FBVyxJQUFYLEdBQWtCLFlBQVk7QUFDMUIsSUFBRSxnQkFBRixFQUFvQixJQUFwQjtBQUNBLGFBQVcsSUFBWDtBQUNBLGFBQVcsTUFBWDtBQUNILENBSkQ7O0FBT0E7QUFDQSxXQUFXLElBQVgsR0FBa0IsWUFBVztBQUMzQixJQUFFLE1BQUYsRUFBVSxFQUFWLENBQWEsUUFBYixFQUF1QixVQUFTLENBQVQsRUFBWTtBQUMvQixNQUFFLGNBQUY7QUFDQTtBQUNBLFFBQUksWUFBWSxFQUFFLFdBQUYsRUFBZSxHQUFmLEVBQWhCO0FBQ0EsUUFBSSxlQUFlLEVBQUUsV0FBRixFQUFlLEdBQWYsRUFBbkI7O0FBRUEsYUFBUyxJQUFULEdBQWdCLDBCQUFoQixDQUEyQyxTQUEzQyxFQUFzRCxZQUF0RCxFQUFvRSxLQUFwRSxDQUEwRSxVQUFTLEtBQVQsRUFBZ0I7QUFDeEY7QUFDQSxVQUFJLFlBQVksTUFBTSxJQUF0QjtBQUNBLFVBQUksZUFBZSxNQUFNLE9BQXpCOztBQUVBLFVBQUksY0FBYyxxQkFBbEIsRUFBeUM7QUFDdkMsY0FBTSxpQkFBTjtBQUNELE9BRkQsTUFHSztBQUNILGNBQU0sWUFBTjtBQUNEO0FBQ0YsS0FYRDtBQVlBO0FBQ0EsTUFBRSxNQUFGLEVBQVUs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QUYrQztBQUc5RCxxQkFBaUIseUlBSDZDO0FBSTlELHVCQUFtQixJQUoyQztBQUs5RCxpQkFBYSxVQUxpRDtBQU05RCxlQUFXO0FBQ1IsdUJBQWtCLElBRFY7QUFFUixlQUFTLEdBRkQ7QUFHUixnQkFBVSxHQUhGO0FBSVIsY0FBUSxLQUpBO0FBS1IsZUFBUztBQUxEO0FBTm1ELEdBQXRDLENBQTNCOztBQWlCQTtBQUNBLGVBQWEsSUFBYjtBQUNBLG1CQUFpQixJQUFqQjtBQUNBLHVCQUFxQixJQUFyQjtBQUNBLHVCQUFxQixJQUFyQjtBQUNELENBdkVEOztBQTBFQTtBQUNBLEVBQUUsWUFBVztBQUNYLGFBQVcsSUFBWDtBQUNELENBRkQ7O0FBZ0JBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gQ3JlYXRlIG9iamVjdCBmb3IgbmFtZSBzcGFjaW5nXG52YXIgZ29vZ2xlRGFzaCA9IHt9O1xuXG4vLyBDb25uZWN0IHRvIEZpcmViYXNlXG52YXIgY29uZmlnID0ge1xuICBhcGlLZXk6IFwiQUl6YVN5RC1lVE1kRFVXLXZ4dGFNS3BWbExHZmJ5eXdDNXJKajg0XCIsXG4gIGF1dGhEb21haW46IFwiYmVlci1tZS1mb29kLmZpcmViYXNlYXBwLmNvbVwiLFxuICBkYXRhYmFzZVVSTDogXCJodHRwczovL2JlZXItbWUtZm9vZC5maXJlYmFzZWlvLmNvbVwiLFxuICBwcm9qZWN0SWQ6IFwiYmVlci1tZS1mb29kXCIsXG4gIHN0b3JhZ2VCdWNrZXQ6IFwiYmVlci1tZS1mb29kLmFwcHNwb3QuY29tXCIsXG4gIG1lc3NhZ2luZ1NlbmRlcklkOiBcIjcwOTAyNjQ5MjcxXCJcbn07XG5cbi8vIEluaXRpYWxpemluZyBGaXJlYmFzZVxuZmlyZWJhc2UuaW5pdGlhbGl6ZUFwcChjb25maWcpO1xuXG4vLyBSZWZlcmVuY2luZyBGaXJlYmFzZSBEYXRhYmFzZVxudmFyIGRiUmVmID0gZmlyZWJhc2UuZGF0YWJhc2UoKS5yZWYoKTtcblxuLy8gSW5pdGlhbGl6ZSBmdW5jdGlvbiAoY2FsbGVkIGluIERvY3VtZW50IFJlYWR5IGF0IGJvdHRvbSlcbmdvb2dsZURhc2guaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkKCcjb3RoZXJEYXRhTWFpbicpLmhpZGUoKTtcbiAgICBnb29nbGVEYXNoLmZvcm0oKTtcbiAgICBnb29nbGVEYXNoLmV2ZW50cygpO1xufVxuXG5cbi8vIExvZ2luIGZvcm0gdG8gZ2V0IGFjY2VzcyB0byBkYXRhIHdpdGggRkIgQXV0aGVudGljYXRpb25cbmdvb2dsZURhc2guZm9ybSA9IGZ1bmN0aW9uKCkge1xuICAkKFwiZm9ybVwiKS5vbihcInN1Ym1pdFwiLCBmdW5jdGlvbihlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAvLyBHZXQgdmFsdWVzIGZyb20gbG9naW4gZm9ybVxuICAgICAgbGV0IHVzZXJMb2dpbiA9ICQoJyN1c2VyTmFtZScpLnZhbCgpO1xuICAgICAgbGV0IHVzZXJQYXNzd29yZCA9ICQoJyNwYXNzd29yZCcpLnZhbCgpO1xuXG4gICAgICBmaXJlYmFzZS5hdXRoKCkuc2lnbkluV2l0aEVtYWlsQW5kUGFzc3dvcmQodXNlckxvZ2luLCB1c2VyUGFzc3dvcmQpLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIC8vIEhhbmRsZSBFcnJvcnMgaGVyZS5cbiAgICAgICAgdmFyIGVycm9yQ29kZSA9IGVycm9yLmNvZGU7XG4gICAgICAgIHZhciBlcnJvck1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuXG4gICAgICAgIGlmIChlcnJvckNvZGUgPT09ICdhdXRoL3dyb25nLXBhc3N3b3JkJykge1xuICAgICAgICAgIGFsZXJ0KCdXcm9uZyBwYXNzd29yZC4nKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBhbGVydChlcnJvck1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIC8vIFJlc2V0cyBhbGwgZm9ybSBpbnB1dHMgdG8gbm90aGluZ1xuICAgICAgJCgnZm9ybScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICB9KTtcbiAgfSk7XG59XG5cblxuLy8gTWFpbiBldmVudCBmdW5jdGlvblxuZ29vZ2xlRGFzaC5ldmVudHMgPSBmdW5jdGlvbigpIHtcbiAgZ29vZ2xlRGFzaC5hY3RpdmVVc2VyKCk7XG5cbiAgLy8gU2hvdyBhbmQgaGlkZSBpbmZvIGRpdiBmb3IgZGVmaW5pdGlvbnNcbiAgJCgnI3Nob3dJbmZvX19jbGlja3MsICNzaG93SW5mb19fdG90YWwsICNzaG93SW5mb19fY3RyLCAjc2hvd0luZm9fX2NwYywgI3Nob3dJbmZvX19pbXByZXNzaW9ucywgI3Nob3dJbmZvX192aXNpdHMsICNzaG93SW5mb19fYm91bmNlLCAjc2hvd0luZm9fX25ld1VzZXJzLCAjc2hvd0luZm9fX3Nlc3Npb25zJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcbiAgICAgICQodGhpcykuY2hpbGRyZW4oJy5vdGhlckRhdGFfX3Nob3dJbmZvJykuZmFkZVRvZ2dsZSgpO1xuICB9KTtcbn1cblxuXG5nb29nbGVEYXNoLnNpZ25PdXQgPSBmdW5jdGlvbigpIHtcbiAgJCgnI2xvZ091dCcpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7IFxuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBmaXJlYmFzZS5hdXRoKCkuc2lnbk91dCgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAkKCcjb3RoZXJEYXRhTWFpbicpLmhpZGUoKTtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoZmFsc2UpO1xuICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdTaWduIE91dCBFcnJvcicsIGVycm9yKTtcbiAgICB9KTtcbiAgfSk7XG59XG5cblxuLy8gR2V0IHVzZXJzIHByb2ZpbGUgaW5mb3JtYXRpb24gZnJvbSBGaXJlYmFzZVxuZ29vZ2xlRGFzaC5nZXRVc2VySW5mbyA9IGZ1bmN0aW9uKCkge1xuICBsZXQgdXNlckVtYWlsID0gZmlyZWJhc2UuYXV0aCgpLmN1cnJlbnRVc2VyLmVtYWlsO1xuICAkKCcjdXNlckVtYWlsJykuYXBwZW5kKHVzZXJFbWFpbCk7XG59XG5cblxuLy8gR2V0cyBkYXRhLCBmcm9tIHllc3RlcmRheSB0byAzMCBkYXlzIGJlZm9yZSwgY29udmVydCBzdHJpbmcgdG8gXCJEYXkgTW9udGggWWVhclwiXG5nb29nbGVEYXNoLmdldERhdGUgPSBmdW5jdGlvbigpIHtcbiAgbGV0IHN0YXJ0RGF0ZSA9IG5ldyBEYXRlKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gNzQ0ICogNjAgKiA2MCAqIDEwMDApO1xuICBzdGFydERhdGUgPSBuZXcgRGF0ZShzdGFydERhdGUpLnRvVVRDU3RyaW5nKCk7XG4gIHN0YXJ0RGF0ZSA9IHN0YXJ0RGF0ZS5zcGxpdCgnICcpLnNsaWNlKDEsIDQpLmpvaW4oJyAnKTtcblxuICBsZXQgZW5kRGF0ZSA9IG5ldyBEYXRlKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gMjQgKiA2MCAqIDYwICogMTAwMCk7XG4gIGVuZERhdGUgPSBuZXcgRGF0ZShlbmREYXRlKS50b1VUQ1N0cmluZygpO1xuICBlbmREYXRlID0gZW5kRGF0ZS5zcGxpdCgnICcpLnNsaWNlKDEsIDQpLmpvaW4oJyAnKTtcblxuICAkKCcjc3RhcnREYXRlJykuYXBwZW5kKHN0YXJ0RGF0ZSk7XG4gICQoJyNlbmREYXRlJykuYXBwZW5kKGVuZERhdGUpO1xufVxuXG4vLyBHZXQgb3RoZXIgZGF0YSBmcm9tIEdvb2dsZSBTdXBlcnByb3h5XG5nb29nbGVEYXNoLmdldE90aGVyRGF0YSA9IGZ1bmN0aW9uKCkge1xuICAkLmFqYXgoe1xuICAgIHVybDogJ2h0dHBzOi8vc2NlbmljLWtpbG4tMTU4NjE3LmFwcHNwb3QuY29tL3F1ZXJ5P2lkPWFoUnpmbk5qWlc1cFl5MXJhV3h1TFRFMU9EWXhOM0lWQ3hJSVFYQnBVWFZsY25rWWdJQ0FnTjdxaVFvTScsXG4gICAgbWV0aG9kOiAnR0VUJyxcbiAgICBkYXRhVHlwZTogJ2pzb25wJ1xuICB9KS50aGVuKGZ1bmN0aW9uKG90aGVyRGF0YSkge1xuICAgIGxldCBhbGxPdGhlckRhdGEgPSBvdGhlckRhdGEudG90YWxzRm9yQWxsUmVzdWx0cztcbiAgICBsZXQgcHJvZmlsZUluZm8gPSBvdGhlckRhdGFbXCJwcm9maWxlSW5mb1wiXTtcbiAgICBcbiAgICAvLyBHb29nbGUgQWRXb3JkcyBEYXRhXG4gICAgbGV0IGNvc3RQZXJDbGljayA9IGFsbE90aGVyRGF0YVtcImdhOkNQQ1wiXTtcbiAgICBjb3N0UGVyQ2xpY2sgPSBjb3N0UGVyQ2xpY2suc3Vic3RyaW5nKDAsIDQpO1xuICAgIGxldCBjbGlja1Rocm91Z2hSYXRpbyA9IGFsbE90aGVyRGF0YVtcImdhOkNUUlwiXVxuICAgIGNsaWNrVGhyb3VnaFJhdGlvID0gY2xpY2tUaHJvdWdoUmF0aW8uc3Vic3RyaW5nKDAsIDQpO1xuXG4gICAgbGV0IHRvdGFsQWRDbGlja3MgPSBhbGxPdGhlckRhdGFbXCJnYTphZENsaWNrc1wiXTtcbiAgICBsZXQgdG90YWxBZENvc3QgPSBhbGxPdGhlckRhdGFbXCJnYTphZENvc3RcIl07XG4gICAgbGV0IGFkSW1wcmVzc2lvbnMgPSBhbGxPdGhlckRhdGFbXCJnYTppbXByZXNzaW9uc1wiXTtcblxuICAgIC8vIEdvb2dsZSBBbmFseXRpY3MgRGF0YVxuICAgIGxldCB0b3RhbFNlc3Npb25zID0gYWxsT3RoZXJEYXRhW1wiZ2E6c2Vzc2lvbnNcIl07XG4gICAgbGV0IGJvdW5jZVJhdGUgPSBhbGxPdGhlckRhdGFbXCJnYTpib3VuY2VSYXRlXCJdO1xuICAgIGJvdW5jZVJhdGUgPSBib3VuY2VSYXRlLnN1YnN0cmluZygwLCA0KTtcbiAgICBsZXQgbmV3VXNlcnMgPSBhbGxPdGhlckRhdGFbXCJnYTpuZXdVc2Vyc1wiXTtcbiAgICBsZXQgYXZlcmFnZVNlc3Npb24gPSBhbGxPdGhlckRhdGFbXCJnYTpzZXNzaW9uRHVyYXRpb25cIl07XG5cbiAgICAvLyBOYXZCYXIgSW5mb3JtYXRpb25cbiAgICBsZXQgZ2FXZWJQcm9wZXJ0eSA9IHByb2ZpbGVJbmZvW1wid2ViUHJvcGVydHlJZFwiXTtcbiAgICBcbiAgICAvLyBQcmludCBBZFdvcmRzIGRhdGEgdG8gRE9NXG4gICAgJChcIiNnYUNsaWNrc1wiKS5hcHBlbmQodG90YWxBZENsaWNrcyk7XG4gICAgJChcIiNnYUNvc3RcIikuYXBwZW5kKHRvdGFsQWRDb3N0KTtcbiAgICAkKFwiI2FkQ3RyXCIpLmFwcGVuZChjbGlja1Rocm91Z2hSYXRpbyk7XG4gICAgJChcIiNhZENwY1wiKS5hcHBlbmQoY29zdFBlckNsaWNrKTtcbiAgICAkKFwiI2FkSW1wcmVzc2lvbnNcIikuYXBwZW5kKGFkSW1wcmVzc2lvbnMpO1xuXG4gICAgLy8gUHJpbnQgR0EgZGF0YSB0byBET01cbiAgICAkKFwiI2dhU2Vzc2lvbnNcIikuYXBwZW5kKHRvdGFsU2Vzc2lvbnMpO1xuICAgICQoXCIjZ2FCb3VuY2VSYXRlXCIpLmFwcGVuZChib3VuY2VSYXRlKTtcbiAgICAkKFwiI2dhTmV3VXNlcnNcIikuYXBwZW5kKG5ld1VzZXJzKTtcbiAgICAkKFwiI2dhU2Vzc2lvbkR1cmF0aW9uXCIpLmFwcGVuZChhdmVyYWdlU2Vzc2lvbik7XG4gICAgXG4gICAgLy8gUHJpbnQgdXNlciBwcm9maWxlIGluZm9ybWF0aW9uIHRvIERPTVxuICAgICQoXCIjZ2FXZWJQcm9wZXJ0eVwiKS5hcHBlbmQoZ2FXZWJQcm9wZXJ0eSk7XG5cbiAgfSk7XG59XG5cblxuLy8gSWYgdXNlciBpcyBsb2dnZWQgaW4sIHNob3cgdGhlIEdvb2dsZSBDaGFydCBkYXRhXG5nb29nbGVEYXNoLmFjdGl2ZVVzZXIgPSBmdW5jdGlvbigpIHtcbiAgICBmaXJlYmFzZS5hdXRoKCkub25BdXRoU3RhdGVDaGFuZ2VkKGZ1bmN0aW9uKHVzZXIpIHtcbiAgICBpZiAodXNlcikge1xuICAgICAgZ29vZ2xlRGFzaC5kcmF3VmlzdWFsaXphdGlvbigpO1xuICAgICAgJCgnI2xvZ2luTW9kZWwnKS50b2dnbGVDbGFzcygnaGlkZUVsZW1lbnQnKTtcbiAgICAgICQoJyNvdGhlckRhdGFNYWluJykuc2hvdygpO1xuICAgICAgJCgnI25hdmJhclN0YXR1cycpLmFwcGVuZCgnXFxcbiAgICAgICAgPGRpdiBjbGFzcz1cIm5hdmJhclwiPlxcXG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm5hdmJhcl9faGVhZGVyXCI+XFxcbiAgICAgICAgICAgIDxoMj5XZWxjb21lPC9oMj5cXFxuICAgICAgICAgICAgPGltZyBzcmM9XCJhc3NldHMvZm9vdGVyX2xvZ29fY29sb3JfdHJhbnMucG5nXCIgYWx0PVwiXCI+XFxcbiAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJuYXZiYXJfX3RpbWVGcmFtZVwiPlxcXG4gICAgICAgICAgICA8cD5SZXN1bHRzIFRpbWUgRnJhbWU6PC9wPlxcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibmF2YmFyX190aW1lRnJhbWUtLWRhdGVcIj5cXFxuICAgICAgICAgICAgICA8cD48c3BhbiBpZD1cInN0YXJ0RGF0ZVwiPjwvc3Bhbj48YnI+dG88YnI+PHNwYW4gaWQ9XCJlbmREYXRlXCI+PC9zcGFuPjwvcD5cXFxuICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJuYXZiYXJfX3Byb2ZpbGVcIj5cXFxuICAgICAgICAgICAgPHA+WW91ciBHb29nbGUgQW5hbHl0aWNzIFdlYiBJRDo8L3A+XFxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJuYXZiYXJfX3RpbWVGcmFtZS0tZGF0ZVwiPlxcXG4gICAgICAgICAgICAgIDxwPjxzcGFuIGlkPVwiZ2FXZWJQcm9wZXJ0eVwiPjwvc3Bhbj48L3A+XFxcbiAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibmF2YmFyX19mb290ZXJcIj5cXFxuICAgICAgICAgICAgPHA+TG9nZ2VkIEluIEFzOjxicj48c3BhbiBpZD1cInVzZXJFbWFpbFwiPjwvc3Bhbj48L3A+XFxcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwic3VibWl0XCIgaWQ9XCJsb2dPdXRcIiB2YWx1ZT1cIlNpZ24gT3V0XCIgY2xhc3M9XCJuYXZiYXJfX2xvZ091dFwiPjwvaW5wdXQ+XFxcbiAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICA8L2Rpdj4nKTtcblxuICAgICAgZ29vZ2xlRGFzaC5nZXRVc2VySW5mbygpO1xuICAgICAgZ29vZ2xlRGFzaC5nZXRPdGhlckRhdGEoKTtcbiAgICAgIGdvb2dsZURhc2guZ2V0RGF0ZSgpO1xuICAgICAgZ29vZ2xlRGFzaC5zaWduT3V0KCk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gcnVuIGVsc2UgY29kZSBpZiBuZWNlc3NhcnlcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8vIEdldHRpbmcgZGF0YSBmcm9tIEdvb2dsZSBTdXBlclByb3h5IGFuZCBwcmludHMgdG8gcGFnZSB3aXRoIEdvb2dsZSBDaGFydHNcbmdvb2dsZURhc2guZHJhd1Zpc3VhbGl6YXRpb24gPSBmdW5jdGlvbigpIHtcbiAgLy8gR2V0cyBicm93c2VyIGluZm8gZnJvbSBHQVxuICBsZXQgdXNlcnNCcm93c2VyID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLkNoYXJ0V3JhcHBlcih7XG4gICAgIFwiY29udGFpbmVySWRcIjogXCJ1c2Vyc0Jyb3dzZXJcIixcbiAgICAgXCJkYXRhU291cmNlVXJsXCI6ICdodHRwczovL3NjZW5pYy1raWxuLTE1ODYxNy5hcHBzcG90LmNvbS9xdWVyeT9pZD1haFJ6Zm5OalpXNXBZeTFyYVd4dUxURTFPRFl4TjNJVkN4SUlRWEJwVVhWbGNua1lnSUNBZ0lDQWdBb00mZm9ybWF0PWRhdGEtdGFibGUtcmVzcG9uc2UnLFxuICAgICBcInJlZnJlc2hJbnRlcnZhbFwiOiAzNjAwLFxuICAgICBcImNoYXJ0VHlwZVwiOiBcIlBpZUNoYXJ0XCIsXG4gICAgIFwib3B0aW9uc1wiOiB7XG4gICAgICAgIFwic2hvd1Jvd051bWJlclwiIDogdHJ1ZSxcbiAgICAgICAgXCJ3aWR0aFwiOiA1MDAsXG4gICAgICAgIFwiaGVpZ2h0XCI6IDMwMCxcbiAgICAgICAgXCJpczNEXCI6IGZhbHNlLFxuICAgICAgICBcInRpdGxlXCI6IFwiQ2xpY2sgU291cmNlXCJcbiAgICAgfVxuICAgfSk7XG4gIFxuICAvLyBHZXRzIGNsaWNrIHNvdXJjZSBpbmZvIGZyb20gR0FcbiAgbGV0IHVzZXJzQ2xpY2tTb3VyY2UgPSBuZXcgZ29vZ2xlLnZpc3VhbGl6YXRpb24uQ2hhcnRXcmFwcGVyKHtcbiAgICAgIC8vIEV4YW1wbGUgQnJvd3NlciBTaGFyZSBRdWVyeVxuICAgICBcImNvbnRhaW5lcklkXCI6IFwidXNlcnNDbGlja1NvdXJjZVwiLFxuICAgICBcImRhdGFTb3VyY2VVcmxcIjogXCJodHRwczovL3NjZW5pYy1raWxuLTE1ODYxNy5hcHBzcG90LmNvbS9xdWVyeT9pZD1haFJ6Zm5OalpXNXBZeTFyYVd4dUxURTFPRFl4TjNJVkN4SUlRWEJwVVhWbGNua1lnSUNBZ0x5aGdnb00mZm9ybWF0PWRhdGEtdGFibGUtcmVzcG9uc2VcIixcbiAgICAgXCJyZWZyZXNoSW50ZXJ2YWxcIjogMzYwMCxcbiAgICAgXCJjaGFydFR5cGVcIjogXCJQaWVDaGFydFwiLFxuICAgICBcIm9wdGlvbnNcIjoge1xuICAgICAgICBcInNob3dSb3dOdW1iZXJcIiA6IHRydWUsXG4gICAgICAgIFwid2lkdGhcIjogNTAwLFxuICAgICAgICBcImhlaWdodFwiOiAzMDAsXG4gICAgICAgIFwiaXMzRFwiOiBmYWxzZSxcbiAgICAgICAgXCJ0aXRsZVwiOiBcIk1vc3QgVXNlZCBCcm93c2Vyc1wiXG4gICAgIH1cbiAgIH0pO1xuXG4gIC8vIEdldHMgY2xpY2sgc291cmNlIGluZm8gZnJvbSBHQVxuICBsZXQgdXNlcnNDYW1wYWlnblNvdXJjZXMgPSBuZXcgZ29vZ2xlLnZpc3VhbGl6YXRpb24uQ2hhcnRXcmFwcGVyKHtcbiAgICAgIC8vIEV4YW1wbGUgQnJvd3NlciBTaGFyZSBRdWVyeVxuICAgICBcImNvbnRhaW5lcklkXCI6IFwidXNlcnNDYW1wYWlnblNvdXJjZXNcIixcbiAgICAgXCJkYXRhU291cmNlVXJsXCI6IFwiaHR0cHM6Ly9zY2VuaWMta2lsbi0xNTg2MTcuYXBwc3BvdC5jb20vcXVlcnk/aWQ9YWhSemZuTmpaVzVwWXkxcmFXeHVMVEUxT0RZeE4zSVZDeElJUVhCcFVYVmxjbmtZZ0lDQWdOcTNsd29NJmZvcm1hdD1kYXRhLXRhYmxlLXJlc3BvbnNlXCIsXG4gICAgIFwicmVmcmVzaEludGVydmFsXCI6IDM2MDAsXG4gICAgIFwiY2hhcnRUeXBlXCI6IFwiUGllQ2hhcnRcIixcbiAgICAgXCJvcHRpb25zXCI6IHtcbiAgICAgICAgXCJzaG93Um93TnVtYmVyXCIgOiB0cnVlLFxuICAgICAgICBcIndpZHRoXCI6IDUwMCxcbiAgICAgICAgXCJoZWlnaHRcIjogMzAwLFxuICAgICAgICBcImlzM0RcIjogZmFsc2UsXG4gICAgICAgIFwidGl0bGVcIjogXCJBZFdvcmRzIENhbXBhaWduIFNvdXJjZVwiXG4gICAgIH1cbiAgIH0pO1xuXG4gIC8vIEdldHMgY2xpY2sgc291cmNlIGluZm8gZnJvbSBHQVxuICBsZXQgdXNlcnNPcGVyYXRpbmdTeXN0ZW0gPSBuZXcgZ29vZ2xlLnZpc3VhbGl6YXRpb24uQ2hhcnRXcmFwcGVyKHtcbiAgICAgIC8vIEV4YW1wbGUgQnJvd3NlciBTaGFyZSBRdWVyeVxuICAgICBcImNvbnRhaW5lcklkXCI6IFwidXNlcnNPcGVyYXRpbmdTeXN0ZW1cIixcbiAgICAgXCJkYXRhU291cmNlVXJsXCI6IFwiaHR0cHM6Ly9zY2VuaWMta2lsbi0xNTg2MTcuYXBwc3BvdC5jb20vcXVlcnk/aWQ9YWhSemZuTmpaVzVwWXkxcmFXeHVMVEUxT0RZeE4zSVZDeElJUVhCcFVYVmxjbmtZZ0lDQWdONk1rQW9NJmZvcm1hdD1kYXRhLXRhYmxlLXJlc3BvbnNlXCIsXG4gICAgIFwicmVmcmVzaEludGVydmFsXCI6IDM2MDAsXG4gICAgIFwiY2hhcnRUeXBlXCI6IFwiUGllQ2hhcnRcIixcbiAgICAgXCJvcHRpb25zXCI6IHtcbiAgICAgICAgXCJzaG93Um93TnVtYmVyXCIgOiB0cnVlLFxuICAgICAgICBcIndpZHRoXCI6IDUwMCxcbiAgICAgICAgXCJoZWlnaHRcIjogMzAwLFxuICAgICAgICBcImlzM0RcIjogZmFsc2UsXG4gICAgICAgIFwidGl0bGVcIjogXCJPcGVyYXRpbmcgU3lzdGVtc1wiXG4gICAgIH1cbiAgIH0pO1xuXG5cblxuICAvLyBDYWxsaW5nIHRoZSBmdW5jdGlvbnMgdG8gcHJpbnQgY2hhcnRzIGluIERPTVxuICB1c2Vyc0Jyb3dzZXIuZHJhdygpO1xuICB1c2Vyc0NsaWNrU291cmNlLmRyYXcoKTtcbiAgdXNlcnNDYW1wYWlnblNvdXJjZXMuZHJhdygpO1xuICB1c2Vyc09wZXJhdGluZ1N5c3RlbS5kcmF3KCk7XG59XG5cblxuLy8gRG9jdW1lbnQgcmVhZHlcbiQoZnVuY3Rpb24oKSB7XG4gIGdvb2dsZURhc2guaW5pdCgpO1xufSk7XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbi8vIC8vIERpc3BsYXlpbmcgR29vZ2xlIEFkV29yZHMgZGF0YSBmcm9tIHNoZWV0c1xuLy8gdmFyIHB1YmxpY1NwcmVhZHNoZWV0VXJsID0gJ2h0dHBzOi8vZG9jcy5nb29nbGUuY29tL3NwcmVhZHNoZWV0cy9kLzFLSDE5enlDTkFYX3h1c1dIYkhTdEs3MGExVmFCeXFsV1hhV1hlczhzeE9jL3B1Ymh0bWwnO1xuXG4vLyBmdW5jdGlvbiBpbml0KCkge1xuLy8gVGFibGV0b3AuaW5pdCggeyBrZXk6IHB1YmxpY1NwcmVhZHNoZWV0VXJsLFxuLy8gICAgICAgICAgICAgICAgICBjYWxsYmFjazogc2hvd0luZm8sXG4vLyAgICAgICAgICAgICAgICAgIHNpbXBsZVNoZWV0OiB0cnVlIH0gKVxuLy8gfVxuXG4vLyBmdW5jdGlvbiBzaG93SW5mbyhkYXRhLCB0YWJsZXRvcCkge1xuLy8gY29uc29sZS5sb2coZGF0YSk7XG4vLyB9XG5cbi8vIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgaW5pdCkiXX0=
