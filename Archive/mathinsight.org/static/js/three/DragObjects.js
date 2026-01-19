// keeps track of objects that can be dragged with the mouse
// or that can occlude other objects from being dragged with mouse

// DragObjects.objects is array of draggable objects or occluding objects
// if object.draggable=true, then object is draggable otherwise it occludes
// if object.constrain_to_parent=true, then object can only be moved to 
// points on its parent

// can have two cameras so that can includes an orthographic overlay scene
// assumption is that the orthographic camera is pointing from z direction
// and that objects in orthographic overlay scene are in front of 
// regular perspective scene

/*
* Parameters: can be null
* camera2: second camera object for orthographic overlay scenes--doesn't have to be an orthographic camera though?
* controls: instance of THREE.trackballControls?
* linePrecision
* parentLinePrecision
*
*
*/
'use strict';

// global variable drag so can refer to drag in all listener functions


var DragObjects = function (renderer, camera, parameters) {

    var drag = this;
    
    THREE.Object3D.call( this );

    this.renderer = renderer;
    this.container = this.renderer.domElement.parentNode;
    this.camera = camera;
    if(this.camera instanceof THREE.OrthographicCamera) {
	this.cameraIsOrtho = true;
    }
    else {
	this.cameraIsOrtho = false;
    }

    if ( parameters === undefined ) parameters = {};

    this.camera2 = parameters.hasOwnProperty("camera2") ? 
	parameters["camera2"] : null;
    if(this.camera2) {
	if(this.camera2 instanceof THREE.OrthographicCamera) {
	    this.camera2IsOrtho = true;
	}
	else {
	    this.camera2IsOrtho = false;
	}
    }

    this.controls = parameters.hasOwnProperty("controls") ? 
	parameters["controls"] : null;

    // top camera is camera used to check intersections first
    // default is to make topCamera be orthoGraphic camera, if exists,
    this.topCamera = parameters.hasOwnProperty("topCamera") ? 
	parameters["topCamera"] : null;
    if(this.topCamera === null) {
	this.topCamera=1;
	if(this.camera2IsOrtho && !this.cameraIsOrtho) {
	    this.topCamera = 2;
	}
    }
    
    this.linePrecision = parameters.hasOwnProperty("linePrecision") ? 
	parameters["linePrecision"] : null;
    this.parentLinePrecision = parameters.hasOwnProperty("parentLinePrecision") ? 
	parameters["parentLinePrecision"] : null;

    
    this.objects=[];
    this.objects2=[];
    
    this.plane = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000, 8, 8 ), 
				 new THREE.MeshBasicMaterial( { opacity: 0.25, 
								transparent: true, wireframe: true } ) );
    this.plane.visible = false;

    this.add( this.plane );

    this.SELECTED=null;
    this.INTERSECTED=null;
    this.POTENTIALHIGHLIGHT=null;
    this.cameraUsed=null;
    this.mouse = new THREE.Vector2();
    this.offset = new THREE.Vector3();
    this.projector = new THREE.Projector();
    this.vector = new THREE.Vector3();
    this.vector2 = new THREE.Vector3();
    this.orthoCameraUsed = false;
    
    this.parent_info = null;

    this.mouseMoveWrapper = function(event) {
	return drag.onContainerMouseMove(event);
    }
    this.mouseDownWrapper = function(event) {
	return drag.onContainerMouseDown(event);
    }
    this.mouseUpWrapper = function(event) {
	return drag.onContainerMouseUp(event);
    }
    this.mouseOutWrapper = function(event) {
	return drag.onContainerMouseOut(event);
    }
    this.outsideMouseUpWrapper = function(event) {
	return drag.outsideContainerMouseUp(event);
    }
    this.returnWrapper = function(event) {
	return drag.returnContainer(event);
    }

    // Register a bunch of event listeners for mouse actions.
    renderer.domElement.addEventListener( 'mousemove', this.mouseMoveWrapper, false );
    renderer.domElement.addEventListener( 'mousedown', this.mouseDownWrapper, false );
    renderer.domElement.addEventListener( 'mouseup', this.mouseUpWrapper, false );
    renderer.domElement.addEventListener( 'mouseout', this.mouseOutWrapper, false );


}

DragObjects.prototype = Object.create( THREE.Object3D.prototype );


