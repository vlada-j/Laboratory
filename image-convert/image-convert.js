window.ImageConvert = {

	loadImage: function(url) {
		return new Promise((resolve, reject) => {
			let xhr = new XMLHttpRequest();
			xhr.open('GET', url, true);
			xhr.responseType = 'blob';
			xhr.onload = ()=>resolve(xhr);
			xhr.onerror = (e)=>reject(e);
			xhr.send();
		});
	},

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

	img2uri: function(img) {
		let canvas = document.createElement('canvas');
		canvas.width = img.naturalWidth;
		canvas.height= img.naturalHeight;
		canvas.getContext('2d').drawImage(img, 0, 0);
		return canvas.toDataURL();
	},


	uri2img: function(url) {
		return new Promise((resolve, reject) => {
			let image = new Image();
			image.crossOrigin = 'anonymous';
			image.onload = ()=>resolve(image);
			image.onerror = ()=>reject('Image can\'t by loaded');
			image.src = url;
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
	},

	makeCssImage: function(pixels, width, height) {
		let shadow = pixels.map(function(p) {
			return p.x + 'px '
				+ p.y + 'px #'
				+ window.ImageConvert.toHex(p.r)
				+ window.ImageConvert.toHex(p.g)
				+ window.ImageConvert.toHex(p.b);
		});

		let rightMargin = width - 1;
		let bottomMargin = height - 1;

		return '.pixels{\n'
			+'display:inline-block;\n'
			+'width:1px;\n'
			+'height:1px;\n'
			+'margin:0 ' + rightMargin + 'px ' + bottomMargin + 'px 0;\n'
			+'box-shadow:' + shadow.join(',') + ';\n'
			+'}';
	}
};