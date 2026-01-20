
/**
 * @author WestLangley / https://github.com/WestLangley
 * @author zz85 / https://github.com/zz85
 * @author miningold / https://github.com/miningold
 *
 * Modified from the TorusKnotGeometry by @oosmoxiecode
 *
 * Creates a tube which extrudes along a 3d spline
 *
 * Uses parallel transport frames as described in
 * http://www.cs.indiana.edu/pub/techreports/TR425.pdf

 Modified to allow variable radius -- pass in a function for radius


*/

TubeGeometryVariable = function( path, segments, radius, radialSegments, closed, openEnded ) {

    THREE.Geometry.call( this );

    this.path = path;
    this.segments = segments || 64;
    this.radius = radius || function (t) { return 1;} ;
    this.radialSegments = radialSegments || 8;
    this.closed = closed || false;
    this.openEnded = openEnded = openEnded !== undefined ? openEnded : false;

    this.grid = [];

    var scope = this,

    tangent,
    normal,
    binormal,

    numpoints = this.segments + 1,

    x, y, z,
    tx, ty, tz,
    u, v,

    cx, cy,
    pos, pos2 = new THREE.Vector3(),
    i, j,
    ip, jp,
    a, b, c, d,
    uva, uvb, uvc, uvd;

    var frames = new THREE.TubeGeometry.FrenetFrames( this.path, this.segments, this.closed ),
    tangents = frames.tangents,
    normals = frames.normals,
    binormals = frames.binormals;

    // proxy internals
    this.tangents = tangents;
    this.normals = normals;
    this.binormals = binormals;

    function vert( x, y, z ) {

	return scope.vertices.push( new THREE.Vector3( x, y, z ) ) - 1;

    }


    // consruct the grid

    for ( i = 0; i < numpoints; i++ ) {

	this.grid[ i ] = [];

	u = i / ( numpoints - 1 );

	pos = path.getPointAt( u );

	tangent = tangents[ i ];
	normal = normals[ i ];
	binormal = binormals[ i ];

	for ( j = 0; j < this.radialSegments; j++ ) {

	    v = j / this.radialSegments * 2 * Math.PI;

	    cx = -this.radius(u) * Math.cos( v ); // TODO: Hack: Negating it so it faces outside.
	    cy = this.radius(u) * Math.sin( v );

	    pos2.copy( pos );
	    pos2.x += cx * normal.x + cy * binormal.x;
	    pos2.y += cx * normal.y + cy * binormal.y;
	    pos2.z += cx * normal.z + cy * binormal.z;

	    this.grid[ i ][ j ] = vert( pos2.x, pos2.y, pos2.z );

	}
    }


    // construct the mesh

    var uvsBegin=[];
    var uvsEnd=[];

    for ( i = 0; i < this.segments; i++ ) {

	for ( j = 0; j < this.radialSegments; j++ ) {

	    ip = ( this.closed ) ? (i + 1) % this.segments : i + 1;
	    jp = (j + 1) % this.radialSegments;

	    a = this.grid[ i ][ j ];		// *** NOT NECESSARILY PLANAR ! ***
	    b = this.grid[ ip ][ j ];
	    c = this.grid[ ip ][ jp ];
	    d = this.grid[ i ][ jp ];

	    uva = new THREE.Vector2( i / this.segments, j / this.radialSegments );
	    uvb = new THREE.Vector2( ( i + 1 ) / this.segments, j / this.radialSegments );
	    uvc = new THREE.Vector2( ( i + 1 ) / this.segments, ( j + 1 ) / this.radialSegments );
	    uvd = new THREE.Vector2( i / this.segments, ( j + 1 ) / this.radialSegments );

	    this.faces.push( new THREE.Face3( a, b, d ) );
	    this.faceVertexUvs[ 0 ].push( [ uva, uvb, uvd ] );

	    this.faces.push( new THREE.Face3( b, c, d ) );
	    this.faceVertexUvs[ 0 ].push( [ uvb.clone(), uvc, uvd.clone() ] );

	    if(i==0) {
		uvsBegin.push(uva);
	    }
	    else if(i==this.segments-1) {
		uvsEnd.push(uva);
	    }

	}
    }

    // top cap
    if ( openEnded === false && radius(0) > 0 ) {

	// find midpoint of endpoint
	var midpoint = new THREE.Vector3();

	for ( j = 0; j < this.radialSegments; j++ ) {
	    midpoint.add(this.vertices[this.grid[0][j]]);
	}
	midpoint.divideScalar(this.radialSegments);

	this.vertices.push(midpoint);

	for ( j = 0; j < this.radialSegments; j++ ) {

	    jp = (j + 1) % this.radialSegments;

	    var v1 = this.grid[0][j];
	    var v2 = this.grid[0][jp];
	    var v3 = this.vertices.length - 1;

	    var uv1 = uvsBegin[ j ].clone();
	    var uv2 = uvsBegin[ jp ].clone();
	    var uv3 = new THREE.Vector2( uv2.x, 0 );

	    this.faces.push( new THREE.Face3( v1, v2, v3) );
	    this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3 ] );
	    
	}

    }

    // bottom cap
    if ( openEnded === false && radius(1) > 0 ) {

	// find midpoint of endpoint
	var midpoint = new THREE.Vector3();

	for ( j = 0; j < this.radialSegments; j++ ) {
	    midpoint.add(this.vertices[this.grid[numpoints-1][j]]);
	}
	midpoint.divideScalar(this.radialSegments);

	this.vertices.push(midpoint);

	for ( j = 0; j < this.radialSegments; j++ ) {

	    jp = (j + 1) % this.radialSegments;

	    var v1 = this.grid[numpoints-1][jp];
	    var v2 = this.grid[numpoints-1][j];
	    var v3 = this.vertices.length - 1;

	    var uv1 = uvsEnd[ jp ].clone();
	    var uv2 = uvsEnd[ j ].clone();
	    var uv3 = new THREE.Vector2( uv2.x, 0 );

	    this.faces.push( new THREE.Face3( v1, v2, v3) );
	    this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3 ] );
	    
	}

    }


    this.computeCentroids();
    this.computeFaceNormals();
    this.computeVertexNormals();

};

