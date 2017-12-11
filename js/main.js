window.onload = function () {
	ajaxReloadingPageContent();
	$("body").removeClass("preload");
	window.setTimeout(loadDelayedFunctions, 500);
	// delayedFunction();
	scheduleUpdator();
}