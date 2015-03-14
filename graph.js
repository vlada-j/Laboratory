/* *********** *
 * EXTEND MATH *
 * *********** */
window._ = Object.create(Math);
window._.PI2 = window._.PI * 2;
window._.rnd = function(n, m) {
	var min = this.min(n, m||0),
		max = this.max(n, m||1);
	return min + this.random() * (max-min);
};
window._.rndI = function(n, m) { return this.floor( this.rnd(n, m) ); };
window._.rad2deg = function(r) { return ( 180/this.PI )*r; };
window._.deg2rad = function(d) { return ( this.PI/180 )*d; };
window._.ang = function(x1, y1, x2, y2) { return this.atan2((y1 - y2), (x1 - x2)); };
window._.dist = function(x1, y1, x2, y2) {
	var x = this.abs(x1 - x2),
		y = this.abs(y1 - y2);
	return this.sqrt( (x*x) + (y*y) );
};



/* *********************** *
 * REQUEST ANIMATION FRAME *
 * *********************** */
window.requestAnimFrame=(function(){
	return window.requestAnimationFrame		||
		window.webkitRequestAnimationFrame	||
		window.mozRequestAnimationFrame		||
		window.oRequestAnimationFrame		||
		window.msRequestAnimationFrame		||
		function(callback){window.setTimeout(callback, 1000/60);};
})();



/* ******************** *
 * GRAPHIC ENGINE CLASS *
 * ******************** */
function GraphicEngine(opt) {
	this._can		=null;
	this._ctx		=null;
	this._width		=0;
	this._height	=0;
	this._offset	={x:0, y:0};
	this._zoom		=1;
	this._objects	=[];
	this._isRun		=false;
	this._fade		=true;
	this._onUpdate	=function(){};

	this.graphics = new this.graphics(this);
	this.controls = new this.controls(this);
	this.graphics._self = this;
	this.controls._self = this;

	this.init(opt);
}
GraphicEngine.prototype.constructor = GraphicEngine;

//--------------------------------------------------------------------------------------------------
GraphicEngine.prototype.init=function(opt) {
		opt = opt || {};
		this._can = typeof opt.canvas === 'string' ? document.querySelector(opt.canvas) : opt.canvas;
		this._can = this._can instanceof HTMLCanvasElement ? this._can : document.createElement('canvas');
		this._ctx = this._can.getContext('2d');
		this._can.width = opt.width || this._can.width;
		this._can.height= opt.height || this._can.height;

		this._width		= this._can.width;
		this._height	= this._can.height;
		this._offset.x	= this._width/2;
		this._offset.y	= this._height/2;
		this._zoom		= opt.zoom || 1;
		this._isRun		=false;
		this._fade		=opt.fade || false;
		this.clear();
		var self = this;
		document.addEventListener('keydown', function(e){ if(self.isVisible()) { self.controls.onKeyDown(e); } });
	}


//--------------------------------------------------------------------------------------------------
GraphicEngine.prototype.getObjectsList=function() { return this._objects; }
GraphicEngine.prototype.setObjectsList=function(objects) { this._objects = objects; }


//--------------------------------------------------------------------------------------------------
GraphicEngine.prototype.onUpdate=function( fn ) {
		var old = this._onUpdate;
		this._onUpdate = function() { old(); if(typeof fn === 'function') { fn(); } };
	}


//--------------------------------------------------------------------------------------------------
GraphicEngine.prototype.resize=function(w, h) {
		this._can.width = this._width = w;
		this._can.height = this._height = h;
	}


//--------------------------------------------------------------------------------------------------
GraphicEngine.prototype.isVisible=function() { return this._can.clientWidth !== 0 && this._can.clientHeight !== 0; }


//--------------------------------------------------------------------------------------------------
GraphicEngine.prototype.clear=function() {
		this._ctx.setTransform(1,0,0,1,0,0);
		if(this._fade) {
			this._ctx.fillStyle = 'rgba(0,0,0,.1)';
			this._ctx.beginPath();
			this._ctx.fillRect(0, 0, this._width, this._height);
			this._ctx.closePath();
			this._ctx.fill();
		} else { this._ctx.clearRect(0, 0, this._width, this._height); }
		this._ctx.translate(this._offset.x, this._offset.y);
		this._ctx.scale(this._zoom, this._zoom);
	}


