var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

$(function() {
	var buildServerDown = false;

	updateDownloadLinks();


	// Get list of features
	$.get("/features.json", function(data, status, jqxhr) {
		if (!data)
			return;

		var tpl = '<div class="grid-25 mobile-grid-50"><label><span class="directive"><input type="checkbox"> {{DIRECTIVE}}</span><span class="description">{{DESCRIPTION}}</span></label></div>';

		// List alphabetically
		data.sort(function(a, b) {
			if (a.directive < b.directive)
				return -1;
			else if (a.directive > b.directive)
				return 1;
			else
				return 0;
		});

		// Render to page
		for (var i = 0; i < data.length; i++) {
			var featHTML = tpl.replace("{{DIRECTIVE}}", data[i].directive)
			                  .replace("{{DESCRIPTION}}", data[i].description);
			var $elem = $(featHTML);
			$elem.insertBefore('#add-yours-container');
			if ((i % 4) - 1 == 1)
			 	$('#add-yours-container').before('<div class="clear"></div>');
		}
	}).fail(function() {
		showBuildServerDown();
	});

	// Update download URLs when features are selected
	$('#features').on('click', 'label', function() {
		updateDownloadLinks();
	});

	// Download when link clicked
	$('.download-link').click(function(event) {
		var $self = $(this);

		// Don't overlap downloads
		if ($(this).hasClass('downloading')) {
			return suppress(event);
		}

		// Send event to Analaytics
		var label = $(this).data('platform') || "";
		ga('send', 'event', 'Software', 'Download', label);

		// Let the browser just download the static file
		if (buildServerDown)
			return;

		// Fade in a spinner
		transformIntoSpinner(this);

		// Make request
		var url = $(this).attr('href');
		var thisDownloadLink = this;
		$.ajax(url, { method: "HEAD" }).done(function(data, status, jqxhr) {
			window.location = jqxhr.getResponseHeader("Location");
		}).fail(function(jqxhr, status, error) {
			swal({
				type: "error",
				title: "Error: " + error,
				text: "Sorry about that. You can try again or download Caddy core from our backup site (without any extra features).",
				showCancelButton: true,
				confirmButtonText: "Download Core Now",
				cancelButtonText: "I'll Try Again"
			}, function(choseDownloadCore) {
				if (choseDownloadCore) {
					showBuildServerDown();
					window.location = $self.attr('href');
				}
			});
		}).always(function(data, status, jqxhr) {
			transformBack(thisDownloadLink);
		});

		return suppress(event);
	});



	// hides feature selection and changes all links to static file downloads
	// so user can still download Caddy core from GitHub. Must be inside
	// the closure where buildServerDown is defined.
	function showBuildServerDown() {
		buildServerDown = true;
		$('.buildserver-down').show();
		$('.custom-builds').hide();

		$('.download-link').each(function() {
			var target = $(this).data('platform').replace("-", "").replace("osx", "mac").replace("windows", "win");
			$(this).attr('href', "/download/"+target);
		});
	}
});

// produces a comma-separated feature list based on selected features
// the return value is not url-encoded
function featureList() {
	var feat = "";
	$('#features :checked').each(function() {
		if ($(this).prop('disabled'))
			return;
		feat += $.trim($(this).parent().text()) + ",";
	});
	return feat.substr(0, feat.length-1);
}

// transforms a download link into a spinner
function transformIntoSpinner(link)
{
	$(link).addClass('downloading');
	$('.label', link).one(animationEnd, function() {
		if ($(link).hasClass('downloading'))
		{
			$(this).hide().removeClass('zoomOut');
			$(link).append('<span class="spinner-container animated zoomIn"><span class="spinner"><span class="bounce1"></span><span class="bounce2"></span><span class="bounce3"></span></span><span class="spin-text">Building</span></span>');
		}
	}).addClass('animated zoomOut');
}

// transforms a download link from a spinner back to its regular, clickable state
function transformBack(link)
{
	$('.label', link).removeClass('zoomOut');
	$(link).removeClass('downloading');
	$('.spinner-container', link).one(animationEnd, function() {
		$(this).remove();
		$(link).removeClass('downloading');
		$('.label', link).show().addClass('zoomIn');
	}).addClass('animated zoomOut');
}


function updateDownloadLinks()
{
	$('.download-link').each(function() {
		var os = $(this).data('os'),
			arch = $(this).data('arch'),
			url = "/download/build?os="+encodeURIComponent(os)
					+"&arch="+encodeURIComponent(arch)
					+"&features="+encodeURIComponent(featureList());
		$(this).attr('href', url);
	});
}