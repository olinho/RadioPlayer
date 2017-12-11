var url = 'https://lineup-lemfm-main.radiokitapp.org/api/lineup/v1.0/channel/main/playlist?scope=current-15s';
// construction of schedule JSON
// data.playlist.tracks[0].file.metadata[title|year|artist|album]

// list of time descending elements (first newer), 13:05; 13:02; 12:59
var listOfPlayedSongs2 = [ {'title': 'Малюванка', 'artist': 'Nadija', 'time': "13:05"}, {'title': "Шкавраночок", 'artist': 'DollarsBrothers', "time": "13:02"} ];
var listOfPlayedSongs = [];
var jsonFromLemFm;
var lastSong = {};

function scheduleUpdator() {
	getSchedule();
	setInterval(function() {getSchedule();
	}, 15000);
}

function getSchedule() {	
	var songTitle = '';
	var artist = '';
	var currentSong = {};
	$.ajax({
		url: url,
		dataType: 'json',
		}).success( function(data) {
			jsonFromLemFm = data;
			songTitle = parseTitle(data);
			artist = parseArtist(data);
			setCurrentSongTitle(songTitle);
			setCurrentSongArtist(artist);
			if (getCurrentSongTitle() !== "") {
				time = parseTime(data);
				currentSong = createSongObj(getCurrentSongTitle(), getCurrentArtist(), time);
				if ( !isObjectEmpty(lastSong) && areSongObjectsDifferent(lastSong,currentSong) ){
					addSongToPlayedSongsList(lastSong);
				}
				$("#scheduler .currentSong")[0].style.display='block';
				lastSong = currentSong;
			}
			else {
				if ( !isObjectEmpty(lastSong) ) {
					addSongToPlayedSongsList(lastSong);
					lastSong = {};
				}
				$("#scheduler .currentSong")[0].style.display='none';
			}
			updatePlayedSongsDiv();
		});
}

function areSongObjectsDifferent(songObj1, songObj2) {
	return !areSongObjectsSame(songObj1, songObj2);
}

function areSongObjectsSame(songObj1, songObj2){
	if ((songObj1.title == songObj2.title) && (songObj1.artist == songObj2.artist) && (songObj1.time == songObj2.time))
		return true;
	else
		return false;
}

function isObjectEmpty(obj) {
	for (var key in obj) {
		if (hasOwnProperty.call(obj,key)) return false;
	}
	return true;
}

function updatePlayedSongsDiv() {
	var songsContainerDiv = $("#scheduler .playedSongs .songsContainer")[0];
	var nChildren = countChildrenInPlayedSongsContainer();
	var nPlayedSongs = listOfPlayedSongs.length;

	if (nChildren < nPlayedSongs) {
		for (var i = nChildren+1; i <= nPlayedSongs; i++) {
			var nextSongDiv = createNextSongDiv(i);	
			songsContainerDiv.appendChild(nextSongDiv);
		}
	}
	for (i = 0; i < nChildren; i++) {
		updateNextSongDiv(i);
	}
	if (nChildren > 0) {
		$("#scheduler .playedSongs")[0].style.display='block';
	}
}

// songDivIndx indexed from 1
function updateNextSongDiv(songDivIndx) {
	var songObj = getPlayedSong(songDivIndx);
	var nextSongDiv = $("#scheduler .playedSongs .songsContainer")[0].children[songDivIndx];
	var songTitleDiv = nextSongDiv.getElementsByClassName('songTitle')[0];
	var artistDiv = nextSongDiv.getElementsByClassName('artist')[0];
	var timeDiv = nextSongDiv.getElementsByClassName('time')[0];
	newSongObj = listOfPlayedSongs[songDivIndx];
	songTitleDiv.innerHTML = newSongObj.title;
	artistDiv.innerHTML = newSongObj.artist;
	timeDiv.innerHTML = newSongObj.time;
}

function createNextSongDiv(songIndx) {
	var nextSongDiv = document.createElement('div');
	nextSongDiv.className = "nextSong";
	var songObj = getPlayedSong(songIndx);
	var timeDiv = createTimeDiv(songObj);
	var songDetailsDiv = createArtistAndTitleParentDiv(songObj);
	nextSongDiv.appendChild(timeDiv);
	nextSongDiv.appendChild(songDetailsDiv);
	return nextSongDiv;
}

function countChildrenInPlayedSongsContainer() {
	return $("#scheduler .playedSongs .songsContainer")[0].children.length;
}

function createTimeDiv(arg) {
	if (typeof(arg) == "object") {
		time = arg.time;
	}
	else {
		time = arg;
	}
	var timeDiv = document.createElement('div');
	timeDiv.className = 'time';
	timeDiv.innerHTML = time;
	return timeDiv;
}

