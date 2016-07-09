$(function() {
	$('.wallet a').click(function(event) {
		var name = $(this).data('name');
		var email = $(this).data('link');
		sweetAlert({
			imageUrl: "/resources/resources/images/donations/wallet.png",
			title: "Donate to "+name,
			text: 'Send payment to <b>'+email+'</b><br><br>You may use the Google Wallet mobile app or <a href="https://wallet.google.com">website</a>.<br><br>Thank you!',
			html: true,
			confirmButtonText: "Done"
		});
		return suppress(event);
	});
	
	$('.bitcoin a').click(function(event) {
		var name = $(this).data('name');
		var link = $(this).data('link');
		var address = $(this).data('address');
		sweetAlert({
			imageUrl: "/resources/resources/images/donations/bitcoin.png",
			title: "Donate to "+name,
			text: '<div style="text-align: center;"><img src="https://i.imgur.com/1u8U52e.png" height="200"><br></br><a target="_blank" href="'+link+'">'+address+'</a></div>',
			html: true,
			confirmButtonText: "Done"
		});
		return suppress(event);
	});
});