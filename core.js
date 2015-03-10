var doc=document, win=window, body=doc.getElementsByTagName('body');

// DOM manipulator
function $(sel) {
	sel=(typeof sel==='string') ? sel=doc.querySelectorAll(sel) : sel;
	function ar(n) {
		var r=[], i=0, l=n.length||0;
		for(i=0;i<l;i++) { r.push(n[i]); }
		return r;}
	function findChildren(n,s) {
		if(typeof s==='string') {
			if(s.charAt(0)==='.') {return n.getElementsByClassName( s.slice(1).replace('.', ' ') );}
			else {return n.getElementsByTagName(s);}
		} else {return n.children;}
	}
	if(sel instanceof Node) {sel=[sel];}
	r=ar(sel);
	r.children=function(s) {var rr=[]; this.forEach(function(ele){rr=rr.concat( ar( findChildren(ele, s) ) );});return rr;}
	r.click=function(fn) {this.forEach( function(ele){ ele.addEventListener('click', fn); });return this;};
	r.show=function() {this.forEach( function(ele){ ele.style.display='block'; });return this;};
	r.hide=function() {this.forEach( function(ele){ ele.style.display='none'; });return this;};
	r.html=function(html) {this.forEach( function(ele){ ele.innerHTML=html; });return this;};
	r.addClass=function(cls) {this.forEach( function(ele){ ele.classList.add(cls); });return this;};
	r.removeClass=function(cls) {this.forEach( function(ele){ ele.classList.remove(cls); });return this;};
	return r;}
$.extend=function(a,b){for(var k in b){ if(b.hasOwnProperty(k)){a[k]=b[k];} } return a;};

// Pages system
(function(){
	var self={}, pages=[], nav=null;
	function makeNavigation(sel){nav=$(sel)[0];$('.page').forEach(makeLink);}
	function makeLink(e){nav.innerHTML+='<a href="#'+ e.id+'" class="btn">'+ e.id+'</a>';}
	self.reg=function(fn){pages.indexOf(fn)===-1?pages.push(fn):0;};
	self.inits=function(sel){makeNavigation(sel);pages.forEach(function(p){p.init instanceof Function?p.init():0;});};
	self.hideAll=function(){$('.page').removeClass('open');};
	self.open=function(id){self.hideAll(); if(typeof id==='string'&&id!==''){$(id).addClass('open');}};
	self.make=function(id){var p={};p.ID=id;self.reg(p); return p;};
	window.Pages=self;
})();

// Accordion
function Accordion(sel){
	var cont=$(sel),
		panels=$(cont.children()),
		headers=$(panels.children('.ac-header')),
		contents=$(panels.children('.ac-content'));
	function hAll(){
		panels.removeClass('open');
		contents.forEach(function(e){e.style.height=null;});}

	function open(pa){
		var co=pa.children('.ac-content')[0];
		hAll();
		pa.addClass('open');
		co.style.height=co.scrollHeight+'px';}
	this.hideAll=hAll;
	this.open=open;

	headers.click(function(){ open($(this.parentElement)); });
	$('body').click(function(e){cont[0].contains(e.target)?0:hAll();});}

Accordion.instances=[];
Accordion.init=function(sel){
	$(sel||'.accordion').forEach(function(ele){ Accordion.instances.push(new Accordion(ele)); });
};

// Boost
win.onload=function(){
	var b=$('body');
	win.onfocus=function(){setTimeout(function(){b.addClass('inf');},500);};
	win.onblur=function(){b.removeClass('inf');};
	win.onhashchange=function(){Pages.open(location.hash);window.scrollTo(0,0)}
	win.onhashchange();
	win.onfocus();
	Accordion.init();
	Pages.inits('#Nav');
};