DragObjects.prototype.onContainerMouseMove = function( event ) {

    event.preventDefault();
    
    this.mouse.x = (cursorPositionInCanvas( this.renderer.domElement, event )[0]) / $(this.renderer.domElement).width() * 2 - 1;
    this.mouse.y = - (cursorPositionInCanvas( this.renderer.domElement, event )[1])/ $(this.renderer.domElement).height() * 2 + 1;
    

    this.vector.set( this.mouse.x, this.mouse.y, 0.5 );
    // Now get a ray going from the camera into the scene; below we'll check if this
    // ray intersects with anything in dragobjects[], which is an array of points.
    var raycaster;
    if(this.cameraIsOrtho) {
	// for orthographic camera, using picking Ray
	raycaster = this.projector.pickingRay(this.vector, this.camera);
    }
    else {
	this.projector.unprojectVector( this.vector, this.camera );
	raycaster = new THREE.Raycaster( this.camera.position, this.vector.sub( this.camera.position ).normalize() );
    }
    
    if(this.linePrecision !== null) {
	raycaster.linePrecision=this.linePrecision;
    }



    // if have second camera, repeat
    var raycaster2;
    if(this.camera2) {
	this.vector2.set( this.mouse.x, this.mouse.y, 0.5 );
	if(this.camera2IsOrtho) {
	    // for orthographic camera, using picking Ray
	    raycaster2 = this.projector.pickingRay(this.vector2, this.camera2);
	}
	else {
	    this.projector.unprojectVector( this.vector2, this.camera2 );
	    raycaster2 = new THREE.Raycaster( this.camera2.position, this.vector2.sub( this.camera2.position ).normalize() );
	}
	if(this.linePrecision !== null) {
	    raycaster2.linePrecision=this.linePrecision;
	}
    }


    if ( this.SELECTED) {
	
	var theparent = this.SELECTED.parent;
	
	// determine which raycaster used to obtain SELECTED
	var raycasterUsed, cameraUsed;
	if(this.cameraUsed===2) {
	    raycasterUsed = raycaster2;
	    this.orthoCameraUsed = this.camera2IsOrtho;
	    cameraUsed = this.camera2;
	}
	else {
	    raycasterUsed = raycaster;
	    this.orthoCameraUsed = this.cameraIsOrtho;
	    cameraUsed = this.camera;
	}

	// if SELECTED is constrained to parent
	// move SELECTED to closest intersection of Ray with parent
	// or don't move SELECTED if no intersection.
	// Modify Ray to go through center of SELECTED 
	// rather than mouse pointer.  
	// In this way, SELECTED will have the same relationship
	// to mouse pointer as it is moved along its parent

	if(this.SELECTED.constrain_to_parent) {
	    // want imprecision for dragging objects along lines
	    if(this.parentLinePrecision !== null) {
		raycasterUsed.linePrecision=this.parentLinePrecision;
	    }
	    else {
		raycasterUsed.linePrecision=10; 
	    }

	    if(this.orthoCameraUsed) {
		this.vector.copy(raycasterUsed.ray.origin).sub(this.offset);
		raycasterUsed.set(this.vector, raycasterUsed.ray.direction);

	    }
	    else {

		// To modify ray to go through the point where the center
		// of SELECTED will be, intersect ray through drag plane,
		// adjust by offset calculated on mouse down
		// then modify ray to go through this offset point
		var intersects = raycasterUsed.intersectObject(this.plane);
		this.vector.copy(intersects[ 0 ].point).sub(this.offset);
		this.vector.sub( this.camera.position ).normalize()
		raycasterUsed.set( this.camera.position, this.vector);

	    }
	    // now intersect parent with this new ray
	    var intersects=raycasterUsed.intersectObject(theparent);;

	    if (intersects.length > 0) {
		// need to adjust from world coordinates
		// to the coordinates local to the parent
		// this adjusts for rotations and translations
		// of parent and its parents
		this.SELECTED.position.copy( theparent.worldToLocal(intersects[ 0 ].point));
		// record information about location of parent 
		// on which SELECTED is now positioned
		this.parent_info = intersects[0];

		this.SELECTED.dispatchEvent( { type: 'moved' } );
	    }
	    
	    // if no intersection with parent, then don't move SELECTED
	    // and leave this.parent_info at previous state

	}
	else {
	    
	    // for unconstrained object using orthographic camera
	    // position at mouse point
	    // offset is vector from location at which grabbed object
	    // to the central position of the object
	    if(this.orthoCameraUsed) {
		this.vector.set( this.mouse.x, this.mouse.y, 0.5 );
		this.projector.unprojectVector( this.vector, cameraUsed );
		this.vector.sub(this.offset);
		// adjust for possible transformations of parent
		if(theparent) {
		    theparent.worldToLocal(this.vector);
		}
		this.vector.z = this.SELECTED.position.z;
		this.SELECTED.position.copy(this.vector);
		
	    }
	    else {

		// if selected is not constrained to parent
		// move along the invisible this.plane
		// offset is vector from central position of the object
		// to location where original ray intersected drag plane
		var intersects = raycasterUsed.intersectObject(this.plane);
		this.SELECTED.position.copy(intersects[ 0 ].point.sub(this.offset));
		
		// adjust for any transformations of parent
		if(theparent) {
		    theparent.worldToLocal(this.SELECTED.position);
		}
	    }

	    this.SELECTED.dispatchEvent( { type: 'moved' } );
	}
	
	return;
	
    }

    // if nothing selected then first try intersection with topCamera.
    // if second camera exist, use that next
    var intersects=null;
    if(this.topCamera===2) {
	intersects = raycaster2.intersectObjects( this.objects2 );
	if(intersects.length > 0){
	    this.cameraUsed=2;
	}
	else {
	    intersects = raycaster.intersectObjects( this.objects );
	    this.cameraUsed=1;
	}
    }
    else {
	intersects = raycaster.intersectObjects( this.objects );
	if(intersects.length > 0){
	    this.cameraUsed=1;
	}
	else if (raycaster2) {
	    intersects = raycaster2.intersectObjects( this.objects2 );
	    this.cameraUsed=2;
	}
    }

    if(this.cameraUsed === 2) {
	this.orthoCameraUsed = this.camera2IsOrtho;
    }
    else {
	this.orthoCameraUsed = this.cameraIsOrtho;
    }
    

    if ( intersects.length > 0  && (intersects[ 0 ].object.draggable ||
				    intersects[ 0 ].object.highlightOnHover ||
				    intersects[ 0 ].object.highlightOnClick)) {

	
	if ( this.INTERSECTED != intersects[ 0 ].object ) {

	    // if previously had a different INTERSECTED
	    // restore appearance of former INTERSECTED
	    if ( this.INTERSECTED && !this.INTERSECTED.highlightOnClick) {
		highlightObject(this.INTERSECTED, false);
	    }

	    // set INTERSECTED to new object
	    this.INTERSECTED = intersects[ 0 ].object;
	    
	    if(this.INTERSECTED.draggable || this.INTERSECTED.highlightOnHover) {
		highlightObject(this.INTERSECTED);
	    }

	    if(this.INTERSECTED.draggable) {
		// set drag plane to go through INTERSECTED and
		// be parallel to camera
		// (might not be parallel to camera if position (0,0,0) is not 
		//  in center of screen)
		this.plane.position.set(0,0,0);
		var theCamera;
		if(this.cameraUsed===2) {
		    theCamera=this.camera2;
		}
		else {
		    theCamera=this.camera;
		}
		this.plane.lookAt( theCamera.position );
		
		// if this.INTERSECTED has parent, need to adjust position
		// for possible rotations and translations of parent
		this.vector.copy(this.INTERSECTED.position);
		if(this.INTERSECTED.parent) {
		    this.plane.position.copy(this.INTERSECTED.parent.localToWorld(this.vector));
		}
		else {
		    this.plane.position.copy(this.vector);
		}
	    }	    
	}
	if(this.INTERSECTED.draggable || this.INTERSECTED.highlightOnClick) {
	    this.container.style.cursor = 'pointer';
	}
	else {
	    this.container.style.cursor = 'auto';
	}
    }	  
    
    else {
	
	
	// if previously had a INTERSECTED object
	// restore appearance of former INTERSECTED
	if ( this.INTERSECTED && !this.INTERSECTED.highlightOnClick) {
	    highlightObject(this.INTERSECTED, false);
	}	

	this.INTERSECTED = null;
	
	this.container.style.cursor = 'auto';
	
    }
    
}

