<template>
	<section class="content">
		<p v-if="error">{{error}}</p>
		<label class="drop-area">
			Click or drop file here<br>(image file only)
			<input type="file" accept="image/*" @change="run($event)">
		</label>
		<fieldset class="go-right w30"><legend>Image details</legend>
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

		<hr>

		<img :src="uri" class="go-left w30">
		<textarea v-model="uri" class="block w66 go-right" readonly rows="20"></textarea>
	</section>
</template>

<style>
.drop-area {
	float:left;
	width:66%;
	padding:100px 20px;
	line-height:1.2;
	text-align:center;
	display:block;
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
</style>

<script>
exports = {
	name: '',
	type: '',
	size: '',
	uri: '',
	width: 0,
	height: 0,
	img: Image,
	error: '',
	reset: function() {
		this.name = '';
		this.type = '';
		this.size = 0;
		this.uri = '';
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
		width: 0,
		height: 0,
		img: null,
		error: ''
	};

	return readFile(imgFile)
		.then( uri => imgData.uri = uri )
		.catch( errorHendler )
		.then( uri2img )
		.then( img => {
			imgData.img = img;
			imgData.width = img.naturalWidth;
			imgData.height = img.naturalHeight;
			return imgData;
		})
		.catch( errorHendler );

	function errorHendler(error) {
		imgData.error = error;
		return imgData;
	}

	function readFile(file) {
		let reader = new FileReader();

		return new Promise((resolve, reject) => {
			reader.onload = (event) => { resolve( event.target.result ); };
			reader.onerror = ()=>reject( 'Can\'t read file ' + file.name );
			reader.readAsDataURL( file );
		});
	}

	function uri2img(uri) {
		let image = new Image();

		return new Promise((resolve, reject) => {
			image.onload = ()=>resolve(image);
			image.onerror = ()=>reject('Selected file is not image');
			image.src = uri;
		});
	}
}
</script>