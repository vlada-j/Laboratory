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
			<label class="drop-area">
				Click or drop file here<br>(image file only)
				<input type="file" accept="image/*" @change="run($event)">
			</label>


			<!---------------->
			<!-- IMAGE INFO -->
			<!---------------->
			<fieldset class="image-info"><legend>Image info</legend>
				<table>
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
			</fieldset>
		</div>
		<p v-if="error">{{error}}</p>

		<hr>

		<div class="flex-row">


			<!-------------->
			<!-- URI CODE -->
			<!-------------->
			<fieldset class="image-code"><legend>Image URI</legend>
				<textarea v-model="uri" readonly rows="20"></textarea>
			</fieldset>


			<!-------------->
			<!-- CSS CODE -->
			<!-------------->
			<fieldset class="image-code"><legend>Image CSS</legend>
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


.drop-area {
	-ms-flex: 1 1 auto;
	flex: 1 1 auto;
	margin:0 20px;
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
	height:100%;
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
	},
	run: function(e) {
		if( !e.target.files || e.target.files.length === 0) { return; }

		let self = this;
		this.reset();

		extractDataFromImage(e.target.files[0])
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
			imgData.css = getCSS(img);
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



function getCSS(img) {
	let pixels = window.ImageConvert.getPixels(img);

	let shadow = pixels.map(p => {
		return p.x + 'px '
			+ p.y + 'px #'
			+ window.ImageConvert.toHex(p.r)
			+ window.ImageConvert.toHex(p.g)
			+ window.ImageConvert.toHex(p.b);
	});

	let rightMargin = img.width - 1;
	let bottomMargin = img.height - 1;

	return '.pixels{\n'
		+'display:inline-block;\n'
		+'width:1px;\n'
		+'height:1px;\n'
		+'margin:0 ' + rightMargin + 'px ' + bottomMargin + 'px 0;\n'
		+'box-shadow:' + shadow.join(',') + ';\n'
		+'}';
}
</script>