DragObjects.prototype.onContainerMouseDown = function( event ) {

    event.preventDefault();
    
    // Transform the mouse's 2D screen coordinates to a vector in our 
    // 3D space.  Setting z = 0.5 before unprojecting seems to be a standard kludge
    // with unknown source; even mrdoob says he's not sure about it:
    // http://stackoverflow.com/questions/11036106/three-js-projector-and-ray-objects 

    this.vector.set( this.mouse.x, this.mouse.y, 0.5 );
    // Now get a ray going from the camera into the scene; below we'll check if this
    // ray intersects with anything in dragobjects[], which is an array of points.
    var raycaster;
    if(this.cameraIsOrtho) {
	// for orthographic camera, using picking Ray
	raycaster = this.projector.pickingRay(this.vector, this.camera);
    }
    else {
	this.projector.unprojectVector( this.vector, this.camera );
	raycaster = new THREE.Raycaster( this.camera.position, this.vector.sub( this.camera.position ).normalize() );
    }
    
    if(this.linePrecision !== null) {
	raycaster.linePrecision=this.linePrecision;
    }

    // if have second camera, repeat
    var raycaster2;
    if(this.camera2) {
	this.vector2.set( this.mouse.x, this.mouse.y, 0.5 );
	if(this.camera2IsOrtho) {
	    // for orthographic camera, using picking Ray
	    raycaster2 = this.projector.pickingRay(this.vector2, this.camera2);
	}
	else {
	    this.projector.unprojectVector( this.vector2, this.camera2 );
	    raycaster2 = new THREE.Raycaster( this.camera2.position, this.vector2.sub( this.camera2.position ).normalize() );
	}
	if(this.linePrecision !== null) {
	    raycaster2.linePrecision=this.linePrecision;
	}
    }


    // first try intersection with topCamera.
    // if second camera exist, use that next
    var intersects=null;
    var raycasterUsed;
    if(this.topCamera===2) {
	intersects = raycaster2.intersectObjects( this.objects2 );
	if(intersects.length > 0){
	    this.cameraUsed=2;
	    raycasterUsed = raycaster2;
	}
	else {
	    intersects = raycaster.intersectObjects( this.objects );
	    this.cameraUsed=1;
	    raycasterUsed = raycaster;
	}
    }
    else {
	intersects = raycaster.intersectObjects( this.objects );
	if(intersects.length > 0){
	    this.cameraUsed=1;
	    raycasterUsed = raycaster;
	}
	else if (raycaster2) {
	    intersects = raycaster2.intersectObjects( this.objects2 );
	    this.cameraUsed=2;
	    raycasterUsed = raycaster2;
	}

    }

    if(this.cameraUsed === 2) {
	this.orthoCameraUsed = this.camera2IsOrtho;
    }
    else {
	this.orthoCameraUsed = this.cameraIsOrtho;
    }


    if ( intersects.length > 0) {

	// if have draggable object, then select the object
	// and mark offsets for new positions after mouse move
	if(intersects[0].object.draggable) {
	    
	    if(this.controls) {
		this.controls.enabled = false;
	    }

	    this.SELECTED = intersects[ 0 ].object;
	    
	    if(this.orthoCameraUsed) {
		// for orthographic camera, offset is vector from
		// actual position of object to intersection point
		this.offset.copy(intersects[0].point);
		this.vector.copy(this.SELECTED.position);

		// adjust for any transformations of parent
		if(this.SELECTED.parent) {
		    this.SELECTED.parent.localToWorld(this.vector);
		}
		this.offset.sub(this.vector);

		// for orthographic camera, ignore z direction
		this.offset.z=0;
	    }
	    else {

		// Record offset as difference between point where ray intersects 
		// the drag plane and the actual position of object.
		// Offset is used to adjust position of objects 
		// so that have same position relative to mouse pointer.
		// Particularly important for spatially extended objects.
		
		var intersectsPlane = raycasterUsed.intersectObject( this.plane );
		
		this.offset.copy(intersectsPlane[0].point);
		this.vector.copy(this.SELECTED.position);
		
		// adjust for any transformations of parent
		if(this.SELECTED.parent) {
		    this.SELECTED.parent.localToWorld(this.vector);
		}
		this.offset.sub(this.vector);

	    }
	    this.container.style.cursor = 'move';
	}

	// if highlight on click, then mark as an object 
	// to potentially highlight if still intersect object
	// on mouse up
	else if (intersects[0].object.highlightOnClick) {
	    this.POTENTIALHIGHLIGHT = intersects[0].object;
	}
    }
    
}

