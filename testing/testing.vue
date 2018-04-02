<template>
	<section id="Testing">
		<div class="w75 go-left content">
			<article class="test-panel" :class="{ error: errors[index] }" v-for="(test, index) in tests">
				<code>function test{{index + 1}}() {</code>
				<textarea class="w100" rows="5" v-bind:value="test" :disabled="inProcess"></textarea>
				<code>}</code>
				<button @click="remove(index)" v-if="index > 0" :disabled="inProcess">×</button>
			</article>
			<button class="go-right" @click="add()" :disabled="inProcess">Add new test panel</button>
		</div>

		<fieldset class="w20 go-right row"><legend>Testing</legend>
			<div class="form-group">
				<label>Repeating:</label>
				<input type="number" v-model="repeating">
			</div>
			<div class="text-center">
				<input type="submit" v-if="!inProcess" class="go-center" @click="runTests()" value="=> RUN <=">
				<label v-if="inProcess">Processing...</label>
			</div>
			<hr>
			<table>
				<tr><th colspan="2">Results of tests:</th></tr>
				<tr v-for="(result, index) in results"><td>Test {{index + 1}}:</td><td> {{result === false ? '-' : result + ' ms'}}</td></tr>
			</table>
			<div class="text-center">
				<input type="reset" class="go-center" @click="reset()" :disabled="inProcess" value="RESET">
			</div>
		</fieldset>
	</section>
</template>

<script>
exports = {
	inProcess: false,
	repeating: 1000,
	tests: ['3+5', 'new Function("3+5")', 'eval("3+5")'],
	results: [false, false, false],
	errors: [false, false, false],
	reset: function() { this.tests = ['']; this.results = [false]; this.errors = [false]; },
	add: function() { this.tests.push(''); this.results.push(0); this.errors.push(false); },
	remove: function(index) { this.tests.splice(index, 1); this.results.splice(index, 1); this.errors.splice(index, 1); },
	runTests: function() {
		this.tests = [];
		document.querySelectorAll('#Testing .test-panel textarea').forEach((t)=> this.tests.push(t.value) );

		this.tests = this.tests.filter(v=>!!v);
		if( this.tests.length === 0 ) { this.reset(); return; }

		this.inProcess = true;

		let errors = this.errors = [];
		let results = this.results = [];
		let repeating = this.repeating;
		let funcs = [];

		this.tests.forEach( (v, i) => funcs.push( 'funcs[' + i + '] = function fn' + i + '(){' + v + '}' ) );

		funcs.map( (f, i) => {
			errors.push(false);
			results.push(false);

			try { return eval( f ); }
			catch (e) {
				errors[i] = true;
				console.error(e);
				return function(){};
			}
		});

		if ( errors.filter(v=>!v).length > 0 ) {
			funcs.forEach((fn, i) => {
				errors[i] = false;
				try { results[i] = singleDuration(fn, repeating); }
				catch(e) {
					errors[i] = true;
					console.error(e);
				}
			});
		}

		this.inProcess = false;

		function singleDuration( fn, dur ) {
			let s = Date.now();
			for (let i = 0; i < dur; i++) { fn(); }
			return Date.now() - s;
		}
	}
}
</script>

<style>
#Testing .test-panel {
	position:relative;
	margin-bottom:20px
}
#Testing .test-panel.error textarea {
	background-color:#933;
}
#Testing .test-panel button {
	top:0;
	right:0;
	position:absolute;
}
#Testing .test-panel code,
#Testing .test-panel textarea {
	margin:0;
	font-size:1.1em;
	font-family:Consolas, monospace;
}
</style>