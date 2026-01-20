'use strict';

var MIThreeObject = function (value ) {
    this.value = value;
}

MIThreeObject.prototype = { constructor: MIThreeObject };

MIThreeObject.prototype.getValue = function() {
    return this.value;
}

MIThreeObject.prototype.setValue = function(value, params) {
    
    this.value = value;
    
    this.dispatchEvent({type: 'setValue'});

    if(params===undefined || params.recursive===undefined || params.recursive==true) {
	this.dispatchEvent({type:'updated'});
    }

}

THREE.EventDispatcher.prototype.apply( MIThreeObject.prototype );



var MIThreeVector3 = function ( x, y, z) {
    THREE.Vector3.call( this, x, y, z);
}

MIThreeVector3.prototype = Object.create( THREE.Vector3.prototype );


MIThreeVector3.prototype.getValue = function() {
    return this.clone();
}

MIThreeVector3.prototype.setValue = function(value, params) {

    if ( value instanceof THREE.Vector3 ) {
	this.copy(value);
    }
    else if (value instanceof Array && value.length == 3) {
	this.set(value[0],value[1],value[2]);
    }
    
    this.dispatchEvent({type: 'setValue'});

    if(params===undefined || params.recursive===undefined || params.recursive==true) {
	this.dispatchEvent({type:'updated'});
    }

}

THREE.EventDispatcher.prototype.apply( MIThreeVector3.prototype );



var MIThreeVector2 = function ( x, y) {
    THREE.Vector2.call( this, x, y);
}

MIThreeVector2.prototype = Object.create( THREE.Vector2.prototype );

MIThreeVector2.prototype.getValue = function() {
    return this.clone();
}

MIThreeVector2.prototype.setValue = function(value, params) {

    if ( value instanceof THREE.Vector2 ) {
	this.copy(value);
    }
    else if (value instanceof Array && value.length == 2) {
	this.set(value[0],value[1]);
    }
    
    this.dispatchEvent({type: 'setValue'});

    if(params===undefined || params.recursive===undefined || params.recursive==true) {
	this.dispatchEvent({type:'updated'});
    }

}

THREE.EventDispatcher.prototype.apply( MIThreeVector2.prototype );



var MIThreeArray = function (array ) {
    this.array = array;
}

MIThreeArray.prototype = { constructor: MIThreeArray };

MIThreeArray.prototype.getValue = function() {
    return this.array.slice(0);
}

MIThreeArray.prototype.setValue = function(value, params) {
    
    if (value instanceof Array && value.length == this.array.length) {
	for(var i=0; i < value.length; i++ ) {
	    this.array[i] = value[i];
	}
    }
    
    this.dispatchEvent({type: 'setValue'});

    if(params===undefined || params.recursive===undefined || params.recursive==true) {
	this.dispatchEvent({type:'updated'});
    }

}

THREE.EventDispatcher.prototype.apply( MIThreeArray.prototype );



