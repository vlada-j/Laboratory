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
	var r=ar(sel);
	r.children=function(s) {var rr=[]; this.forEach(function(ele){rr=rr.concat( ar( findChildren(ele, s) ) );});return rr;}
	r.click=function(fn) {this.forEach( function(ele){ ele.addEventListener('click', fn); });return this;};
	r.show=function() {this.forEach( function(ele){ ele.style.display='block'; });return this;};
	r.hide=function() {this.forEach( function(ele){ ele.style.display='none'; });return this;};
	r.html=function(html) {this.forEach( function(ele){ ele.innerHTML=html; });return this;};
	r.addClass=function(cls) {this.forEach( function(ele){ ele.classList.add(cls); });return this;};
	r.removeClass=function(cls) {this.forEach( function(ele){ ele.classList.remove(cls); });return this;};
	r.hasClass=function(c) {var cl=this[0].classList,l=cl.length;for(var i=0;i<l;i++){if(cl[i]===c){return true;}}return false;};
	return r;}
$.extend=function(a,b){for(var k in b){ if(b.hasOwnProperty(k)){a[k]=b[k];} } return a;};

// Pages system
(function(){
	var pages=[], nav=null;
	function self(id, fl, fo, fc) {
		if(typeof id==='string'&&id!=='') {
			id=id.charAt(0)==='#'?id.slice(1):id;
			for(var i=0;i<pages.length;i++){if(pages[i].id===id) { return pages[i]; }}
			var p=doc.querySelector('#'+id+'.page');
			if(p){return makePage(p, fl, fo, fc);}}
		return {open:function(){}, close:function(){}};}
	function makePage(e, fl, fo, fc) {
		var p={id:e.id,page:$(e),
			open:function(){if(!this.page.hasClass('open')){this.page.addClass('open');this.onOpen.call(this);}},
			close:function(){if(this.page.hasClass('open')){this.page.removeClass('open');this.onClose.call(this);}},
			onLoad:fl||function(){},
			onOpen:fo||function(){},
			onClose:fc||function(){}};
		pages.push(p);
		return p;}
	function makeLink(p){nav.innerHTML+='<a href="#'+p.id+'" class="btn">'+(p.title||p.id)+'</a>';}
	self.init=function(){
		nav=$('#Nav')[0];
		$('.page').forEach(function(e){self(e.id);makeLink(e);});
		pages.forEach(function(p){p.onLoad.call(p);});};
	self.open=function(id){pages.forEach(function(p){p.close();});self(id).open();};
	window.Pages=self;
})();

// Boost
win.onload=function(){
	var b=$('body');
	win.onfocus=function(){setTimeout(function(){b.addClass('inf');},500);};
	win.onblur=function(){b.removeClass('inf');};
	win.onhashchange=function(){Pages.open(location.hash);window.scrollTo(0,0)}
	win.onhashchange();
	win.onfocus();
	Accordion.init();
	Pages.init();
};

// Components


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