DragObjects.prototype.onContainerMouseUp = function( event ) {
    
    event.preventDefault();
    if(this.controls) {
	this.controls.enabled = true;
    }
    
    if ( this.INTERSECTED ) {
	
	if(!this.orthoCameraUsed) {
	    this.vector.copy(this.INTERSECTED.position);
	    if(this.INTERSECTED.parent) {
		this.INTERSECTED.parent.localToWorld(this.vector);
	    }
	    this.plane.position.copy( this.vector );
	}

	if(this.SELECTED) {
	    this.SELECTED.dispatchEvent({type: 'moveFinished'});
	}

	this.SELECTED = null;
	this.parent_info = null;

	if(this.INTERSECTED.draggable || this.INTERSECTED.highlightOnClick) {
		this.container.style.cursor = 'pointer';
	}
	else {
	    this.container.style.cursor = 'auto';
	}

    }
    else {
	this.container.style.cursor = 'auto';
    }
    
    // if click on an object that was flagged as highlightOnClick
    // check if mouse is still over that object,
    // in which case toggle the highlight
    if(this.POTENTIALHIGHLIGHT) {
	if( this.POTENTIALHIGHLIGHT === this.INTERSECTED) {
	    toggleHighlightObject(this.POTENTIALHIGHLIGHT);
	}
	this.POTENTIALHIGHLIGHT = null;
    }

}


