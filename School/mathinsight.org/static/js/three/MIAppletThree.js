'use strict';

var MIAppletThree = function(container_id, width, height, parameters) {

    var _this = this;
    if ( parameters === undefined )  {
	this.parameters = {};
    }
    else {
	this.parameters = parameters
    }

    this.container = $('#' + container_id);
    this.width_original=width;
    this.height_original=height;
    this.width=Math.min(this.width_original, this.container.width());
    this.height = this.height_original;
    if(this.width < this.width_original) {
	this.height *= this.width/this.width_original;
    }


    this.namedObjects={};

    this.render_settings = this.parameters.hasOwnProperty("render_settings") ? 
	this.parameters["render_settings"] : {antialias:true, alpha:true } ;

    this.allow_screenshots = this.parameters.hasOwnProperty("allow_screenshots") ? 
	this.parameters["allow_screenshots"] : false ;
    
    // needed to allow screenshots, but gives a performance hit
    if (this.allow_screenshots) {
	this.render_settings.preserveDrawingBuffer = true 
    }

    this.renderer = new THREE.WebGLRenderer( this.render_settings );

    var renderer=this.renderer
    
    if(this.allow_screenshots) {

	// from jsfiddle by Dinesh Saravanan
	// http://jsfiddle.net/TxcTr/3/
	// http://stackoverflow.com/questions/15558418/how-do-you-save-an-image-from-a-three-js-canvas#15563621
	window.addEventListener("keyup", function(e){
	    var imgData, imgNode;
	    //Listen to 'P' key
	    if(e.which !== 80) return;  
	    try {
		imgData = renderer.domElement.toDataURL();      
		console.log(imgData);
	    } 
	    catch(e) {
		console.log("Browser does not support taking screenshot of 3d context");
		return;
	    }
	    imgNode = document.createElement("img");
	    imgNode.src = imgData;
	    document.body.appendChild(imgNode);
	});
    }


    // listener for window resize
    window.addEventListener( 'resize', onWindowResize, false );

    function onWindowResize() {
	_this.width=Math.min(_this.width_original, _this.container.width());
	_this.height = _this.height_original;
	if(_this.width < _this.width_original) {
	    _this.height *= _this.width/_this.width_original;
	}
	
	renderer.setSize(_this.width, _this.height);
    }
    

}
    

MIAppletThree.prototype.getValue = function(name) {
    
    var object = this.namedObjects.hasOwnProperty(name) ? 
	this.namedObjects[name] : null;
    if(object===null) {
	return null;
    }
    // return value if getValue method exists
    return object.getValue && object.getValue();
}

MIAppletThree.prototype.getObject = function(name) {
	
    return this.namedObjects.hasOwnProperty(name) ? 
	this.namedObjects[name] : null;
}
    
MIAppletThree.prototype.setValue = function(name, value) {
	
    var object = this.namedObjects.hasOwnProperty(name) ? 
	this.namedObjects[name] : null;
    if(object===null) {
	return null;
    }
    // return value if getValue method exists
    return object.setValue && object.setValue(value, {recursive:false});
}
    
MIAppletThree.prototype.setPosition = function(name, pos) {
    var object = this.namedObjects.hasOwnProperty(name) ? 
	this.namedObjects[name] : null;
    if(object===null) {
	return null;
    }
    // return value if getValue method exists
    return object.setPosition && object.setPosition(pos, {recursive:false});
}
    
MIAppletThree.prototype.registerObjectUpdateListener = function(name, listener) {
    var object = this.namedObjects.hasOwnProperty(name) ? 
	this.namedObjects[name] : null;
    if(object===null) {
	return null;
    }
    object.addEventListener('updated', listener);
}		      
