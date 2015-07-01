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
		}
	}).fail(function() {
		$('.buildserver-down').show();
		$('.custom-builds').hide();

		$('.download-link').each(function() {
			buildServerDown = true;
			var target = $(this).data('platform').replace("-", "").replace("osx", "mac").replace("windows", "win");
			$(this).attr('href', "/download/"+target);
		});
	});

	// Update download URLs when features are selected
	$('#features').on('click', 'label', function() {
		updateDownloadLinks();
	});

	// Download when link clicked
	$('.download-link').click(function(event) {
		if (buildServerDown)
			return;

		if ($(this).hasClass('downloading')) {
			return suppress(event);
		}

		// Send event to Analaytics
		var label = $(this).data('platform') || "";
		ga('send', 'event', 'Software', 'Download', label);

		// Fade in a spinner
		transformIntoSpinner(this);

		// Make request
		var url = $(this).attr('href');
		var thisDownloadLink = this;
		$.ajax(url, { method: "HEAD" }).done(function(data, status, jqxhr) {
			window.location = jqxhr.getResponseHeader("Location");
		}).fail(function(jqxhr, status, error) {
			swal({
				title: "Oops.",
				text: "Something went wrong: "+error,
				type: "error",
				confirmButtonText: "OK"
			});
		}).always(function(data, status, jqxhr) {
			transformBack(thisDownloadLink);
		});

		return suppress(event);
	});
});

function featureList() {
	var feat = "";
	$('#features :checked').each(function() {
		if ($(this).prop('disabled'))
			return;
		feat += $.trim($(this).parent().text()) + ",";
	});
	return feat.substr(0, feat.length-1);
}


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