TubeGeometryVariable.prototype = Object.create( THREE.Geometry.prototype );



/**
 * @author hughes
 
 modified to allow hole in middle

*/

CircleGeometry = function ( radius, segments, thetaStart, thetaLength, innerRadius ) {

    THREE.Geometry.call( this );

    this.radius = radius = radius || 50;
    this.segments = segments = segments !== undefined ? Math.max( 3, segments ) : 8;

    this.thetaStart = thetaStart = thetaStart !== undefined ? thetaStart : 0;
    this.thetaLength = thetaLength = thetaLength !== undefined ? thetaLength : Math.PI * 2;
    this.innerRadius = innerRadius = innerRadius || 0;

    var i, uvs = []
    
    if(innerRadius==0) {
	center = new THREE.Vector3(), centerUV = new THREE.Vector2( 0.5, 0.5 );

	this.vertices.push(center);
	uvs.push( centerUV );
    }

    for ( i = 0; i <= segments; i ++ ) {

	var vertex = new THREE.Vector3();
	var segment = thetaStart + i / segments * thetaLength;

	vertex.x = radius * Math.cos( segment );
	vertex.y = radius * Math.sin( segment );

	this.vertices.push( vertex );
	uvs.push( new THREE.Vector2( ( vertex.x / radius + 1 ) / 2, ( vertex.y / radius + 1 ) / 2 ) );

    }

    if(innerRadius != 0) {
	for ( i = 0; i <= segments; i ++ ) {

	    var vertex = new THREE.Vector3();
	    var segment = thetaStart + i / segments * thetaLength;

	    vertex.x = innerRadius * Math.cos( segment );
	    vertex.y = innerRadius * Math.sin( segment );
	    
	    this.vertices.push( vertex );
	    uvs.push( new THREE.Vector2( ( vertex.x / radius + 1 ) / 2, ( vertex.y / radius + 1 ) / 2 ) );
	    
	}
    }

    var n = new THREE.Vector3( 0, 0, 1 );


    if(innerRadius != 0) {
	for ( i = 0; i < segments; i ++ ) {

	    var v1 = i;
	    var v2 = i + 1 ;
	    var v3 = i + segments +1;

	    this.faces.push( new THREE.Face3( v1, v2, v3, [ n.clone(), n.clone(), n.clone() ] ) );
	    this.faceVertexUvs[ 0 ].push( [ uvs[ i ].clone(), uvs[ i + 1 ].clone(), uvs[i+segments+1].clone() ] );

	    v1 = i +1;
	    v2 = i + segments+2;
	    
	    this.faces.push( new THREE.Face3( v1, v2, v3, [ n.clone(), n.clone(), n.clone() ] ) );
	    this.faceVertexUvs[ 0 ].push( [ uvs[ i + 1 ].clone(), uvs[ i + segments + 2 ].clone(), uvs[i+segments+1].clone() ] );

	}
    }
    else {
	for ( i = 1; i <= segments; i ++ ) {

	    var v1 = i;
	    var v2 = i + 1 ;
	    var v3 = 0;

	    this.faces.push( new THREE.Face3( v1, v2, v3, [ n.clone(), n.clone(), n.clone() ] ) );
	    this.faceVertexUvs[ 0 ].push( [ uvs[ i ].clone(), uvs[ i + 1 ].clone(), centerUV.clone() ] );

	}
    }

    this.computeCentroids();
    this.computeFaceNormals();

    this.boundingSphere = new THREE.Sphere( new THREE.Vector3(), radius );

};

