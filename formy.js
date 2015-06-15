/* ***************** *
 * FORM HELPER CLASS *
 * ***************** */
function Formy(form) {
	this._form = form;
	this._eles = form.elements;
	this._reset = form.reset;
	this._submit = form.submit;
}

Formy.prototype = {

	//--------------------------------------------------------------------------------------------------
	init: function() { },

	//--------------------------------------------------------------------------------------------------
	getAllKeyNames: function() {
		var els = this._eles,
			len = els.length,
			r = [],
			i;

		for (i = 0; i < len; i++) {
			if (els[i].name && r.indexOf(els[i].name) === -1 && els[i].tagName !== 'FIELDSET') {
				r.push(els[i].name);
			}
		}
		return r;
	},

	//--------------------------------------------------------------------------------------------------
	getValueFromSingle: function(e) {
		var r, t = '', self = this;

		t = e.type==='checkbox' ? 'CH' : t;
		t = e.type==='file' ? 'F' : t;
		t = e.type==='select-multiple' ? 'M' : t;

		switch(e.tagName + t) {
			case 'INPUTCH':
				r = e.checked;
				break;
			case 'INPUTF':
				r = e.files;
				break;
			case 'SELECTM':
				r = self.getValueFromGroup(e.selectedOptions);
				break;
			case 'INPUT':
			case 'SELECT':
			case 'TEXTAREA':
				r = e.value;
				break;
		}

		return r;
	},

	//--------------------------------------------------------------------------------------------------
	getValueFromGroup: function(e) {
		if(e.value) { return e.value; }

		var r = [], i;
		for (i=0; i < e.length; i++) {
			if (e[i].type !== 'checkbox' && e[i].type !== 'radio') {
				r.push(e[i].value);
			} else if (e[i].checked) {
				r.push(e[i].value);
			}
		}
		return r;
	},

	//--------------------------------------------------------------------------------------------------
	getValue: function(e) {
		return e.tagName ? this.getValueFromSingle(e) : this.getValueFromGroup(e);
	},

	//--------------------------------------------------------------------------------------------------
	value: function() {
		var self = this,
			r = {},
			es = this.getAllKeyNames();
			es.forEach(function(n){ r[n] = self.getValue(self._form[n]); });
		return r;
	},

	//--------------------------------------------------------------------------------------------------
	json: function() {
		return JSON.stringify(this.value());
	}
};

Formy.prototype.constructor = Formy;
