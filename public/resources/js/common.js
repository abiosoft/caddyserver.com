// Google Analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-86578-24', 'auto');
ga('send', 'pageview');


if (typeof jQuery !== 'undefined')
{
	$(function() {
		$('nav .menu-link').click(function() {
			$('nav').toggleClass('expanded');
		});

		// Report mailing list subscriptions to Analytics
		$('#mc-embedded-subscribe').click(function() {
			ga('send', 'event', 'Mailing List', 'Subscribe', 'Release Announcements');
		});
	});
}

function suppress(event)
{
	if (!event)
		return false;
	if (event.preventDefault)
		event.preventDefault();
	if (event.stopPropagation)
		event.stopPropagation();
	event.cancelBubble = true;
	return false;
}