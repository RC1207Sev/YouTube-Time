ga('send', 'pageview', '/blocked.html');

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.msg == "goToSavedVideo") {
		chrome.storage.local.get("savedVideoURL", function(data) {
			chrome.tabs.update({url: data.savedVideoURL});
		}); 
	}
});

$("#override").click(function() {
	var answer = confirm("Are you sure you need to use YouTube?")
	if (answer) {
    	ga('send', {hitType: 'event', eventCategory: 'Blocked page', eventAction: 'Override'});
		// update currentOverrideCount
		chrome.storage.local.get({"currentOverrideCount":1, "limitOverrides":true}, function(data) {
			if (data.limitOverrides) {
				chrome.storage.local.set({"currentOverrideCount": data.currentOverrideCount - 1}, function() {
					chrome.runtime.sendMessage({
						msg: "override", 
						value: true
					});
				});
			} else {
				chrome.runtime.sendMessage({
					msg: "override", 
					value: true
				});
			}
		});
		
	}
});

// check if we still have some overrides left, otherwise remove the div with the button
chrome.storage.local.get({"currentOverrideCount":0, "limitOverrides":true}, function(data) {

	if(data.currentOverrideCount < 1 && data.limitOverrides) {
		// delete the button
		$("#overrideCommands").remove();
	} else {
		if (data.limitOverrides)
			$("#overridesLeft").text(data.currentOverrideCount + " Left");
		$("#overrideCommands").show();
	}
	
});

function isYoutubeVideo(url) {
	return url.match(/(https?:\/\/(.+?\.)?youtube\.com\/watch([A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?)/)
}