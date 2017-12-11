<?php
	$scheduleURL = "https://lineup-lemfm-main.radiokitapp.org/api/lineup/v1.0/channel/main/playlist";
	$schedule15sURL = 'https://lineup-lemfm-main.radiokitapp.org/api/lineup/v1.0/channel/main/playlist?scope=current-15s';
	$upcomingProgramsFilePath = "../json/upcomingPrograms.json";
	$lastSavedIndexFilePath = "../json/lastSavedIndexOfUpcomingPrograms.json";
	$scheduleFilePath = "../json/schedule.json";
	$numberOfPrograms = 3;
	// show(encodeJsonObjToStr(getPreviews()));
	echo encodeJsonObjToStr(getPreviews());

	// check number of upcoming programs
	// and if they haven't finished or started yet
	function getPreviews() {
		$json = getFreshProgramsFromFile();
		if ( hasN_UpcomingPrograms($json) ){
			updateUpcomingProgramsUsingSchedule();
		}

		$json = getFreshProgramsFromFile();
		if (hasN_UpcomingPrograms($json)){
			return $json;
		} else {
			getScheduleAndSaveToFile();
			updateUpcomingProgramsUsingSchedule();
		}

		$json = getFreshProgramsFromFile();
		if (hasN_UpcomingPrograms($json)){
			return $json;
		} else {
			die ("We need lemko doctor.");
		}
	}

	function hasN_UpcomingPrograms($jsonFromUpcomingProgramsFile) {
		if (count($jsonFromUpcomingProgramsFile->programs) == $GLOBALS['numberOfPrograms']){
			return true;
		}
		else {
			return false;
		}
	}

	function updateUpcomingProgramsUsingSchedule() {
		$threeUpcomingProgramsFromScheduleAsJson = getThreeUpcomingProgramsFromSchedule();
		saveJsonObjectToUpcomingProgramsJSONFile($threeUpcomingProgramsFromScheduleAsJson);
	}

	function getThreeUpcomingProgramsFromSchedule() {
		$scheduleAsStr = readScheduleFromJsonFile();
		$scheduleAsJson = decodeStringToJson($scheduleAsStr);
		$freshProgramsJson = (decodeStringToJson('{"programs":[]}'));
		$firstUpcomingProgramIndex = 0;
		$k = getLastSavedIndexFromFile();
		$i = 0;
		$tracks = $scheduleAsJson->data->playlist->tracks;
		$numberOfTracks = count($tracks);
		while ($i < $GLOBALS['numberOfPrograms']) {
			$track = $tracks[$k];
			if (isProgramFresh($track)) {
				if ($firstUpcomingProgramIndex == 0){
					$firstUpcomingProgramIndex = $k;
				}
				array_push($freshProgramsJson->programs, $track);
				$i++;
			}
			$k++;
			if ($k >= $numberOfTracks){
				break;
			}
		}
		updateFirstUpcomingProgramIndex($firstUpcomingProgramIndex);
		return $freshProgramsJson;
	}

	function getLastSavedIndexFromFile() {
		if ( !is_null($tmpK = intval(file_get_contents($GLOBALS['lastSavedIndexFilePath']))) )
			return $tmpK;
		else 
			return 0;
	}

	function readScheduleFromJsonFile() {
		$scheduleAsJson = file_get_contents($GLOBALS['scheduleFilePath']);
		return $scheduleAsJson;
	}

	function getScheduleAndSaveToFile() {
		$scheduleJson = decodeStringToJson(fetchJson($GLOBALS['scheduleURL']));
		saveJsonObjectToFile($scheduleJson, "../json/schedule.json");
		updateFirstUpcomingProgramIndex(0);
	}

	function updateFirstUpcomingProgramIndex($val) {
		file_put_contents($GLOBALS['lastSavedIndexFilePath'], $val, LOCK_EX);
	}

	function saveJsonObjectToFile($jsonObj, $filepath) {
		$str = encodeJsonObjToStr($jsonObj);
		file_put_contents($filepath, $str, LOCK_EX);
	}

	function saveJsonObjectToUpcomingProgramsJSONFile($jsonObj) {
		saveJsonObjectToFile($jsonObj, $GLOBALS['upcomingProgramsFilePath']);
	}

	function getFreshProgramsFromFile() {
		$upcomingPrograms = readUpcomingProgramsFromFile();
		$programsAsJson = decodeStringToJson($upcomingPrograms);
		$freshProgramsJson = (decodeStringToJson('{"programs":[]}'));
		// show(encodeJsonObjToStr($freshProgramsJson));
		// array_push(($freshProgramsJson->programs), (decodeStringToJson('{"Sluchowisko" : "ww"}')));
		for ($i=0; $i<count($programsAsJson->programs); $i++) {
			$program = getNthProgramFromOriginalJson($programsAsJson, $i);
			if (isProgramFresh($program)) {
				array_push($freshProgramsJson->programs, $program);
			}
		}
		return $freshProgramsJson;
	}

	function getNumberOfProgramsInJson($json) {
		return count($json->programs);
	}

	function isProgramFresh($programAsJson){
		$currDate = getCurrentDate(); // Y-m-d H:i:s
		$programStartingDate = $programAsJson->fade_in_at;
		if (strtotime($currDate) > strtotime($programStartingDate))
			return false;
		else
			return true;
	}

	function getCurrentDate() {
		return date('Y-m-d H:i:s');
	}


	// to format YYYY-MM-DD HH:mm:ss
	function parseFadeTime($fadeTime) {
		$tLetterPos = strpos($fadeTime,"T");
		$dotLetterPos = strpos($fadeTime,'.');
		$dateYmd = substr($fadeTime, 0, $tLetterPos);
		$dateHis = substr($fadeTime, $tLetterPos+1, $dotLetterPos-$tLetterPos-1);
		return "$dateYmd $dateHis";
	}

	function getStartTimeForNthProgram($n) {
		$upcomingPrograms = readUpcomingProgramsFromFile();
		$json = decodeStringToJson($upcomingPrograms);
		$program = $json->programs[$n];
		$fadeInAt = getFadeInPropertyForProgram($program);
		$parsedTime = parseFadeTime($fadeInAt);
		return $parsedTime;
	}	

	// get file->name, fade_in_at, etc. for n-th program
	function getNthProgramFromOriginalJson($json, $n) {
		return $json->programs[$n];
	}

	function getFadeInPropertyForProgram($programAsJson) {	
		return $programAsJson->fade_in_at;
	}

	function readUpcomingProgramsFromFile() {
		$upcomingProgramsFilePath = "../json/upcomingPrograms.json";
		$json = file_get_contents($upcomingProgramsFilePath);
		return $json;
	}

	function fetchJson($url){
		$json = file_get_contents($url);
		return $json;
	}

	function decodeStringToJson($string){
		$jsonObj = json_decode($string, false, 512, JSON_UNESCAPED_UNICODE);
		return $jsonObj;
	}

	function encodeJsonObjToStr($jsonObj){
		$str = json_encode($jsonObj, JSON_UNESCAPED_UNICODE);
		return $str;
	}

	function show($str = "") {
		print_r("<br>" . $str);
	}
?>