DragObjects.prototype.onContainerMouseOut = function( event ) {
    
    event.preventDefault();

    // If have selected element and leave container
    // add listener to stop moving selected if have 
    // mouse up outsider container
    if(this.SELECTED) {
	document.addEventListener( 'mouseup', this.outsideMouseUpWrapper, false );
 
	// add listener to remove extra mouse up listener
	// upon returning to container
	this.renderer.domElement.addEventListener( 'mouseover', this.returnWrapper, false);
	
    }
}


DragObjects.prototype.outsideContainerMouseUp = function( event ) {

    event.preventDefault();

    // if have mouse up outside container
    // deselected selected object
    if(this.SELECTED) {
	this.SELECTED.dispatchEvent({type: 'moveFinished'});
    }
    this.SELECTED = null;
    this.parent_info = null;

    this.container.style.cursor = 'auto';

    // remove extra listeners
    document.removeEventListener( 'mouseup', this.outsideMouseUpWrapper, false );
    this.renderer.domElement.removeEventListener( 'mouseover', this.returnWrapper, false);

}

DragObjects.prototype.returnContainer = function( event ) {

    // if return to container without a mouse up
    // remove extra listeners
    document.removeEventListener( 'mouseup', this.outsideMouseUpWrapper, false );
 
    this.renderer.domElement.removeEventListener( 'mouseover', this.returnWrapper, false);
    
}


function toggleHighlightObject(object) {
    if(object.highlighted) {
	highlightObject(object,false);
    }
    else {
	highlightObject(object);
    }
}

// highlight object, or turn off highlight if activate is false
function highlightObject(object, activate) {
    
    if(activate || activate===undefined) {

	// if object has a highlight function, 
	// call that to turn on hightighting
	if (object.highlight) {
	    object.highlight();
	}
	// else change color of object or object it represents
	else {
	    // save color of object or object it represents
	    if(object.represents) {
		object.currentHex = object.represents.material.color.getHex();
	    }
	    else {
		object.currentHex = object.material.color.getHex();
	    }

	    // reduce each color by 1.5 to show intersected
	    var oldHex = object.currentHex;
	    var newHex = Math.ceil((oldHex % 256)/1.5);
	    oldHex -= oldHex % 256;
	    newHex += Math.ceil((oldHex % (256*256))/(1.5*256))*256;
	    oldHex -= oldHex % (256*256);
	    newHex += Math.ceil((oldHex % (256*256*256))/(1.5*256*256))*256*256;
	    // change color of object or object it represents
	    if(object.represents) {
		object.represents.material.color.setHex(newHex);
	    }
	    else {
		object.material.color.setHex(newHex);
	    }
	}	    
	// mark object as highlighted
	object.highlighted=true;
    }
    // turn off highlighting is activate is false
    else {
	// if object has a highlight function, 
	// call that to turn off highlighting
	if(object.highlight) {
	    object.highlight(false);
	}
	// else if object represents another object
	// restore color to that object
	else if(object.represents) {
	    object.represents.material.color.setHex( object.currentHex );
	}
	// else restore color to object
	else {
	    object.material.color.setHex( object.currentHex );
	}

	// mark object as not highlighted
	object.highlighted=false;
    }
}


// Called on event when mouse moves over canvas--returns absolute world coordinates of the mouse?
function cursorPositionInCanvas(canvas, event) {
    var x, y;
    
    var canoffset = $(canvas).offset();
    x = event.clientX + $(document).scrollLeft() - Math.floor(canoffset.left);
    y = event.clientY + $(document).scrollTop() - Math.floor(canoffset.top) + 1;
    
    return [x,y];
}

