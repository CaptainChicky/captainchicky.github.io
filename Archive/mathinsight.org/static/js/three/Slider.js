// Slider to change or view value of a variable
// Slider can have one or more points attached to it
// For each draggable point, add dependent objects that will receive
// an update event when the value of the point is changed 

// dragobjects must be an on objects (or objectsOrtho) child of DragObjects


// todo:
// determine system for giving reasonable defaults for size parameters such as
// point size, font size, point label offset, scale of slider label
// Probably based on distance of camera and view angle
// Right now, they might give ridiculous sizes 

'use strict';

var Slider = function ( parameters) {

    if ( parameters === undefined ) parameters = {};

    this.dragobjects = parameters.hasOwnProperty("dragobjects") ? 
	parameters["dragobjects"] : null;
    this.color = parameters.hasOwnProperty("color") ? 
	parameters["color"] : 0x000000;
    this.length = parameters.hasOwnProperty("length") ? 
	parameters["length"] : 1;
    this.minval = parameters.hasOwnProperty("minval") ? 
	parameters["minval"] : -1;
    this.maxval = parameters.hasOwnProperty("maxval") ? 
	parameters["maxval"] : 1;

    // set actual slider geometry to be twice as long as visible slider
    // to make it easier to move slider point to min/max values
    var sliderGeometry = new THREE.Geometry();
    sliderGeometry.vertices.push( new THREE.Vector3(-this.length,0,0) );
    sliderGeometry.vertices.push( new THREE.Vector3(this.length,0,0) );
    
    var sliderMaterial = new THREE.LineBasicMaterial({ color: this.color});
    sliderMaterial.linewidth = 5;
 
    THREE.Line.call(this, sliderGeometry, sliderMaterial) ;
    this.visible = false;

    // now make actual visible slider with proper length
    sliderGeometry = new THREE.Geometry();
    sliderGeometry.vertices.push( new THREE.Vector3(-this.length/2,0,0) );
    sliderGeometry.vertices.push( new THREE.Vector3(this.length/2,0,0) );

    this.add(new THREE.Line(sliderGeometry, sliderMaterial));
    
    this.addPoint(parameters);
    
}

Slider.prototype = Object.create( THREE.Line.prototype );

// return value of point with index pointNumber
Slider.prototype.getValue = function (pointNumber) {
    pointNumber = pointNumber || 0;
    return this.minval + (this.children[pointNumber+1].position.x/this.length+0.5)
	*(this.maxval-this.minval);
}

// return value of point given the actual point
Slider.prototype._val_of_child = function (child) {
    return this.minval + (child.position.x/this.length+0.5)
	*(this.maxval-this.minval);
}

// set value of point with index pointNumber
// if recursive, then send out an updated event that will be
// picked up by any additional listeners
Slider.prototype.setValue = function ( value, parameters ) {
    if ( parameters === undefined ) parameters = {};

    // probably find better default point size
    var pointNumber = parameters.hasOwnProperty("pointNumber") ? 
	parameters["pointNumber"] : 0;
    var recursive = parameters.hasOwnProperty("recursive") ? 
	parameters["recursive"] : true;
    
    this.children[pointNumber+1].position.x = ((value - this.minval)/(this.maxval-this.minval) -0.5)*this.length;
    this.children[pointNumber+1].updateLabel();
    this.children[pointNumber=1].dispatchEvent({type: 'moved', recursive: recursive});

    return value;

}

// add dependent object that will receive an update event
// when point indexed by pointNumber is changed
Slider.prototype.addDependent = function ( dependent, pointNumber ) {
    pointNumber = pointNumber || 0;
    this.children[pointNumber+1].dependent_objects.push(dependent);
}


