window.ImageConvert = {

	getUri: function(file) {
		return new Promise((resolve, reject) => {
			let reader = new FileReader();
			reader.onload = (event) => { resolve( event.target.result ); };
			reader.onerror = ()=>reject( 'Can\'t read file ' + file.name );
			reader.readAsDataURL( file );
		});
	},

	getData: function(file) {
		return new Promise((resolve, reject) => {
			let reader = new FileReader();
			reader.onload = (event) => { resolve( event.target.result ); };
			reader.onerror = ()=>reject( 'Can\'t read file ' + file.name );
			reader.readAsArrayBuffer( file );
		});
	},

	toHex: function(num) {
		let h = Math.round(num).toString(16).toUpperCase();
		return h.length === 0 ? '00' : h.length === 1 ? '0' + h : h;
	},


	uri2img: function(uri) {
		return new Promise((resolve, reject) => {
			let image = new Image();
			image.onload = ()=>resolve(image);
			image.onerror = ()=>reject('Selected file is not image');
			image.src = uri;
		});
	},

	getPixels: function(img) {
		let context = document.createElement('canvas').getContext('2d');
		context.drawImage(img, 0, 0);

		let pixels = [];
		for (let x = 0; x < img.width; x++) {
			for (let y = 0; y < img.height; y++) {
				let data = context.getImageData(x, y, 1, 1).data;
				pixels.push({
					x: x,
					y: y,
					r: data[0],
					g: data[1],
					b: data[2],
					a: data[3]
				});
			}
		}
		return pixels;
	}
};



(function() {
'use strict';

})();