<template>
	<section class="content">
		<div class="flex-row">

			<!------------------->
			<!-- IMAGE PREVIEW -->
			<!------------------->
			<figure class="image-preview">
				<img :src="uri">
			</figure>


			<!--------------->
			<!-- DROP AREA -->
			<!--------------->
			<div class="image-input">
				<label class="from-url">
					<input type="url" v-model="imageUrl" placeholder="Path to image">
					<button @click="loadImage()">Load</button>
				</label>
				<label class="drop-area">
					Click or drop file here<br>(image file only)
					<input type="file" accept="image/*" @change="fromFile($event)">
				</label>
			</div>


			<!---------------->
			<!-- IMAGE INFO -->
			<!---------------->
			<fieldset class="image-info"><legend>Image info</legend>
				<table v-if="!error">
					<tr>
						<td>Name:</td><td>{{name}}</td>
					</tr>
					<tr>
						<td>Type:</td><td>{{type}}</td>
					</tr>
					<tr>
						<td>Size:</td><td>{{size}} b</td>
					</tr>
					<tr>
						<td>Width:</td><td>{{width}} px</td>
					</tr>
					<tr>
						<td>Height:</td><td>{{height}} px</td>
					</tr>
				</table>
				<p v-if="error">{{error}}</p>
				<div class="text-center">
					<input type="reset" value="RESET" class="go-center" @click="reset()">
				</div>
			</fieldset>
		</div>

		<hr>

		<div class="flex-row">


			<!-------------->
			<!-- URI CODE -->
			<!-------------->
			<fieldset class="image-code"><legend>Image URI - {{uri.length}} b</legend>
				<textarea v-model="uri" readonly rows="20"></textarea>
			</fieldset>


			<!-------------->
			<!-- CSS CODE -->
			<!-------------->
			<fieldset class="image-code"><legend>Image CSS - {{css.length}} b</legend>
				<textarea v-model="css" readonly rows="20"></textarea>
			</fieldset>
		</div>
	</section>
</template>

<style>
.flex-row {
	display: -ms-flexbox;
	display: flex;
}

.image-input {
	-ms-flex: 1 1 auto;
	flex: 1 1 auto;
	margin:0 20px;
}
.from-url { display:block; height:3em; }
.from-url input { width:calc(100% - 5em); }
.from-url button {
	float:right;
	width:4em;
}
.drop-area {
	display:block;
	padding:100px 20px;
	line-height:1.2;
	text-align:center;
	position:relative;
	border:3px dashed #26619C;
}
.drop-area input {
	top:0;
	left:0;
	opacity:0;
	width:100%;
	height:calc(100% - 3em);
	position:absolute;
}

.image-info {
	width:300px;
	-ms-flex: 0 1 auto;
	flex: 0 1 auto;
}
.image-info table {
	border:none;
}
.image-info td:first-child {
	text-align:right;
	border-right:1px solid #26619C;
}

.image-preview {
	-ms-flex: 1 1 auto;
	flex: 1 1 auto;
	margin:0;
	border:1px solid #26619C;
}
.image-preview img {
	width:auto;
	max-width:100%;
}

.image-code {
	-ms-flex: 1 1 auto;
	flex: 1 1 auto;
	margin-right:20px;
}
.image-code textarea {
	width:100%;
	margin:0;
}
.image-code:last-child {
	margin-right:0;
}
</style>

<script>
exports = {
	name: '',
	type: '',
	size: '',
	uri: '',
	css: '',
	width: 0,
	height: 0,
	img: Image,
	imageUrl: '',
	error: '',
	reset: function() {
		this.name = '';
		this.type = '';
		this.size = 0;
		this.uri = '';
		this.css = '';
		this.width = 0;
		this.height = 0;
		this.img = null;
		this.error = '';
		this.imageUrl = '';
	},


	loadImage: function() {
		let self = this;
		window.ImageConvert.loadImage(this.imageUrl)
			.then( xhr => {
				self.size = xhr.response.size;
				self.type = xhr.response.type;
				self.name = getFileName(xhr.responseURL);
			})
			.catch(function(e) { self.error = e; });
		window.ImageConvert.uri2img(this.imageUrl)
			.then( img => {
				self.makeCss(img);
				self.img = img;
				self.width = img.naturalWidth;
				self.height = img.naturalHeight;
				return img;
			})
			.then(img => {
				self.uri = window.ImageConvert.img2uri(img);
			})
			.catch(function(e) { self.error = e;console.log('error', e); });

		function getFileName(url) {
			let l = url.lastIndexOf('/') + 1;
			let p = url.indexOf('?');
			return p >= 0 ? url.substring(l, p) : url.substring(l);
		}
	},


	fromFile: function(e) {
		if( !e.target.files || e.target.files.length === 0) { return; }
		this.run(e.target.files[0]);
	},


	makeCss: function(img) {
		let pixels = window.ImageConvert.getPixels(img);
		this.css = window.ImageConvert.makeCssImage(pixels, img.naturalWidth, img.naturalHeight);
	},

	run: function(file) {
		let self = this;
		this.reset();

		extractDataFromImage(file)
			.catch( setProps )
			.then( setProps );

		function setProps(imgData) {
			if( imgData.error ) {
				self.name = imgData.name;
				self.error = imgData.error;
			} else {
				self.name = imgData.name;
				self.type = imgData.type;
				self.size = imgData.size;
				self.uri = imgData.uri;
				self.css = imgData.css;
				self.width = imgData.width;
				self.height = imgData.height;
				self.img = imgData.img;
				self.error = imgData.error;
			}
		}
	}
};




function extractDataFromImage(imgFile) {
	imgFile = imgFile || {};

	let imgData = {
		name: imgFile.name || '',
		type: imgFile.type || '',
		size: imgFile.size || 0,
		uri: '',
		css: '',
		width: 0,
		height: 0,
		img: null,
		error: ''
	};


	return window.ImageConvert.getUri(imgFile)
		.then( uri => imgData.uri = uri )
		.then( window.ImageConvert.uri2img )
		.then( img => {
			let pixels = window.ImageConvert.getPixels(img);
			imgData.css = window.ImageConvert.makeCssImage(pixels);
			imgData.img = img;
			imgData.width = img.naturalWidth;
			imgData.height = img.naturalHeight;
			return imgData;
		})
		.catch( errorHandler );

	function errorHandler(error) {
		imgData.error = error;
		console.log('ERROR:', error);
		return imgData;
	}
}
</script>