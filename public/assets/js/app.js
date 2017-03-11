 window.onload = function() {
        var token = null;
    	// Initialize Firebase
    	var config = {
    	apiKey: "AIzaSyBmi2bRZJfvdIBjn-ZM-mJj2iIFy4jtyjM",
    	authDomain: "sa-train-scheduler.firebaseapp.com",
    	databaseURL: "https://sa-train-scheduler.firebaseio.com",
    	storageBucket: "sa-train-scheduler.appspot.com",
    	messagingSenderId: "976229327145"
	};
	firebase.initializeApp(config);

	//create database var for future calls
	var database = firebase.database();

	firebase.auth().getRedirectResult().then(function(result) {
		if (result.credential) {
    	    // This gives you a Google Access Token. You can use it to access the Google API.
    	    token = result.credential.accessToken;

            if (token) {
                //if we have a token from login show the input div
                $('#add-train').show();
                $('#help-text').hide();
            }
		}
		// The signed-in user info.
		var user = result.user;
	}).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// The email of the user's account used.
		var email = error.email;
		// The firebase.auth.AuthCredential type that was used.
		var credential = error.credential;
	});

	//on click event for submit button
	$('#submit-btn').on('click', function() {
        //check if there is a token (logged in user)
        if (token) {
    		event.preventDefault(); //prevent form from submitting and refreshing after button is clicked

            //variable declaration
    		var trainName;
    		var trainDestination;
    		var firstTrainTime;
    		var trainFrequency;
    		var nextArrival;
    		var minutesAway;
    		var timeDiff;
    		var timeRemainder;

            // grabbing user input and storing in a variable
    		trainName = $('#name-input').val().trim();
    		trainDestination = $('#destination-input').val().trim();
    		firstTrainTime = $('#first-time-input').val().trim();
    		trainFrequency = $('#frequency-input').val().trim();

            //clear the fields after grabbing the values
            $('#name-input').val('');
            $('#destination-input').val('');
            $('#first-time-input').val('');
            $('#frequency-input').val('');

    		var firstTrainTimeCov = moment(firstTrainTime, 'HH:mm').subtract(1, "years");
    		//Time difference between currentTime and firstTrainTime
    		timeDiff = moment().diff(moment(firstTrainTimeCov), "minutes");
    		//Time apart
    		timeRemainder = (timeDiff % trainFrequency);
    		//Next Arrival
    		minutesAway = (trainFrequency - timeRemainder);
            //push values to firebase DB
    		database.ref().push({
    			trainName: trainName,
    			trainDestination: trainDestination,
    			trainFrequency: trainFrequency,
    			minutesAway: minutesAway
    		});

        } else {
            //handle situation where someone uses inspect to unhide our hidden div
            $('#add-train').hide();
            alert("You need to login before you can submit.");
        }
	});

	database.ref().on('child_added', function(childSnapShot){
        //display values on initial load and add display new entries in the table
		var tableRow = $('<tr>');
        //used to get the current arrival on page load
		var currentNextArrival = moment().add(childSnapShot.val().minutesAway, "minutes").format("hh:mm a");
        //create table rows to display information from firebase
		tableRow.append('<td>' + childSnapShot.val().trainName + '</td>');
		tableRow.append('<td>' + childSnapShot.val().trainDestination + '</td>');
		tableRow.append('<td>' + childSnapShot.val().trainFrequency + '</td>');
		tableRow.append('<td>' + currentNextArrival + '</td>');
		tableRow.append('<td>' + childSnapShot.val().minutesAway + '</td>');

		$('#train-table').append(tableRow);

	}, function(errObj){
		console.log('Error: ' + errObj.code);
	});

}

function userLogin() {
    //called when login button is clicked to redirect to Google Signin
	var provider = new firebase.auth.GoogleAuthProvider();
	firebase.auth().signInWithRedirect(provider);
}