function createArtistAndTitleParentDiv(songObj) {
	var songTitleDiv = createSongTitleDiv(songObj);
	var artistDiv = createArtistDiv(songObj);
	var parentDiv = document.createElement('div');
	parentDiv.className = "songDetails";
	parentDiv.appendChild(songTitleDiv);
	parentDiv.appendChild(artistDiv);
	return parentDiv;
}

function createArtistDiv(arg) {
	if (typeof(arg) == "object") {
		artist = arg.artist;
	}
	else {
		artist = arg;
	}
	var artistDiv = document.createElement('div');
	artistDiv.className = 'artist';
	artistDiv.innerHTML = artist;
	return artistDiv;
}

function createSongTitleDiv(arg) {
	if (typeof(arg) == "object") {
		title = arg.title;
	}
	else {
		title = arg;
	}
	var songTitleDiv = document.createElement('div');
	songTitleDiv.className = 'songTitle';
	songTitleDiv.innerHTML = title;
	return songTitleDiv;
}

// indexed from 1
function getPlayedSong(index) {
	return listOfPlayedSongs[index-1];
}

function addSongToPlayedSongsList(p1,p2,p3) {
	var songObj = {};
	if (p2 !== undefined) {
		songObj = createSongObj(p1,p2,p3);
	}
	else {
		songObj = p1;
	}
	if (listOfPlayedSongs.map(x => x.title).indexOf(songObj.title) == -1) {
		listOfPlayedSongs.unshift(songObj);
	}
	while (listOfPlayedSongs.length > 3) {
		listOfPlayedSongs.pop();
	}
}

function createSongObj(p1,p2,p3) {
	return {title:p1, artist:p2, time:p3};
}

function getCurrentSongTitle() {
	var currSongTitleDiv = $( "#scheduler .currentSong .songTitle" )[0];	
	return currSongTitleDiv.innerHTML;
}

function getCurrentArtist() {
	var currArtistDiv = $( "#scheduler .currentSong .artist" )[0];
	return currArtistDiv.innerHTML;
}

function setCurrentSongTitle(songTitle) {
	var currSongTitleDiv = $( "#scheduler .currentSong .songTitle" )[0];
	if (songTitle !== undefined && isTitleAllowed(songTitle.toLowerCase())) {
		currSongTitleDiv.innerHTML = songTitle;	
	} else {
		currSongTitleDiv.innerHTML = "";
	}
}

function setCurrentSongArtist(artist) {
	var currArtistDiv = $( "#scheduler .currentSong .artist" )[0]; 
	if (artist !== undefined && isArtistAllowed(artist.toLowerCase())) {
		currArtistDiv.innerHTML = artist;	
	} else {
		currArtistDiv.innerHTML = "";
	}
}

function isTitleAllowed(title) {
	return !isTitleBlocked(title);
}

function isTitleBlocked(title) {
	if (getBlockedTitles().indexOf(title) != -1)
		return true;
	else 
		return false;
}

function getBlockedTitles() {
	list = ["www.lem.fm", "lem.fm", "lemko rusyn"];
	return list;
}

function isArtistAllowed(artist) {
	return !isArtistBlocked(artist);
}

function isArtistBlocked(artist) {
	if (getBlockedArtists().indexOf(artist) != -1)
		return true;
	else 
		return false;
}

// array of artists, who should not be displayed
// lowercase values
function getBlockedArtists() {
	list = ["various artist", "www.lem.fm", "rizhny", "lem.fm"];
	return list;
}

function clearString(str) {
	cleared_str = str.replace(new RegExp('^\\d\+\\.[ ]*'),'');
	str = cleared_str;
	cleared_str = str.replace(new RegExp(" *$"),'');
	return cleared_str;
}

function parseTime(json) {
	track_0 = parseFirstTrack(json);
	fade_in = track_0.fade_in_at;
	start_time = fade_in.substring(11,16);
	if (isTimeFormatCorrect(start_time))
		return start_time;
	else 
		return undefined;
}

// HH:MM
function isTimeFormatCorrect(ti) {
	if (ti.match(/^[0-9]{1,2}:[0-9]{1,2}$/))
		return true;
	else 
		return false;
}

function parseTitle(json) {
	var title = parseFileMetadata(json).title;
	console.log('Fetched title: ' + title);
	if (title == undefined)
		return "";
	else
		return clearString(title);
}

function parseArtist(json) {
	var artist = parseFileMetadata(json).artist;
	console.log("Fetched artist: " + artist);
	if (artist == undefined)
		return "";
	else
		return clearString(artist);
}

function parseFileMetadata(json) {
	return json.data.playlist.tracks[0].file.metadata;
}

function parseFileName(json) {
	return json.data.playlist.tracks[0].file.name;
}

function parseFile(json) {
	return parseFirstTrack(json).file;
}

function parseFirstTrack(json) {
	return json.data.playlist.tracks[0];
}



