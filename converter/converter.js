window.TextConverter = (function(){
	'use strict';

	var cir = 'Ђ Џ Џ Љ Њ Е Р Т З У И О П Ш Ђ А С Д Ф Г Х Ј К Л Ч Ћ Ж Ц В Б Н М';
	var lat = 'Dj Dz Dž Lj Nj E R T Z U I O P Š Đ A S D F G H J K L Č Ć Ž C V B N M';
	var c2l = {}, l2c = {};

	l2c['LJ'] = 'Љ';
	l2c['NJ'] = 'Њ';
	l2c['DŽ'] = 'Џ';
	l2c['DZ'] = 'Џ';
	l2c['DJ'] = 'Đ';

	cir = cir.split(' ').concat( cir.toLowerCase().split(' ') );
	lat = lat.split(' ').concat( lat.toLowerCase().split(' ') );

	cir.forEach(function(ch, i){ c2l[ch] = lat[i]; l2c[lat[i]] = ch; });

	function convert2Cir(text) {
		for(var k in l2c) {
			if(l2c.hasOwnProperty(k)) {
				text = text.replace(new RegExp(k, 'g' ), l2c[k]);
			}
		}
		return text;
	}

	function convert2Lat(text) {
		for(var k in c2l) {
			if(c2l.hasOwnProperty(k)) {
				text = text.replace(new RegExp(k, 'g' ), c2l[k]);
			}
		}
		return text;
	}
	return {
		toCir:convert2Cir,
		toLat:convert2Lat
	};
})();

//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------

window.TextCleaner = (function() {
	'use strict';

	return {
		enters: enters,
		spaces: spaces,
		trim:   trim,
		all:    all
	};

	function replacer(t, re, ch) {
		t = t.replace(re, ch);
		return t.match(re) ? replacer(t, re, ch) : t;
	}

	function enters(text) { return replacer(text, /\n\n/g, '\n'); }

	function spaces(text) { return replacer(text, /  /g, ' '); }

	function trim(text) {
		text = text.replace(/^\s+/, '').replace(/\s*$/g, '');
		text = replacer(text, / \n|\n /g,	'\n');
		text = replacer(text, / ,/g,		',');
		text = replacer(text, / \./g,		'.');
		text = replacer(text, / :/g,		':');
		text = replacer(text, / ;/g,		';');
		return text;
	}

	function all(text) {
		return enters( trim( spaces(text) ) );
	}
})();