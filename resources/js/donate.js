$(function() {
	$('.wallet a').click(function(event) {
		// TEMPORARILY HARD-CODED LIKE THIS, FOR EXAMPLE
		sweetAlert({
			imageUrl: "/resources/images/donations/wallet.png",
			title: "Donate to Matt",
			text: 'Send payment to <b>Matthew.Holt@gmail.com</b><br><br>You may use the Google Wallet mobile app or <a href="https://wallet.google.com">website</a>.<br><br>Thank you!',
			html: true,
			confirmButtonText: "Done"
		});
		return suppress(event);
	});
});