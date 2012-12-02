var d = document;
var cg = {};
var c = $('#c')[0];
var ctx = c.getContext('2d');
var scene = new RB.Scene(c);
var w = c.width;
var h = c.height;
var fontFamily = "Arial, helvetica";
var pop = new Audio('pop.ogg');
var currentObj = null;

scene.add( scene.rect(w, h, 'white') );
scene.update();

var lib = $('#lib');

var miniUrls = ["sm01_mini.png", "sm02_mini.png", "sm03_mini.png", "sushi_mini.png", "z01_mini.png", "z02_mini.png", "z03_mini.png", "z04_mini.png", "balao.png", "toon01_mini.png", "toon02_mini.png", "toon03_mini.png", "toon04_mini.png", "toon05_mini.png", "toon06_mini.png"];
var toonUrls = ["sm01.png", "sm02.png", "sm03.png", "sushi.png", "z01.png", "z02.png", "z03.png", "z04.png", "balao.png", "toon01.png", "toon02.png", "toon03.png", "toon04.png", "toon05.png", "toon06.png"];

cg.clearScreen = function(){
	ctx = c.getContext('2d');
	scene = new RB.Scene(c);
	w = c.width;
	h = c.height;
	fontFamily = "Arial, helvetica";
	pop = new Audio('pop.ogg');
	currentObj = null;

	scene.add( scene.rect(w, h, 'white') );
	scene.update();
}

$(d).keyup(function(e){

	var key = e.keyCode || e.which;

	if(key == 46 && currentObj){
		scene.remove(currentObj);
		scene.update();
		RB.destroyCanvas( currentObj.getCanvas().id );
		currentObj = null;
	}
	
	if( currentObj && (key==37 || key==39) ){
		cg.hFlip(currentObj);
	}
});

$(d).keydown(function(event){
	
	var key = event.keyCode || event.which;

	if(key == 38 && currentObj){
		cg.zoomIn(currentObj);
	}
	
	if(key == 40 && currentObj){
		cg.zoomOut(currentObj);
	}
});

d.onmousewheel = function(mw){
	if(currentObj && mw.wheelDelta > 0){
		cg.zoomIn(currentObj);
	} else if (currentObj && mw.wheelDelta < 0){
		cg.zoomOut(currentObj);
	}
};

cg.buildMinis = function(){
	var buffer = '';
	var imgString = "<img src='toons/IMG_URL' class='rc mini'></img>";
	var link = "<a href=\"javascript:cg.createImage('toons/IMG_URL')\">";
	
	for(var i=0; i < miniUrls.length; i++){
		buffer += link.replace(/IMG_URL/, toonUrls[i]);
		buffer += imgString.replace(/IMG_URL/, miniUrls[i]) + '</a>';
	}
	
	lib.append(buffer);
	
	//lib.append( $('#textTool').clone() );
	$('#menuContainer').append( $('#instructs').clone() );
}

cg.buildMinis();

cg.createImage = function(url){
	scene.image(url, function(obj){
		obj.draggable = true;
		obj.setXY(30, 30);
		
		obj.onmousedown = function(e){
			currentObj = obj;
			scene.zIndex(obj, 1);
			scene.update();
		}
		
		scene.add(obj);
		currentObj = obj;
		scene.update();
		pop.play();
	});
}

cg.createText = function(){
	var txt = prompt("Adicione um texto:");
	
	if(txt){
		var obj = scene.text(txt, fontFamily, 20, 'black');
		obj.setXY(40, 40);
		obj.draggable = true;
		
		obj.onmousedown = function(e){
			currentObj = obj;
			scene.zIndex(obj, 1);
			scene.update();
		}
		currentObj = obj;
		
		scene.add(obj);
		scene.update();
		pop.play();
	}
}

cg.createTextFromInput = function(e){

	var key = e.keyCode || e.which;
	var txt = $('#newText').val();
	
	if(key == 13){
		var obj = scene.text(txt, fontFamily, 20, 'black');
		obj.setXY(40, 40);
		obj.draggable = true;
		
		obj.onmousedown = function(e){
			currentObj = obj;
			scene.zIndex(obj, 1);
			scene.update();
		}
		currentObj = obj;
		
		scene.add(obj);
		scene.update();
		$('#newText').val('');
		pop.play();
	}
}

cg.saveImage = function(){
	var data = c.toDataURL('png');
	var win = window.open();
	var b = win.document.body;
	var img = new Image();
	img.src = data;
	b.appendChild(img);
}

cg.zoomOut = function(obj){
	var w = obj.w * 0.05;
	var h = obj.h * 0.05;

	if(obj.w - w > 0 && obj.h - h > 0){
		obj.w -= w;
		obj.h -= h;
		
		obj.x += (w/2);
		obj.y += (h/2);
		
		scene.update();
	}
}

cg.zoomIn = function(obj){
	var w = obj.w * 0.05;
	var h = obj.h * 0.05;
	
	obj.w += w;
	obj.h += h;
	
	obj.x -= (w/2);
	obj.y -= (h/2);
	
	scene.update();
}

cg.hFlip = function(obj){
	var tmpCanvas = $(obj.getCanvas()).clone()[0];
	var img = obj.getCanvas();
	var tmpCtx = tmpCanvas.getContext('2d');
	var w = tmpCanvas.width;
	var h = tmpCanvas.height;
	
	//save current size and position
	var cW = obj.w, cH = obj.h, cX = obj.x, cY = obj.y;
	
	tmpCtx.translate(w/2, h/2);
	tmpCtx.scale(-1, 1);
	tmpCtx.drawImage(img, (-1*w/2), (-1*h/2));
	tmpCanvas.id = obj.getCanvas().id;
	obj.getCanvas().id = 'killme';
	
	RB.destroyCanvas('killme');
	d.body.appendChild(tmpCanvas);
	obj.setCanvas(tmpCanvas);
	obj.x=cX; obj.y=cY; obj.h=cH; obj.w=cW;	
	scene.update();
}

cg.setScreen = function(w, h){
	if(w && h && !isNaN(w) && !isNaN(h)){
		//var ok = confirm('All your work will be lost. Continue?');
		ok=true;
		if(ok){
			c.width = w;
			c.height = h;
			scene.update();
			//cg.clearScreen();
		}
	}
}
