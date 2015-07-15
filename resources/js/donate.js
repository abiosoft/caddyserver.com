$(function() {
	$('.wallet a').click(function(event) {
		var name = $(this).data('name');
		var email = $(this).data('link');
		sweetAlert({
			imageUrl: "/resources/images/donations/wallet.png",
			title: "Donate to "+name,
			text: 'Send payment to <b>'+email+'</b><br><br>You may use the Google Wallet mobile app or <a href="https://wallet.google.com">website</a>.<br><br>Thank you!',
			html: true,
			confirmButtonText: "Done"
		});
		return suppress(event);
	});
});