// add a point to the slider that can be either draggable
// or simply display a value
Slider.prototype.addPoint = function (parameters) {
    if ( parameters === undefined ) parameters = {};

    // probably find better default point size
    var pointSize = parameters.hasOwnProperty("pointSize") ? 
	parameters["pointSize"] : this.length/15;
    var pointColor = parameters.hasOwnProperty("pointColor") ? 
	parameters["pointColor"] : this.color;
    var pointDraggable = parameters.hasOwnProperty("pointDraggable") ? 
	parameters["pointDraggable"] : true;
    var pointName = parameters.hasOwnProperty("pointName") ? 
	parameters["pointName"] : "";
    var pointLabeled = parameters.hasOwnProperty("pointLabeled") ? 
	parameters["pointLabeled"] : true;
    var pointLabelOffset = parameters.hasOwnProperty("pointLabelOffset") ? 
	parameters["pointLabelOffset"] : new THREE.Vector3(0, 0, 1);
    var pointLabelFontFace = parameters.hasOwnProperty("pointLabelFontFace") ? 
	parameters["pointLabelFontFace"] : "Arial";
    var pointLabelFontSize = parameters.hasOwnProperty("pointLabelFontSize") ? 
	parameters["pointLabelFontSize"] : 60;
    var pointRoundDigits = parameters.hasOwnProperty("pointRoundDigits") ? 
	parameters["pointRoundDigits"] : 2;
    var roundFactor = Math.pow(10,pointRoundDigits); 
    var pointLineGeometry = parameters.hasOwnProperty("pointLineGeometry") ? 
	parameters["pointLineGeometry"] : new THREE.Vector3(0,0,pointSize);
   

    var sliderPoint;
    if(pointDraggable) {
	var pointGeometry = new THREE.SphereGeometry( pointSize );
	sliderPoint = new THREE.Mesh( pointGeometry, new THREE.MeshBasicMaterial( { color: pointColor } ) );
    }
    else {
	var pointGeometry = new THREE.Geometry();
	pointGeometry.vertices.push( pointLineGeometry );
	pointGeometry.vertices.push( pointLineGeometry.clone().multiplyScalar(-1) );
	var pointMaterial = new THREE.LineBasicMaterial({ color: pointColor});
	pointMaterial.linewidth = 5;
	sliderPoint =new THREE.Line(pointGeometry, pointMaterial);


    }
    this.add(sliderPoint);

    sliderPoint.updateLabel = function () {};

    if (pointLabeled) {
	var message = "";
	if(pointName) {
	    message = pointName + " = ";
	}
	var thisval = this._val_of_child(sliderPoint);
	message += Math.round(thisval*roundFactor)/roundFactor;

	sliderPoint.label = new TextLabel(message, { fontSize: pointLabelFontSize, fontFace: pointLabelFontFace, scale: 4} );

	sliderPoint.add(sliderPoint.label);
	sliderPoint.label.position.copy(pointLabelOffset);


	sliderPoint.updateLabel = function () {
	    

	    var message = "";
	    if(pointName) {
		message = pointName + " = ";
	    }
	    var thisval = this.parent._val_of_child(sliderPoint);
	    message += Math.round(thisval*roundFactor)/roundFactor;

	    sliderPoint.label.set(message);

	}

	sliderPoint.updateLabel();
	
    }

    if (pointDraggable) {
	sliderPoint.dependent_objects = [];
	sliderPoint.draggable=true;
	sliderPoint.constrain_to_parent=true;
	if(this.dragobjects) {
	    this.dragobjects.push(sliderPoint);
	}
	var length=this.length;
	sliderPoint.addEventListener('moved', function(event) {
	    // since slider longer than visible slider
	    // move to point to endpoint if off visible slider
	    if(sliderPoint.position.x > length/2) {
		sliderPoint.position.x = length/2;
	    }
	    if(sliderPoint.position.x < -length/2) {
		sliderPoint.position.x = -length/2;
	    }
	    sliderPoint.updateLabel();

	    // signal change to any dependent objects
	    var dependents = this.dependent_objects;
	    for ( var i = 0, l = dependents.length; i < l; i ++ ) {
		dependents[i].dispatchEvent( { type: 'refresh' } );
	    
	    }
	    // signal change to any additional listeners of the slider
	    // only if recursive is set or undefined
	    if(event.recursive===undefined || event.recursive) {
		sliderPoint.parent.dispatchEvent( { type: 'updated' } );
	    }
	});
    }

}
