var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

$(function() {
	$('.download-link').click(function(event) {
		if ($(this).hasClass('downloading')) {
			return suppress(event);
		}

		// Send event to Analaytics
		var label = $(this).data('os') || "";
		ga('send', 'event', 'Software', 'Download', label);

		// Fade in a spinner
		transformIntoSpinner(this);

		// TODO: For now, we just pretend the request was made, to show the effect.
		var self = this;
		setTimeout(function() { transformBack(self) }, 2500);

		return suppress(event);
	});
});


function transformIntoSpinner(link)
{
	$(link).addClass('downloading');
	$('.label', link).one(animationEnd, function() {
		if ($(link).hasClass('downloading'))
		{
			$(this).hide();
			$(link).append('<span class="spinner-container animated zoomIn"><span class="spinner"><span class="bounce1"></span><span class="bounce2"></span><span class="bounce3"></span></span><span class="spin-text">Building</span></span>');
		}
	}).addClass('animated zoomOut');
}


function transformBack(link)
{
	$(link).removeClass('downloading');
	$('.spinner-container', link).one(animationEnd, function() {
		$(this).remove();
		$('.label', link).show().removeClass('zoomOut').addClass('zoomIn');
	}).addClass('animated zoomOut');
}

