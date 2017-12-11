// instead of setTimeout set setInterval to refresh site in interval
function delayedFunction() {
	setInterval(function() {
	for (var i = 0; i < document.querySelectorAll("link[rel=stylesheet]").length; i++) {
		link = document.querySelectorAll("link[rel=stylesheet]")[i];
		link.href = link.href.replace(/\?.*|$/, "?ts=" + new Date().getTime());
		ajaxReloadingPageContent();
	}
	}, 2000);
}


function ajaxReloadingPageContent() {
	
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			document.body.innerHTML = this.responseText;
		}
	};
	xmlhttp.open("GET", "php/autorefresher.php", true);
	xmlhttp.send();
}