var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

$(function() {
	var buildServerDown = false;
	var stripePublishableKey = (window.location.hostname == "caddyserver.com") ? "pk_live_PRNBeH2wF2OD9fRO0bZ1Zj6i" : "pk_test_tvnNemXjiZkKVeNwRm0LKtQ1";

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

	// See if payment gateway is up
	$.get("/stripe/online", function(data, status, jqxhr) {
		// Good, it's up!
	}).fail(function() {
		$('.payments-online').hide();
		$('#payments-down').show();
	});



	// Stripe Checkout
	var stripeAmount = 0; // stripeAmount is dollar amount * 100
	var checkout = StripeCheckout.configure({
		key: stripePublishableKey,
		image: "/resources/resources/images/caddy-leaf-circle.png",
		name: "Caddy Web Server",
		opened: function() {
			// Report to Analytics
			ga('send', 'event', 'Software', 'Payment', 'Payment Opened', stripeAmount/100);
		},
		closed: function() {
			// This callback is called every time the Checkout popup closes,
			// regardless of whether payment was complete or not.
			
			// Report to Analytics
			ga('send', 'event', 'Software', 'Payment', 'Payment Closed', stripeAmount/100);
		},
		token: function(token) {
			$.post("/stripe/charge", {
				token_id: token.id,
				email: token.email,
				amount: stripeAmount,
				description: "Download Caddy Web Server",
				subscribe_releases: $('#subscribe-releases').prop('checked')
			}).done(function(data) {
				// Report to Analytics
				ga('send', 'event', 'Software', 'Payment', 'Payment Success', stripeAmount/100);

				if (stripeAmount > 2500) {
					$('.result1').show();
					$('.result2').hide();
				} else {
					$('.result1').hide();
					$('.result2').show();
				}
				$('#amount').val("").keyup();
				$('#payment-success').show('medium');
			}).fail(function(jqxhr, status, error) {
				// Report to Analytics
				ga('send', 'event', 'Software', 'Payment', 'Payment Failed', stripeAmount/100);

				sweetAlert({
					type: "error",
					title: "Error: " + error,
					text: 'Your card was not charged. You can try again or <a href="/donate">donate</a> using a different payment method.<br><br><small><b>Error message:</b> '+jqxhr.responseText+'</small>',
					html: true
				});
			});
		}
	});

	var transactionFeeMin = 4; // minimum dollar amount we ask to help cover transaction fees
	$('#amount').keyup(function(event) {
		var val = normalizeAmount($(this).val());
		if (!val) {
			$('#amount-feedback').html('');
			return;
		}
		var amount = parseFloat(val);
		if (monetary(val) && !isNaN(amount)) {
			if (amount <= 0) {
				$('#amount-feedback').html('<span style="color: red;">Aw man. :( But you can still download Caddy.</span>');
			} else if (amount < transactionFeeMin) {
				$('#amount-feedback').html('<span style="color: red;">Please go higher so we can cover transaction fees, thanks!</span>');
			} else if (amount < 10) {
				$('#amount-feedback').html('<span style="color: #FF9100;">Thanks; maybe contribute again soon!</span>');
			} else if (amount < 18) {
				$('#amount-feedback').html('<span style="color: black;">Thanks, this buys a lunch</span>');
			} else if (amount < 25) {
				$('#amount-feedback').html('<span style="color: black;">Thanks, this buys a dinner</span>');
			} else if (amount < 50) {
				$('#amount-feedback').html('<span style="color: black;">Thank you very much for your support!</span>');
			} else if (amount < 100) {
				$('#amount-feedback').html('<span style="color: #1FB91F;">Thank you! We\'ll do our best to help you out.</span>');
			} else if (amount < 200) {
				$('#amount-feedback').html('<span style="color: #1FB91F;">Wow, thank you! This helps us a lot so we can help you. :)</span>');
			} else {
				$('#amount-feedback').html('<span style="color: #1FB91F;">WOAH, you\'re awesome! :D</span>');
			}
		} else {
			$('#amount-feedback').html('<span style="color: red;">Invalid amount</span>');
		}
	});

	// Show Checkout when user clicks Pay
	$('#pay').click(function(event) {
		var input = $('#amount').val();
		var amount = normalizeAmount(input);

		if (!amount) {
			$('#amount-feedback').html('<span style="color: black;">Please type an amount.</span>');
			$('#amount').focus();
			return suppress(event);
		}

		if (!monetary(amount))
		{
			sweetAlert({
				type: "error",
				title: "Invalid Amount",
				text: "Please type a simple monetary value only with numbers and maybe a decimal point. (Do not use dollar signs, letters, or symbols.) You typed: "+input,
			});
			return suppress(event);
		}

		amount = parseFloat(amount);
		if (amount < transactionFeeMin) {
			sweetAlert({
				type: "warning",
				title: "Transaction Fees",
				text: "We have to cover transaction fees. Can you go just a few dollars higher?",
			});
			return suppress(event);
		}

		stripeAmount = Math.round(amount * 100); // I wish stripe sent the amount into Checkout's token callback

		checkout.open({
			name: "Caddy Web Server",
			amount: stripeAmount,
			locale: "auto",
			bitcoin: true
		});

		return suppress(event);
	});

	// Close Checkout on back button
	$(window).on('popstate', function() {
		checkout.close();
	});

	// Show dialog explaining mailing list
	$('#about-emails').click(function(event) {
		sweetAlert({
			title: "Mailing List",
			text: "We don't sell or share your email address, and we only send you email when new Caddy releases are available.<br><br>You can unsubscribe at any time.",
			html: true
		});
		return suppress(event);
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
			sweetAlert({
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

	// normalizeAmount sanitizes amt by trimming spaces
	// replacing "," decimal with ".", if needed,
	// and removing thousands separators.
	// It does not change the original input value otherwise.
	function normalizeAmount(amt) {
		amt = amt.trim(amt);
		var parts = amt.split(",");
		if (parts.length == 2 && parts[1].length == 2) {
			parts[0] = parts[0].replace(".", ""); // strip unneeded thousands sep
			amt = parts.join(".");
		} else {
			amt = amt.replace(",", "");
		}
		return amt;
	}

	// monetary returns whether val looks like a valid monetary value.
	function monetary(val) {
		return /^((\d+(\.*\d{0,2})?)|(\d*\.\d{1,2}))$/.test(val);
	}



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