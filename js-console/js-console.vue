<template>
	<section class="content">
		<textarea v-model="code" @keyup.enter="run()" class="w100 code-style" rows="15"></textarea>
		<p class="text-center">
			<input type="reset" @click="clearLog()" class="go-left" value="Clear log">
			<input type="submit" @click="run()" value="RUN">
			<button @click="sendLog()" v-if="!sending" class="go-right">Send log</button>
			<button v-if="sending" class="go-right" disabled>Sending...</button>
		</p>
		<code v-html="logs.join('\<br\>')">javascript logs ...</code>
	</section>
</template>

<script>
exports = {
	code: 'log( navigator.userAgent );\nlog( navigator.appVersion );',
	logs: [],
	sending: false,
	run: function() { this.logs = execut( this.code ); },
	clearLog: function() { this.logs = []; },
	sendLog: function() {
		this.sending = true;
		let log = encodeURIComponent( this.logs.join('\n') );

		fetch('js_log.php?log=' + log)
			.then(()=>this.sending = false)
			.catch(()=>this.sending = false);
	}
};

function execut(code) {
	let logs = [];
	let _log = window.log;

	window.log = log;
	try { window['eval']('(function(log){\'use strict\';' + code + '})(window.log)'); }
	catch(e) { log('ERROR:', e); }
	window.log = _log;

	return logs;

	function log() {
		console.log( join(arguments, ' ') );
		logs.push( join(arguments, ' ') );
	}

	function join(arg, separator) { return Array.prototype.join.call(arg, separator); }
}
</script>