//--------------------------------------------------------------------------------------------------
GraphicEngine.prototype.draw=function() {
		var self = this;
		self.clear();
		self._objects.forEach(
			function(obj) {
				if(isNaN(obj.x) || isNaN(obj.y)) {return;}

				switch (obj.t) {
					case 0: self.graphics.circle(obj); break;
					case 1: self.graphics.rect(obj); break;
				}
			}
		);
	}


//--------------------------------------------------------------------------------------------------
GraphicEngine.prototype.start=function() {
		if(!this._isRun) {
			this._isRun = true;
			this.animate();
		}
	}


//--------------------------------------------------------------------------------------------------
GraphicEngine.prototype.animate =function() {
		var self = this;
		window.requestAnimFrame(function(){self.animate();});
		if(!this._isRun) { return; }
		this.draw();
		this._onUpdate();
	}


// Graphic objects
//--------------------------------------------------------------------------------------------------
GraphicEngine.prototype.graphics = function(s){this._self = s};
GraphicEngine.prototype.graphics.prototype._self=null;
	//--------------------------------------------------------------------------------------------------
	GraphicEngine.prototype.graphics.prototype.circle=function(p) {
			this._self._ctx.fillStyle = p.c;
			this._self._ctx.beginPath();
			this._self._ctx.arc(p.x, p.y, p.r, 0, 2*_.PI, true);
			this._self._ctx.closePath();
			this._self._ctx.fill();
		}

	//--------------------------------------------------------------------------------------------------
	GraphicEngine.prototype.graphics.prototype.rect=function(p) {
			this._self._ctx.fillStyle = p.c;
			this._self._ctx.beginPath();
			this._self._ctx.fillRect(p.x - p.r/2, p.y - p.r/2, p.r, p.r);
			this._self._ctx.closePath();
			this._self._ctx.fill();
		}


// Controls
//--------------------------------------------------------------------------------------------------
GraphicEngine.prototype.controls = function(s){this._self = s};
GraphicEngine.prototype.controls.prototype._self=null;
	GraphicEngine.prototype.controls.prototype.refresh=function() { if(!this._self._isRun) { this._self.clear(); this._self.draw(); } },

	GraphicEngine.prototype.controls.prototype.pause=function(b) {
			if(typeof b === 'boolean') { this._self._isRun = b; }
			else { this._self._isRun = !this._self._isRun; }
		}

	GraphicEngine.prototype.controls.prototype.zoomIn=function() { this._self._zoom = this._self._zoom<3 ? this._self._zoom+.1 : 3; this.refresh(); }

	GraphicEngine.prototype.controls.prototype.zoomOut=function() { this._self._zoom = this._self._zoom>=.2 ? this._self._zoom-.1 : .1; this.refresh(); }

	GraphicEngine.prototype.controls.prototype.moveUp=function() { this._self._offset.y += 50; this.refresh(); }

	GraphicEngine.prototype.controls.prototype.moveDown=function() { this._self._offset.y -= 50; this.refresh(); }

	GraphicEngine.prototype.controls.prototype.moveLeft=function() { this._self._offset.x += 50; this.refresh(); }

	GraphicEngine.prototype.controls.prototype.moveRight=function() { this._self._offset.x -= 50; this.refresh(); }

	GraphicEngine.prototype.controls.prototype.onKeyDown=function(e) {
		switch(e.keyCode) {
			case 27: this.pause();		break; // ESC
			case 88: this.zoomIn();		break;//x zoomIn();
			case 90: this.zoomOut();	break;//z zoomOut();
			case 37: this.moveLeft();	break;//left
			case 38: this.moveUp();		break;//up
			case 39: this.moveRight();	break;//right
			case 40: this.moveDown();	break;//down
		}
	}
