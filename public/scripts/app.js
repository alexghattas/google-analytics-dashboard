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
    var allOtherData = otherData.totalsForAllResults;
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

    $("#gaClicks").append(totalAdClicks);
    $("#gaCost").append(totalAdCost);
    $("#adCtr").append(clickThroughRatio);
    $("#adCpc").append(costPerClick);
    $("#adImpressions").append(adImpressions);

    $("#gaSessions").append(totalSessions);
    $("#gaBounceRate").append(bounceRate);
    $("#gaNewUsers").append(newUsers);
    $("#gaSessionDuration").append(averageSession);
  });
};

// If user is logged in, show the Google Chart data
googleDash.activeUser = function () {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      googleDash.drawVisualization();
      $('#loginModel').toggleClass('hideElement');
      $('#navbarStatus').append('<div class="navbar"><div class="navbar__header"><h2>Welcome</h2><img src="assets/footer_logo_color_trans.png" alt=""></div><div class="navbar__timeFrame"><p>Results Time Frame</p><div class="navbar__timeFrame--date"><span id="startDate"></span> to <span id="endDate"></span></div></div><div class="navbar__footer"><p>Logged In As:<br><span id="userEmail"></span></p><input type="submit" id="logOut" value="Sign Out" class="navbar__logOut"></input></div></div>');

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
      "width": 630,
      "height": 440,
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
      "width": 630,
      "height": 440,
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
      "width": 630,
      "height": 440,
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
      "width": 630,
      "height": 440,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBO0FBQ0EsSUFBSSxhQUFhLEVBQWpCOztBQUVBO0FBQ0EsSUFBSSxTQUFTO0FBQ1gsVUFBUSx5Q0FERztBQUVYLGNBQVksOEJBRkQ7QUFHWCxlQUFhLHFDQUhGO0FBSVgsYUFBVyxjQUpBO0FBS1gsaUJBQWUsMEJBTEo7QUFNWCxxQkFBbUI7QUFOUixDQUFiOztBQVNBO0FBQ0EsU0FBUyxhQUFULENBQXVCLE1BQXZCOztBQUVBO0FBQ0EsSUFBSSxRQUFRLFNBQVMsUUFBVCxHQUFvQixHQUFwQixFQUFaOztBQUVBO0FBQ0EsV0FBVyxJQUFYLEdBQWtCLFlBQVk7QUFDMUIsYUFBVyxJQUFYO0FBQ0EsYUFBVyxNQUFYO0FBQ0gsQ0FIRDs7QUFNQTtBQUNBLFdBQVcsSUFBWCxHQUFrQixZQUFXO0FBQzNCLElBQUUsTUFBRixFQUFVLEVBQVYsQ0FBYSxRQUFiLEVBQXVCLFVBQVMsQ0FBVCxFQUFZO0FBQy9CLE1BQUUsY0FBRjtBQUNBO0FBQ0EsUUFBSSxZQUFZLEVBQUUsV0FBRixFQUFlLEdBQWYsRUFBaEI7QUFDQSxRQUFJLGVBQWUsRUFBRSxXQUFGLEVBQWUsR0FBZixFQUFuQjs7QUFFQSxhQUFTLElBQVQsR0FBZ0IsMEJBQWhCLENBQTJDLFNBQTNDLEVBQXNELFlBQXRELEVBQW9FLEtBQXBFLENBQTBFLFVBQVMsS0FBVCxFQUFnQjtBQUN4RjtBQUNBLFVBQUksWUFBWSxNQUFNLElBQXRCO0FBQ0EsVUFBSSxlQUFlLE1BQU0sT0FBekI7O0FBRUEsVUFBSSxjQUFjLHFCQUFsQixFQUF5QztBQUN2QyxjQUFNLGlCQUFOO0FBQ0QsT0FGRCxNQUdLO0FBQ0gsY0FBTSxZQUFOO0FBQ0Q7QUFDRixLQVhEO0FBWUE7QUFDQSxNQUFFLE1BQUYsRUFBVSxJQUFWLENBQWUsWUFBVTtBQUNyQixXQUFLLEtB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QUdSLGdCQUFVLEdBSEY7QUFJUixjQUFRLEtBSkE7QUFLUixlQUFTO0FBTEQ7QUFObUQsR0FBdEMsQ0FBM0I7O0FBZUE7QUFDQSxNQUFJLHVCQUF1QixJQUFJLE9BQU8sYUFBUCxDQUFxQixZQUF6QixDQUFzQztBQUM3RDtBQUNELG1CQUFlLHNCQUYrQztBQUc5RCxxQkFBaUIseUlBSDZDO0FBSTlELHVCQUFtQixJQUoyQztBQUs5RCxpQkFBYSxVQUxpRDtBQU05RCxlQUFXO0FBQ1IsdUJBQWtCLElBRFY7QUFFUixlQUFTLEdBRkQ7QUFHUixnQkFBVSxHQUhGO0FBSVIsY0FBUSxLQUpBO0FBS1IsZUFBUztBQUxEO0FBTm1ELEdBQXRDLENBQTNCOztBQWdCQTtBQUNBLGVBQWEsSUFBYjtBQUNBLG1CQUFpQixJQUFqQjtBQUNBLHVCQUFxQixJQUFyQjtBQUNBLHVCQUFxQixJQUFyQjtBQUNELENBdEVEOztBQXlFQTtBQUNBLEVBQUUsWUFBVztBQUNYLGFBQVcsSUFBWDtBQUNELENBRkQ7O0FBZ0JBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gQ3JlYXRlIG9iamVjdCBmb3IgbmFtZSBzcGFjaW5nXG52YXIgZ29vZ2xlRGFzaCA9IHt9O1xuXG4vLyBDb25uZWN0IHRvIEZpcmViYXNlXG52YXIgY29uZmlnID0ge1xuICBhcGlLZXk6IFwiQUl6YVN5RC1lVE1kRFVXLXZ4dGFNS3BWbExHZmJ5eXdDNXJKajg0XCIsXG4gIGF1dGhEb21haW46IFwiYmVlci1tZS1mb29kLmZpcmViYXNlYXBwLmNvbVwiLFxuICBkYXRhYmFzZVVSTDogXCJodHRwczovL2JlZXItbWUtZm9vZC5maXJlYmFzZWlvLmNvbVwiLFxuICBwcm9qZWN0SWQ6IFwiYmVlci1tZS1mb29kXCIsXG4gIHN0b3JhZ2VCdWNrZXQ6IFwiYmVlci1tZS1mb29kLmFwcHNwb3QuY29tXCIsXG4gIG1lc3NhZ2luZ1NlbmRlcklkOiBcIjcwOTAyNjQ5MjcxXCJcbn07XG5cbi8vIEluaXRpYWxpemluZyBGaXJlYmFzZVxuZmlyZWJhc2UuaW5pdGlhbGl6ZUFwcChjb25maWcpO1xuXG4vLyBSZWZlcmVuY2luZyBGaXJlYmFzZSBEYXRhYmFzZVxudmFyIGRiUmVmID0gZmlyZWJhc2UuZGF0YWJhc2UoKS5yZWYoKTtcblxuLy8gSW5pdGlhbGl6ZSBmdW5jdGlvbiAoY2FsbGVkIGluIERvY3VtZW50IFJlYWR5IGF0IGJvdHRvbSlcbmdvb2dsZURhc2guaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICBnb29nbGVEYXNoLmZvcm0oKTtcbiAgICBnb29nbGVEYXNoLmV2ZW50cygpO1xufVxuXG5cbi8vIExvZ2luIGZvcm0gdG8gZ2V0IGFjY2VzcyB0byBkYXRhIHdpdGggRkIgQXV0aGVudGljYXRpb25cbmdvb2dsZURhc2guZm9ybSA9IGZ1bmN0aW9uKCkge1xuICAkKFwiZm9ybVwiKS5vbihcInN1Ym1pdFwiLCBmdW5jdGlvbihlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAvLyBHZXQgdmFsdWVzIGZyb20gbG9naW4gZm9ybVxuICAgICAgbGV0IHVzZXJMb2dpbiA9ICQoJyN1c2VyTmFtZScpLnZhbCgpO1xuICAgICAgbGV0IHVzZXJQYXNzd29yZCA9ICQoJyNwYXNzd29yZCcpLnZhbCgpO1xuXG4gICAgICBmaXJlYmFzZS5hdXRoKCkuc2lnbkluV2l0aEVtYWlsQW5kUGFzc3dvcmQodXNlckxvZ2luLCB1c2VyUGFzc3dvcmQpLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIC8vIEhhbmRsZSBFcnJvcnMgaGVyZS5cbiAgICAgICAgdmFyIGVycm9yQ29kZSA9IGVycm9yLmNvZGU7XG4gICAgICAgIHZhciBlcnJvck1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuXG4gICAgICAgIGlmIChlcnJvckNvZGUgPT09ICdhdXRoL3dyb25nLXBhc3N3b3JkJykge1xuICAgICAgICAgIGFsZXJ0KCdXcm9uZyBwYXNzd29yZC4nKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBhbGVydChlcnJvck1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIC8vIFJlc2V0cyBhbGwgZm9ybSBpbnB1dHMgdG8gbm90aGluZ1xuICAgICAgJCgnZm9ybScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICB9KTtcbiAgfSk7XG59XG5cblxuLy8gTWFpbiBldmVudCBmdW5jdGlvblxuZ29vZ2xlRGFzaC5ldmVudHMgPSBmdW5jdGlvbigpIHtcbiAgZ29vZ2xlRGFzaC5hY3RpdmVVc2VyKCk7XG59XG5cblxuZ29vZ2xlRGFzaC5zaWduT3V0ID0gZnVuY3Rpb24oKSB7XG4gICQoJyNsb2dPdXQnKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpeyBcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZmlyZWJhc2UuYXV0aCgpLnNpZ25PdXQoKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgY29uc29sZS5sb2coJ1NpZ25lZCBPdXQnKTtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoZmFsc2UpO1xuICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdTaWduIE91dCBFcnJvcicsIGVycm9yKTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbmdvb2dsZURhc2guZ2V0VXNlckluZm8gPSBmdW5jdGlvbigpIHtcbiAgbGV0IHVzZXJFbWFpbCA9IGZpcmViYXNlLmF1dGgoKS5jdXJyZW50VXNlci5lbWFpbDtcbiAgJCgnI3VzZXJFbWFpbCcpLmFwcGVuZCh1c2VyRW1haWwpO1xufVxuXG5nb29nbGVEYXNoLmdldERhdGUgPSBmdW5jdGlvbigpIHtcbiAgbGV0IHN0YXJ0RGF0ZSA9IG5ldyBEYXRlKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gNzQ0ICogNjAgKiA2MCAqIDEwMDApO1xuICBsZXQgZW5kRGF0ZSA9IG5ldyBEYXRlKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gMjQgKiA2MCAqIDYwICogMTAwMCk7XG4gICQoJyNzdGFydERhdGUnKS5hcHBlbmQoc3RhcnREYXRlKTtcbiAgJCgnI2VuZERhdGUnKS5hcHBlbmQoZW5kRGF0ZSk7XG59XG5cbmdvb2dsZURhc2guZ2V0T3RoZXJEYXRhID0gZnVuY3Rpb24oKSB7XG4gICQuYWpheCh7XG4gICAgdXJsOiAnaHR0cHM6Ly9zY2VuaWMta2lsbi0xNTg2MTcuYXBwc3BvdC5jb20vcXVlcnk/aWQ9YWhSemZuTmpaVzVwWXkxcmFXeHVMVEUxT0RZeE4zSVZDeElJUVhCcFVYVmxjbmtZZ0lDQWdON3FpUW9NJyxcbiAgICBtZXRob2Q6ICdHRVQnLFxuICAgIGRhdGFUeXBlOiAnanNvbnAnXG4gIH0pLnRoZW4oZnVuY3Rpb24ob3RoZXJEYXRhKSB7XG4gICAgbGV0IGFsbE90aGVyRGF0YSA9IG90aGVyRGF0YS50b3RhbHNGb3JBbGxSZXN1bHRzO1xuICAgIGNvbnNvbGUubG9nKGFsbE90aGVyRGF0YSk7XG4gICAgXG4gICAgLy8gR29vZ2xlIEFkV29yZHMgRGF0YVxuICAgIGxldCBjb3N0UGVyQ2xpY2sgPSBhbGxPdGhlckRhdGFbXCJnYTpDUENcIl07XG4gICAgbGV0IGNsaWNrVGhyb3VnaFJhdGlvID0gYWxsT3RoZXJEYXRhW1wiZ2E6Q1RSXCJdO1xuICAgIGxldCB0b3RhbEFkQ2xpY2tzID0gYWxsT3RoZXJEYXRhW1wiZ2E6YWRDbGlja3NcIl07XG4gICAgbGV0IHRvdGFsQWRDb3N0ID0gYWxsT3RoZXJEYXRhW1wiZ2E6YWRDb3N0XCJdO1xuICAgIGxldCBhZEltcHJlc3Npb25zID0gYWxsT3RoZXJEYXRhW1wiZ2E6aW1wcmVzc2lvbnNcIl07XG5cbiAgICAvLyBHb29nbGUgQW5hbHl0aWNzIERhdGFcbiAgICBsZXQgdG90YWxTZXNzaW9ucyA9IGFsbE90aGVyRGF0YVtcImdhOnNlc3Npb25zXCJdO1xuICAgIGxldCBib3VuY2VSYXRlID0gYWxsT3RoZXJEYXRhW1wiZ2E6Ym91bmNlUmF0ZVwiXTtcbiAgICBsZXQgbmV3VXNlcnMgPSBhbGxPdGhlckRhdGFbXCJnYTpuZXdVc2Vyc1wiXTtcbiAgICBsZXQgYXZlcmFnZVNlc3Npb24gPSBhbGxPdGhlckRhdGFbXCJnYTpzZXNzaW9uRHVyYXRpb25cIl07XG4gICAgXG4gICAgJChcIiNnYUNsaWNrc1wiKS5hcHBlbmQodG90YWxBZENsaWNrcyk7XG4gICAgJChcIiNnYUNvc3RcIikuYXBwZW5kKHRvdGFsQWRDb3N0KTtcbiAgICAkKFwiI2FkQ3RyXCIpLmFwcGVuZChjbGlja1Rocm91Z2hSYXRpbyk7XG4gICAgJChcIiNhZENwY1wiKS5hcHBlbmQoY29zdFBlckNsaWNrKTtcbiAgICAkKFwiI2FkSW1wcmVzc2lvbnNcIikuYXBwZW5kKGFkSW1wcmVzc2lvbnMpO1xuXG4gICAgJChcIiNnYVNlc3Npb25zXCIpLmFwcGVuZCh0b3RhbFNlc3Npb25zKTtcbiAgICAkKFwiI2dhQm91bmNlUmF0ZVwiKS5hcHBlbmQoYm91bmNlUmF0ZSk7XG4gICAgJChcIiNnYU5ld1VzZXJzXCIpLmFwcGVuZChuZXdVc2Vycyk7XG4gICAgJChcIiNnYVNlc3Npb25EdXJhdGlvblwiKS5hcHBlbmQoYXZlcmFnZVNlc3Npb24pO1xuXG4gIH0pO1xufVxuXG5cbi8vIElmIHVzZXIgaXMgbG9nZ2VkIGluLCBzaG93IHRoZSBHb29nbGUgQ2hhcnQgZGF0YVxuZ29vZ2xlRGFzaC5hY3RpdmVVc2VyID0gZnVuY3Rpb24oKSB7XG4gICAgZmlyZWJhc2UuYXV0aCgpLm9uQXV0aFN0YXRlQ2hhbmdlZChmdW5jdGlvbih1c2VyKSB7XG4gICAgaWYgKHVzZXIpIHtcbiAgICAgIGdvb2dsZURhc2guZHJhd1Zpc3VhbGl6YXRpb24oKTtcbiAgICAgICQoJyNsb2dpbk1vZGVsJykudG9nZ2xlQ2xhc3MoJ2hpZGVFbGVtZW50Jyk7XG4gICAgICAkKCcjbmF2YmFyU3RhdHVzJykuYXBwZW5kKCc8ZGl2IGNsYXNzPVwibmF2YmFyXCI+PGRpdiBjbGFzcz1cIm5hdmJhcl9faGVhZGVyXCI+PGgyPldlbGNvbWU8L2gyPjxpbWcgc3JjPVwiYXNzZXRzL2Zvb3Rlcl9sb2dvX2NvbG9yX3RyYW5zLnBuZ1wiIGFsdD1cIlwiPjwvZGl2PjxkaXYgY2xhc3M9XCJuYXZiYXJfX3RpbWVGcmFtZVwiPjxwPlJlc3VsdHMgVGltZSBGcmFtZTwvcD48ZGl2IGNsYXNzPVwibmF2YmFyX190aW1lRnJhbWUtLWRhdGVcIj48c3BhbiBpZD1cInN0YXJ0RGF0ZVwiPjwvc3Bhbj4gdG8gPHNwYW4gaWQ9XCJlbmREYXRlXCI+PC9zcGFuPjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJuYXZiYXJfX2Zvb3RlclwiPjxwPkxvZ2dlZCBJbiBBczo8YnI+PHNwYW4gaWQ9XCJ1c2VyRW1haWxcIj48L3NwYW4+PC9wPjxpbnB1dCB0eXBlPVwic3VibWl0XCIgaWQ9XCJsb2dPdXRcIiB2YWx1ZT1cIlNpZ24gT3V0XCIgY2xhc3M9XCJuYXZiYXJfX2xvZ091dFwiPjwvaW5wdXQ+PC9kaXY+PC9kaXY+Jyk7XG5cbiAgICAgIGdvb2dsZURhc2guZ2V0VXNlckluZm8oKTtcbiAgICAgIGdvb2dsZURhc2guZ2V0T3RoZXJEYXRhKCk7XG4gICAgICBnb29nbGVEYXNoLmdldERhdGUoKTtcbiAgICAgIGdvb2dsZURhc2guc2lnbk91dCgpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHJ1biBlbHNlIGNvZGUgaWYgbmVjZXNzYXJ5XG4gICAgfVxuICB9KTtcbn1cblxuXG4vLyBHZXR0aW5nIGRhdGEgZnJvbSBHb29nbGUgU3VwZXJQcm94eSBhbmQgcHJpbnRzIHRvIHBhZ2Ugd2l0aCBHb29nbGUgQ2hhcnRzXG5nb29nbGVEYXNoLmRyYXdWaXN1YWxpemF0aW9uID0gZnVuY3Rpb24oKSB7XG4gIC8vIEdldHMgYnJvd3NlciBpbmZvIGZyb20gR0FcbiAgbGV0IHVzZXJzQnJvd3NlciA9IG5ldyBnb29nbGUudmlzdWFsaXphdGlvbi5DaGFydFdyYXBwZXIoe1xuICAgICBcImNvbnRhaW5lcklkXCI6IFwidXNlcnNCcm93c2VyXCIsXG4gICAgIFwiZGF0YVNvdXJjZVVybFwiOiAnaHR0cHM6Ly9zY2VuaWMta2lsbi0xNTg2MTcuYXBwc3BvdC5jb20vcXVlcnk/aWQ9YWhSemZuTmpaVzVwWXkxcmFXeHVMVEUxT0RZeE4zSVZDeElJUVhCcFVYVmxjbmtZZ0lDQWdJQ0FnQW9NJmZvcm1hdD1kYXRhLXRhYmxlLXJlc3BvbnNlJyxcbiAgICAgXCJyZWZyZXNoSW50ZXJ2YWxcIjogMzYwMCxcbiAgICAgXCJjaGFydFR5cGVcIjogXCJQaWVDaGFydFwiLFxuICAgICBcIm9wdGlvbnNcIjoge1xuICAgICAgICBcInNob3dSb3dOdW1iZXJcIiA6IHRydWUsXG4gICAgICAgIFwid2lkdGhcIjogNjMwLFxuICAgICAgICBcImhlaWdodFwiOiA0NDAsXG4gICAgICAgIFwiaXMzRFwiOiBmYWxzZSxcbiAgICAgICAgXCJ0aXRsZVwiOiBcIkNsaWNrIFNvdXJjZVwiXG4gICAgIH1cbiAgIH0pO1xuICBcbiAgLy8gR2V0cyBjbGljayBzb3VyY2UgaW5mbyBmcm9tIEdBXG4gIGxldCB1c2Vyc0NsaWNrU291cmNlID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLkNoYXJ0V3JhcHBlcih7XG4gICAgICAvLyBFeGFtcGxlIEJyb3dzZXIgU2hhcmUgUXVlcnlcbiAgICAgXCJjb250YWluZXJJZFwiOiBcInVzZXJzQ2xpY2tTb3VyY2VcIixcbiAgICAgXCJkYXRhU291cmNlVXJsXCI6IFwiaHR0cHM6Ly9zY2VuaWMta2lsbi0xNTg2MTcuYXBwc3BvdC5jb20vcXVlcnk/aWQ9YWhSemZuTmpaVzVwWXkxcmFXeHVMVEUxT0RZeE4zSVZDeElJUVhCcFVYVmxjbmtZZ0lDQWdMeWhnZ29NJmZvcm1hdD1kYXRhLXRhYmxlLXJlc3BvbnNlXCIsXG4gICAgIFwicmVmcmVzaEludGVydmFsXCI6IDM2MDAsXG4gICAgIFwiY2hhcnRUeXBlXCI6IFwiUGllQ2hhcnRcIixcbiAgICAgXCJvcHRpb25zXCI6IHtcbiAgICAgICAgXCJzaG93Um93TnVtYmVyXCIgOiB0cnVlLFxuICAgICAgICBcIndpZHRoXCI6IDYzMCxcbiAgICAgICAgXCJoZWlnaHRcIjogNDQwLFxuICAgICAgICBcImlzM0RcIjogZmFsc2UsXG4gICAgICAgIFwidGl0bGVcIjogXCJNb3N0IFVzZWQgQnJvd3NlcnNcIlxuICAgICB9XG4gICB9KTtcblxuICAvLyBHZXRzIGNsaWNrIHNvdXJjZSBpbmZvIGZyb20gR0FcbiAgbGV0IHVzZXJzQ2FtcGFpZ25Tb3VyY2VzID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLkNoYXJ0V3JhcHBlcih7XG4gICAgICAvLyBFeGFtcGxlIEJyb3dzZXIgU2hhcmUgUXVlcnlcbiAgICAgXCJjb250YWluZXJJZFwiOiBcInVzZXJzQ2FtcGFpZ25Tb3VyY2VzXCIsXG4gICAgIFwiZGF0YVNvdXJjZVVybFwiOiBcImh0dHBzOi8vc2NlbmljLWtpbG4tMTU4NjE3LmFwcHNwb3QuY29tL3F1ZXJ5P2lkPWFoUnpmbk5qWlc1cFl5MXJhV3h1TFRFMU9EWXhOM0lWQ3hJSVFYQnBVWFZsY25rWWdJQ0FnTnEzbHdvTSZmb3JtYXQ9ZGF0YS10YWJsZS1yZXNwb25zZVwiLFxuICAgICBcInJlZnJlc2hJbnRlcnZhbFwiOiAzNjAwLFxuICAgICBcImNoYXJ0VHlwZVwiOiBcIlBpZUNoYXJ0XCIsXG4gICAgIFwib3B0aW9uc1wiOiB7XG4gICAgICAgIFwic2hvd1Jvd051bWJlclwiIDogdHJ1ZSxcbiAgICAgICAgXCJ3aWR0aFwiOiA2MzAsXG4gICAgICAgIFwiaGVpZ2h0XCI6IDQ0MCxcbiAgICAgICAgXCJpczNEXCI6IGZhbHNlLFxuICAgICAgICBcInRpdGxlXCI6IFwiQWRXb3JkcyBDYW1wYWlnbiBTb3VyY2VcIlxuICAgICB9XG4gICB9KTtcblxuICAvLyBHZXRzIGNsaWNrIHNvdXJjZSBpbmZvIGZyb20gR0FcbiAgbGV0IHVzZXJzT3BlcmF0aW5nU3lzdGVtID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLkNoYXJ0V3JhcHBlcih7XG4gICAgICAvLyBFeGFtcGxlIEJyb3dzZXIgU2hhcmUgUXVlcnlcbiAgICAgXCJjb250YWluZXJJZFwiOiBcInVzZXJzT3BlcmF0aW5nU3lzdGVtXCIsXG4gICAgIFwiZGF0YVNvdXJjZVVybFwiOiBcImh0dHBzOi8vc2NlbmljLWtpbG4tMTU4NjE3LmFwcHNwb3QuY29tL3F1ZXJ5P2lkPWFoUnpmbk5qWlc1cFl5MXJhV3h1TFRFMU9EWXhOM0lWQ3hJSVFYQnBVWFZsY25rWWdJQ0FnTjZNa0FvTSZmb3JtYXQ9ZGF0YS10YWJsZS1yZXNwb25zZVwiLFxuICAgICBcInJlZnJlc2hJbnRlcnZhbFwiOiAzNjAwLFxuICAgICBcImNoYXJ0VHlwZVwiOiBcIlBpZUNoYXJ0XCIsXG4gICAgIFwib3B0aW9uc1wiOiB7XG4gICAgICAgIFwic2hvd1Jvd051bWJlclwiIDogdHJ1ZSxcbiAgICAgICAgXCJ3aWR0aFwiOiA2MzAsXG4gICAgICAgIFwiaGVpZ2h0XCI6IDQ0MCxcbiAgICAgICAgXCJpczNEXCI6IGZhbHNlLFxuICAgICAgICBcInRpdGxlXCI6IFwiT3BlcmF0aW5nIFN5c3RlbXNcIlxuICAgICB9XG4gICB9KTtcblxuXG4gIC8vIENhbGxpbmcgdGhlIGZ1bmN0aW9ucyB0byBwcmludCBjaGFydHMgaW4gRE9NXG4gIHVzZXJzQnJvd3Nlci5kcmF3KCk7XG4gIHVzZXJzQ2xpY2tTb3VyY2UuZHJhdygpO1xuICB1c2Vyc0NhbXBhaWduU291cmNlcy5kcmF3KCk7XG4gIHVzZXJzT3BlcmF0aW5nU3lzdGVtLmRyYXcoKTtcbn1cblxuXG4vLyBEb2N1bWVudCByZWFkeVxuJChmdW5jdGlvbigpIHtcbiAgZ29vZ2xlRGFzaC5pbml0KCk7XG59KTtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuLy8gLy8gRGlzcGxheWluZyBHb29nbGUgQWRXb3JkcyBkYXRhIGZyb20gc2hlZXRzXG4vLyB2YXIgcHVibGljU3ByZWFkc2hlZXRVcmwgPSAnaHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vc3ByZWFkc2hlZXRzL2QvMUtIMTl6eUNOQVhfeHVzV0hiSFN0SzcwYTFWYUJ5cWxXWGFXWGVzOHN4T2MvcHViaHRtbCc7XG5cbi8vIGZ1bmN0aW9uIGluaXQoKSB7XG4vLyBUYWJsZXRvcC5pbml0KCB7IGtleTogcHVibGljU3ByZWFkc2hlZXRVcmwsXG4vLyAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBzaG93SW5mbyxcbi8vICAgICAgICAgICAgICAgICAgc2ltcGxlU2hlZXQ6IHRydWUgfSApXG4vLyB9XG5cbi8vIGZ1bmN0aW9uIHNob3dJbmZvKGRhdGEsIHRhYmxldG9wKSB7XG4vLyBjb25zb2xlLmxvZyhkYXRhKTtcbi8vIH1cblxuLy8gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBpbml0KSJdfQ==