CircleGeometry.prototype = Object.create( THREE.Geometry.prototype );



/**
 * @author mrdoob / http://mrdoob.com/
 * based on http://papervision3d.googlecode.com/svn/trunk/as3/trunk/src/org/papervision3d/objects/primitives/Cube.as

 modified so has open top

*/

CubeOpenGeometry = function ( width, height, depth, widthSegments, heightSegments, depthSegments ) {

    THREE.Geometry.call( this );

    var scope = this;

    this.width = width;
    this.height = height;
    this.depth = depth;

    this.widthSegments = widthSegments || 1;
    this.heightSegments = heightSegments || 1;
    this.depthSegments = depthSegments || 1;

    var width_half = this.width / 2;
    var height_half = this.height / 2;
    var depth_half = this.depth / 2;

    buildPlane( 'z', 'y', - 1, - 1, this.depth, this.height, width_half, 0 ); // px
    buildPlane( 'z', 'y',   1, - 1, this.depth, this.height, - width_half, 1 ); // nx
    buildPlane( 'x', 'z',   1,   1, this.width, this.depth, height_half, 2 ); // py
    buildPlane( 'x', 'z',   1, - 1, this.width, this.depth, - height_half, 3 ); // ny
    //buildPlane( 'x', 'y',   1, - 1, this.width, this.height, depth_half, 4 ); // pz
    buildPlane( 'x', 'y', - 1, - 1, this.width, this.height, - depth_half, 5 ); // nz

    function buildPlane( u, v, udir, vdir, width, height, depth, materialIndex ) {

	var w, ix, iy,
	gridX = scope.widthSegments,
	gridY = scope.heightSegments,
	width_half = width / 2,
	height_half = height / 2,
	offset = scope.vertices.length;

	if ( ( u === 'x' && v === 'y' ) || ( u === 'y' && v === 'x' ) ) {

	    w = 'z';

	} else if ( ( u === 'x' && v === 'z' ) || ( u === 'z' && v === 'x' ) ) {

	    w = 'y';
	    gridY = scope.depthSegments;

	} else if ( ( u === 'z' && v === 'y' ) || ( u === 'y' && v === 'z' ) ) {

	    w = 'x';
	    gridX = scope.depthSegments;

	}

	var gridX1 = gridX + 1,
	gridY1 = gridY + 1,
	segment_width = width / gridX,
	segment_height = height / gridY,
	normal = new THREE.Vector3();

	normal[ w ] = depth > 0 ? 1 : - 1;

	for ( iy = 0; iy < gridY1; iy ++ ) {

	    for ( ix = 0; ix < gridX1; ix ++ ) {

		var vector = new THREE.Vector3();
		vector[ u ] = ( ix * segment_width - width_half ) * udir;
		vector[ v ] = ( iy * segment_height - height_half ) * vdir;
		vector[ w ] = depth;

		scope.vertices.push( vector );

	    }

	}

	for ( iy = 0; iy < gridY; iy++ ) {

	    for ( ix = 0; ix < gridX; ix++ ) {

		var a = ix + gridX1 * iy;
		var b = ix + gridX1 * ( iy + 1 );
		var c = ( ix + 1 ) + gridX1 * ( iy + 1 );
		var d = ( ix + 1 ) + gridX1 * iy;

		var uva = new THREE.Vector2( ix / gridX, 1 - iy / gridY );
		var uvb = new THREE.Vector2( ix / gridX, 1 - ( iy + 1 ) / gridY );
		var uvc = new THREE.Vector2( ( ix + 1 ) / gridX, 1 - ( iy + 1 ) / gridY );
		var uvd = new THREE.Vector2( ( ix + 1 ) / gridX, 1 - iy / gridY );

		var face = new THREE.Face3( a + offset, b + offset, d + offset );
		face.normal.copy( normal );
		face.vertexNormals.push( normal.clone(), normal.clone(), normal.clone() );
		face.materialIndex = materialIndex;

		scope.faces.push( face );
		scope.faceVertexUvs[ 0 ].push( [ uva, uvb, uvd ] );

		face = new THREE.Face3( b + offset, c + offset, d + offset );
		face.normal.copy( normal );
		face.vertexNormals.push( normal.clone(), normal.clone(), normal.clone() );
		face.materialIndex = materialIndex;

		scope.faces.push( face );
		scope.faceVertexUvs[ 0 ].push( [ uvb.clone(), uvc, uvd.clone() ] );

	    }

	}

    }

    this.computeCentroids();
    this.mergeVertices();

};

CubeOpenGeometry.prototype = Object.create( THREE.Geometry.prototype );

