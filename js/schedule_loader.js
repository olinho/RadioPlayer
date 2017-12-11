var mainChannelScheduleUrl = "https://lineup-lemfm-main.radiokitapp.org/api/lineup/v1.0/channel/main/playlist";
var resp = [];

function fetchPlanAsJson() {
	var request = new XMLHttpRequest();
	request.open("GET", mainChannelScheduleUrl);
	request.responseType = "json";
	request.send();
	request.onload = function() {
		resp = request.response;
	}
}

// compare dates in format YYYY-MM-DD and return adequate value
function compareDatesInFormat_YYYYMMDD(date1, date2) {
	if (date1 == date2) 
		return 0;
	else if (date1 > date2) 
		return 1;
	else if (date1 < date2)
		return -1;
	else 
		return -2; // error
}

function ajaxGetUpcomingPrograms() {
	var request = new XMLHttpRequest();
	request.open("GET", "php/getPreviews.php", true);
	request.send();
	request.onload = function() {
		resp = request.response;
		upcomingProgramsJSON = JSON.parse(resp);
	}

}

function getJsonTest() {
	var jsonTestFileUrl = "json/comingPrograms.json";
	var request = new XMLHttpRequest();
	request.open("GET", jsonTestFileUrl);
	
	request.send();
	request.onload = function() {
		r = JSON.parse(request.response);
	}
}


function getNthElementStartDate_YYYYMMDD(json, n) {
	var fadeInAt = "";
	fadeInAt = parseNthObj_FadeInAtElement(json, n);
	return parse_YYYYMMDD_FromDate(fadeInAt);
}

// example date: "2017-12-03T15:59:54.345+01:00"
function parse_YYYYMMDD_FromDate(date) {
	return date.substring(0,10);
}

function parseNthObj_FadeInAtElement(json, n) {
	var listOfTracks = [];
	listOfTracks = parseListOfTracks(json);
	if (n > listOfTracks.length){
		console.log('Error: Range exceeded');
		return "";
	}
	return getNthObjFromJson(json, n).fade_in_at;
}

function getNthObjFromJson(json, n) {
	return parseListOfTracks(json)[n];
}

function parseListOfTracks(json) {
	return json.data.playlist.tracks;
}