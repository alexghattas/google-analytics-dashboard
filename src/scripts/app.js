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
}


// Login form to get access to data with FB Authentication
googleDash.form = function() {
  $("form").on("submit", function(e) {
      e.preventDefault();
      // Get values from login form
      let userLogin = $('#userName').val();
      let userPassword = $('#password').val();

      firebase.auth().signInWithEmailAndPassword(userLogin, userPassword).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        if (errorCode === 'auth/wrong-password') {
          alert('Wrong password.');
        }
        else {
          alert(errorMessage);
        }
      });
      // Resets all form inputs to nothing
      $('form').each(function(){
          this.reset();
      });
  });
}


// Main event function
googleDash.events = function() {
  googleDash.activeUser();

  // Show and hide info div for definitions
  $('#showInfo__clicks, #showInfo__total, #showInfo__ctr, #showInfo__cpc, #showInfo__impressions, #showInfo__visits, #showInfo__bounce, #showInfo__newUsers, #showInfo__sessions').on('click', function(){
      $(this).children('.otherData__showInfo').fadeToggle();
  });
}


googleDash.signOut = function() {
  $('#logOut').on("click", function(e){ 
    e.preventDefault();
    firebase.auth().signOut().then(function() {
      $('#otherDataMain').hide();
      window.location.reload(false);
    }, function(error) {
      console.error('Sign Out Error', error);
    });
  });
}


// Get users profile information from Firebase
googleDash.getUserInfo = function() {
  let userEmail = firebase.auth().currentUser.email;
  $('#userEmail').append(userEmail);
}


// Gets data, from yesterday to 30 days before, convert string to "Day Month Year"
googleDash.getDate = function() {
  let startDate = new Date(new Date().getTime() - 744 * 60 * 60 * 1000);
  startDate = new Date(startDate).toUTCString();
  startDate = startDate.split(' ').slice(1, 4).join(' ');

  let endDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
  endDate = new Date(endDate).toUTCString();
  endDate = endDate.split(' ').slice(1, 4).join(' ');

  $('#startDate').append(startDate);
  $('#endDate').append(endDate);
}

// Get other data from Google Superproxy
googleDash.getOtherData = function() {
  $.ajax({
    url: 'https://scenic-kiln-158617.appspot.com/query?id=ahRzfnNjZW5pYy1raWxuLTE1ODYxN3IVCxIIQXBpUXVlcnkYgICAgN7qiQoM',
    method: 'GET',
    dataType: 'jsonp'
  }).then(function(otherData) {
    let allOtherData = otherData.totalsForAllResults;
    let profileInfo = otherData["profileInfo"];
    
    // Google AdWords Data
    let costPerClick = allOtherData["ga:CPC"];
    costPerClick = costPerClick.substring(0, 4);
    let clickThroughRatio = allOtherData["ga:CTR"]
    clickThroughRatio = clickThroughRatio.substring(0, 4);

    let totalAdClicks = allOtherData["ga:adClicks"];
    let totalAdCost = allOtherData["ga:adCost"];
    let adImpressions = allOtherData["ga:impressions"];

    // Google Analytics Data
    let totalSessions = allOtherData["ga:sessions"];
    let bounceRate = allOtherData["ga:bounceRate"];
    bounceRate = bounceRate.substring(0, 4);
    let newUsers = allOtherData["ga:newUsers"];
    let averageSession = allOtherData["ga:sessionDuration"];

    // NavBar Information
    let gaWebProperty = profileInfo["webPropertyId"];
    
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
}


// If user is logged in, show the Google Chart data
googleDash.activeUser = function() {
    firebase.auth().onAuthStateChanged(function(user) {
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
}


// Getting data from Google SuperProxy and prints to page with Google Charts
googleDash.drawVisualization = function() {
  // Gets browser info from GA
  let usersBrowser = new google.visualization.ChartWrapper({
     "containerId": "usersBrowser",
     "dataSourceUrl": 'https://scenic-kiln-158617.appspot.com/query?id=ahRzfnNjZW5pYy1raWxuLTE1ODYxN3IVCxIIQXBpUXVlcnkYgICAgICAgAoM&format=data-table-response',
     "refreshInterval": 3600,
     "chartType": "PieChart",
     "options": {
        "showRowNumber" : true,
        "width": 500,
        "height": 300,
        "is3D": false,
        "title": "Click Source"
     }
   });
  
  // Gets click source info from GA
  let usersClickSource = new google.visualization.ChartWrapper({
      // Example Browser Share Query
     "containerId": "usersClickSource",
     "dataSourceUrl": "https://scenic-kiln-158617.appspot.com/query?id=ahRzfnNjZW5pYy1raWxuLTE1ODYxN3IVCxIIQXBpUXVlcnkYgICAgLyhggoM&format=data-table-response",
     "refreshInterval": 3600,
     "chartType": "PieChart",
     "options": {
        "showRowNumber" : true,
        "width": 500,
        "height": 300,
        "is3D": false,
        "title": "Most Used Browsers"
     }
   });

  // Gets click source info from GA
  let usersCampaignSources = new google.visualization.ChartWrapper({
      // Example Browser Share Query
     "containerId": "usersCampaignSources",
     "dataSourceUrl": "https://scenic-kiln-158617.appspot.com/query?id=ahRzfnNjZW5pYy1raWxuLTE1ODYxN3IVCxIIQXBpUXVlcnkYgICAgNq3lwoM&format=data-table-response",
     "refreshInterval": 3600,
     "chartType": "PieChart",
     "options": {
        "showRowNumber" : true,
        "width": 500,
        "height": 300,
        "is3D": false,
        "title": "AdWords Campaign Source"
     }
   });

  // Gets click source info from GA
  let usersOperatingSystem = new google.visualization.ChartWrapper({
      // Example Browser Share Query
     "containerId": "usersOperatingSystem",
     "dataSourceUrl": "https://scenic-kiln-158617.appspot.com/query?id=ahRzfnNjZW5pYy1raWxuLTE1ODYxN3IVCxIIQXBpUXVlcnkYgICAgN6MkAoM&format=data-table-response",
     "refreshInterval": 3600,
     "chartType": "PieChart",
     "options": {
        "showRowNumber" : true,
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
}


// Document ready
$(function() {
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