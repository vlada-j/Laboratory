(function() {
'use strict';

const vueCollapse = {
	regs: {},
	add: function(inst, name) {
		if(name === undefined || name === '') { return; }

		this.regs[name] = this.regs[name] || [];
		this.regs[name].indexOf(inst) === -1 ? this.regs[name].push(inst) : 0;
	},
	remove: function(inst, name) {
		if(name === undefined || name === '') { return; }

		if(this.regs[name] instanceof Array) {
			let i = this.regs[name].indexOf(inst);
			i > -1 ? this.regs[name].splice(i, 1) : 0;
		}
	},
	closeAll: function(name) {
		if(this.regs[name] instanceof Array) {
			this.regs[name].forEach(function(inst){ inst.close(); });
		}
	}
};

function getCssPropertyName(name, element) {
	let property = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
		style = (element || document.body || document.documentElement).style,
		properties = ['', 'Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'].map( prefix => prefix + property );

	properties.unshift(name);

	while (property = properties.shift()) {
		if (typeof style[property] !== 'undefined') { return property; }
	}
	return false;
}

let tdn = getCssPropertyName('transitionDuration');

function getDuration(ele) {
	let val = getComputedStyle(ele)[tdn];
	val = val.replace('ms', '').indexOf('s') > 0 ? parseFloat(val.replace('s', '')) * 1000 : parseFloat(val);
	return isNaN(val) ? 0 : val;
}

Vue.component('vue-collapse', {
	template: '<article class="vue-collapse" v-bind:class="{ close: !isActive }"><header @click="toggle" class="vue-collapse-header"><slot name="header"></slot></header>'
		+'<section ref="panel_content" class="vue-collapse-content"><slot></slot></section></article>',
	data: function() {
		return { isActive: false }
	},
	methods: {
		toggle: function() {
			this.isActive ? this.close() : this.open();
		},
		open: function() {
			vueCollapse.closeAll(this.group);
			let ele = this.$refs.panel_content;
			this.isActive = true;
			ele.style.height = ele.scrollHeight + 'px';

			let duration = getDuration(ele);
			if (duration) { setTimeout(()=>{ ele.style.height = null }, duration); }
		},
		close: function() {
			this.isActive = false;
			this.$refs.panel_content.style.height = this.$refs.panel_content.scrollHeight + 'px';
		}
	},
	props: ['group'],
	created: function () {
		vueCollapse.add(this, this.group);
	},
	destroyed: function() {
		vueCollapse.remove(this, this.group);
	}
});

})();