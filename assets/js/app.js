 window.onload = function() {
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

	//on click event for submit button
	$('#submit-btn').on('click', function() {
		event.preventDefault(); //prevent form from submitting and refreshing after button is clicked

		var trainName;
		var trainDestination;
		var firstTrainTime;
		var trainFrequency;
		var nextArrival;
		var minutesAway;
		var timeDiff;
		var timeRemainder;

		trainName = $('#name-input').val().trim();
		trainDestination = $('#destination-input').val().trim();
		firstTrainTime = $('#first-time-input').val().trim();
		trainFrequency = $('#frequency-input').val().trim();

		var firstTrainTimeCov = moment(firstTrainTime, 'HH:mm').subtract(1, "years");
		console.log("Time Convert: " + firstTrainTimeCov);
		//Time difference between currentTime and firstTrainTime
		timeDiff = moment().diff(moment(firstTrainTimeCov), "minutes");
		console.log("Time Diff: " + timeDiff);
		//Time apart
		timeRemainder = (timeDiff % trainFrequency);
		console.log("Remainder: " + timeRemainder)
		//Next Arrival
		minutesAway = (trainFrequency - timeRemainder);
		console.log("Next Train: " + nextArrival);
		//Minutes Away
		var nextArrivalCov = moment().add(minutesAway, "minutes").format("hh:mm a");
		console.log("Arrival: " + moment(minutesAway).format("hh:mm"));

		nextArrival = nextArrivalCov.toString();

		database.ref().push({
			trainName: trainName,
			trainDestination: trainDestination,
			trainFrequency: trainFrequency,
			nextArrival: nextArrival,
			minutesAway: minutesAway
		});
	});

	database.ref().on('child_added', function(childSnapShot){
		var tableRow = $('<tr>');

		// var currentNextArrival = moment().add(childSnapShot.val().minutesAway, "minutes").format("hh:mm a");

		tableRow.append('<td>' + childSnapShot.val().trainName + '</td>');
		tableRow.append('<td>' + childSnapShot.val().trainDestination + '</td>');
		tableRow.append('<td>' + childSnapShot.val().trainFrequency + '</td>');
		tableRow.append('<td>' + childSnapShot.val().nextArrival + '</td>');
		tableRow.append('<td>' + childSnapShot.val().minutesAway + '</td>');

		$('#train-table').append(tableRow);

	}, function(errObj){
		console.log('Error: ' + errObj.code);
	});

}