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

      $('form').each(function(){
          this.reset();
      });
  });
}


// Main event function
googleDash.events = function() {
  googleDash.activeUser();
}


// If user is logged in, show the Google Chart data
googleDash.activeUser = function() {
    firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      googleDash.drawVisualization();
      $('#loginModel').toggleClass('hideElement');
    } else {
      // run else code if necessary
    }
  });
}


// Getting data from Google SuperProxy and prints to page with Google Charts
googleDash.drawVisualization = function() {
  // Gets browser info from GA
  let browserWrapper = new google.visualization.ChartWrapper({
     "containerId": "browser",
     "dataSourceUrl": 'https://scenic-kiln-158617.appspot.com/query?id=ahRzfnNjZW5pYy1raWxuLTE1ODYxN3IVCxIIQXBpUXVlcnkYgICAgICAgAoM&format=data-table-response',
     "refreshInterval": 3600,
     "chartType": "PieChart",
     "options": {
        "showRowNumber" : true,
        "width": 630,
        "height": 440,
        "is3D": true,
        "title": "Click Source"
     }
   });
  
  // Gets click source info from GA
  let browserWrapperTwo = new google.visualization.ChartWrapper({
      // Example Browser Share Query
     "containerId": "browserTwo",
     "dataSourceUrl": "https://scenic-kiln-158617.appspot.com/query?id=ahRzfnNjZW5pYy1raWxuLTE1ODYxN3IVCxIIQXBpUXVlcnkYgICAgLyhggoM&format=data-table-response",
     "refreshInterval": 3600,
     "chartType": "PieChart",
     "options": {
        "showRowNumber" : true,
        "width": 630,
        "height": 440,
        "is3D": true,
        "title": "Most Used Browsers"
     }
   });

  // Calling the functions
  browserWrapper.draw();
  browserWrapperTwo.draw();

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