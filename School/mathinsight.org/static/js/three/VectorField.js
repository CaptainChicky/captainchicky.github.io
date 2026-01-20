// create a vector field of arrows

// code is unfinished, as it needs to determine correct normalization
// for length of vectors so that they look reasonable without overlapping
// Will need some way to adjust this length as well, in case particular
// use needs a different normalization

'use strict';

var VectorField = function ( F, params) {

    if (params === undefined){var params = {};}
    
    if (params.minx  === undefined) {params.minx = -1;}
    if (params.maxx  === undefined) {params.maxx = 1;}
    if (params.dx  === undefined) {params.dx = 1;}
    if (params.miny  === undefined) {params.miny = -1;}
    if (params.maxy  === undefined) {params.maxy = 1;}
    if (params.dy  === undefined) {params.dy = 1;}
    if (params.minz  === undefined) {params.minz = -1;}
    if (params.maxz  === undefined) {params.maxz = 1;}
    if (params.dz  === undefined) {params.dz = 1;}
    if (params.lambertMaterial === undefined) {params.lambertMaterial=false;}
    if (params.color === undefined) {params.color=0x999999;}
    if (params.headWidth === undefined) {params.headWidth = 0.2}
    if (params.sphereRadius === undefined) {params.sphereRadius = params.headWidth/2}
    
    THREE.Object3D.call( this );
    
    var miniSphereGeometry = new THREE.SphereGeometry( params.sphereRadius );
    if(params.lambertMaterial) {
	var miniSphereMaterial = new THREE.MeshLambertMaterial( { color: params.color, ambient: params.color } );
    }
    else {
	var miniSphereMaterial = new THREE.MeshBasicMaterial( { color: params.color } );
    }
    var miniSphere = new THREE.Mesh( miniSphereGeometry, miniSphereMaterial);
	
    if (params.maxFMag == null) {//Allows manual setting of vector magnitude
	params.maxFMag = Math.min(params.dx, params.dy, params.dz);
    }

    var rawMaxFMag = 0;
    for (var x = params.minx; x <= params.maxx; x += params.dx) {
        for (var y = params.miny; y <= params.maxy; y += params.dy) {
            for (var z = params.minz; z <= params.maxz; z += params.dz) {
                var Fvec = F(x, y, z);
		if(Fvec) {
                    var Fmag = Math.sqrt(Fvec.x * Fvec.x + Fvec.y * Fvec.y + Fvec.z * Fvec.z);
                    rawMaxFMag = Math.max(Fmag, rawMaxFMag);
		}
            }
        }
    }
    var headLength = params.headLength;
    for(var x=params.minx; x<=params.maxx; x+=params.dx) {
	for(var y=params.miny; y<=params.maxy; y+=params.dy) {
	    for(var z=params.minz; z<=params.maxz; z+=params.dz) {
		var Fvec = F(x,y,z);
		if(Fvec) {
		    var Fmag = Math.sqrt(Fvec.x*Fvec.x+Fvec.y*Fvec.y+Fvec.z*Fvec.z);
		    var Fdir = Fvec.clone();
		    if(Fmag > 0) Fdir.normalize();
		}
		else {
		    var Fmag=null;
		    var Fdir=null;
		}
		var Forigin = new THREE.Vector3(x,y,z);
		var Fcolor = params.color;
		if(Fmag > 0) {
		    if (params.headLength === undefined) {
			headLength = 0.99*Fmag/rawMaxFMag;
		    }

		    var arrowProps = {
			dir: Fdir,
			origin: Forigin,
			length: Fmag/rawMaxFMag*params.maxFMag,
			color: Fcolor,
			headLength: Math.min(0.4, headLength),
			headWidth: params.headWidth,
			lineWidth: 3,			
			lambertMaterial:params.lambertMaterial,
		    }
		    this.add(new Arrow(arrowProps));
		}
		else if (Fmag==0) {
		    var object = miniSphere.clone();
		    object.position.copy(Forigin);
		    this.add(object);

		}	
	    }
	}
    }
};

VectorField.prototype = Object.create( THREE.Object3D.prototype );


