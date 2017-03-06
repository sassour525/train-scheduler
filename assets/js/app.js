  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBmi2bRZJfvdIBjn-ZM-mJj2iIFy4jtyjM",
    authDomain: "sa-train-scheduler.firebaseapp.com",
    databaseURL: "https://sa-train-scheduler.firebaseio.com",
    storageBucket: "sa-train-scheduler.appspot.com",
    messagingSenderId: "976229327145"
  };
  firebase.initializeApp(config);

  var database = firebase.database();