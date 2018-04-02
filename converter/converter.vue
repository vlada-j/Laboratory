<template>
	<section class="content">

		<textarea class="go-left" style="width:calc(100% - 220px)" rows="30" v-model="textField"></textarea>

		<div class="go-right" style="width:200px">
			<fieldset class="w100"><legend>Convert</legend>
				<button class="w100" @click="converter2Cir()">У Ћирилицу</button>
				<button class="w100" @click="converter2Lat()">U Latinicu</button>
				<hr>
				<div class="text-center">
					<input type="reset" class="go-center" @click="textField = ''" value="Clear">
				</div>
			</fieldset>

			<fieldset class="w100"><legend>Text normalization</legend>
				<div class="form-group">
					<label for="cbE">Enters</label>
					<input id="cbE" type="checkbox" v-model="clearWithEnters">
				</div>
				<div class="form-group">
					<label for="cbS">Spaces</label>
					<input id="cbS" type="checkbox" v-model="clearWithSpaces">
				</div>
				<div class="form-group">
					<label for="cbT">Trim</label>
					<input id="cbT" type="checkbox" v-model="withTrim">
				</div>
				<hr>
				<div class="text-center">
					<button class="go-center" @click="clear()">Normalize</button>
				</div>
			</fieldset>
		</div>

	</section>
</template>

<script>
exports = {
	textField: '',
	clearWithEnters: true,
	clearWithSpaces: true,
	withTrim: true,

	converter2Cir: function() { this.textField = TextConverter.toCir(this.textField); },
	converter2Lat: function() { this.textField = TextConverter.toLat(this.textField); },
	clear: function() {
		let text = this.textField;

		text = this.clearWithSpaces	? TextCleaner.spaces(text)	: text;
		text = this.withTrim		? TextCleaner.trim(text)	: text;
		text = this.clearWithEnters	? TextCleaner.enters(text)	: text;

		this.textField = text;
	}
}
</script>