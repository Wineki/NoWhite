function dEgg(){
	this.dEgg = {
		canvas: {
			el: canvas_el,
			w: canvas_el.offsetWidth,
			h: canvas_el.offsetHeight
		},
		space: {
			w: canvas_el.offsetWidth,
			h: 20,
			num: 5
		},
		eggshell:{
			number: {
				sum:40,
				random: true,
				perline:10
			},
			shape: {
				type: 'circle',
				stroke: {
					width: 0,
					color: '#ff0000'
				},
				polygon: {
					ng_sides: 5
				},
				image: {
					src: 'http://pic.58pic.com/58pic/15/30/52/29s58PIC2gf_1024.jpg',
					width:100,
					height:100
				}
			},
			size: {
				value: 20,
				random: false,
				anim: {
					enable: false,
					speed: 20,
					size_min: 0,
					sync: false
				}
			},
			move: {
				speed:3,
				direction: 'none'
			}
		},
		retina_detect: false
	};
	var dEgg = this.dEgg;
	/*-----------------canvas init ------------------------*/
	dEgg.fn.canvasInit = function(){
		dEgg.canvas.ctx = dEgg.canvas.el.getContext('2d');
	}
	dEgg.fn.canvasSize = function(){
		dEgg.canvas.el.width = dEgg.canvas.w;
		dEgg.canvas.el.height = dEgg.canvas.h;
	}
	
	
	/*----------------eggShell init ----------------------*/
	dEgg.fn.eggShell = function(position){
		/*size*/
		this.radius = (dEgg.eggshell.size.random ? Math.random() : 1) * dEgg.eggshell.size.value;
		
		/*shape*/
		if(dEgg.eggShell.size.anim.enable){
			this.vs = dEgg.eggShell.size.anim.speed;
			if(!dEgg.eggShell.size.anim.sync){
				this.vs = this.vs * Math.random();
			}
		}
		var img = new Image();
		
		/*position*/
		this.x = position ? position.x : Math.random() * dEgg.space.w;
		this.h = position ? position.y : Math.random() * dEgg.space.h;
		
	};
	dEgg.fn.eggShell.prototype.draw = function(){
		var p = this;
		switch(p.shape){
			case 'image':
			function drow(){
				dEgg.canvas.ctx.drawImage(
					
				);
			}
		};
	}

};
/*----------------canvas start -----------------------*/
window.dropEggshell = function(tag_id){
	var dEgg_tag = document.getElementById(tag_id),
		dEgg_canvas_class = 'dEgg_canvas_el';
		
		
	var canvas_el = document.createElement('canvas');
		canvas_el.style.width = '100%';
		canvas_el.style.height = '100%';
		
	var canvas = document.getElementById(tag_id).appendChild(canvas_el);
};
dropEggshell("test");

