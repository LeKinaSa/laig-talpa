/**
 * MyTriangle
 * CODE ADAPTED FROM THE CLASS MyTriangle FROM CGRA
 * 
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x1 - x coordinate corner 1
 * @param y1 - y coordinate corner 1
 * @param x2 - x coordinate corner 2
 * @param y2 - y coordinate corner 2
 * @param x3 - x coordinate corner 3
 * @param y3 - y coordinate corner 3
 */
class MyTriangle extends CGFobject {
	constructor(scene, x1, y1, x2, y2, x3, y3) {
		super(scene);
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.x3 = x3;
		this.y3 = y3;

		/* this.a = 0;
		this.b = 0;
		this.c = 0;
		this.cosalfa = 0;
		this.cosgama = 0;
		this.cosbeta = 0; */

		this.initBuffers();
	}
	initBuffers() {
/*
		this.a = Math.sqrt(Math.pow(this.x2-this.x1,2)+Math.pow(this.y2-this.y1,2));
		this.b = Math.sqrt(Math.pow(this.x3-this.x2,2)+Math.pow(this.y3-this.y2,2));
		this.c = Math.sqrt(Math.pow(this.x1-this.x3,2)+Math.pow(this.y1-this.y3,2));
		
		this.cosalfa = (Math.pow(this.a,2)-Math.pow(this.b,2)+Math.pow(this.c,2))/(2*this.a*this.c);
		this.cosgama = (-Math.pow(this.a,2)+Math.pow(this.b,2)+Math.pow(this.c,2))/(2*this.b*this.c);
		this.cosbeta = (Math.pow(this.a,2)+Math.pow(this.b,2)-Math.pow(this.c,2))/(2*this.a*this.b);

*/
		this.vertices = [
			this.x1, this.y1, 0,	//0
			this.x2, this.y2, 0,	//1
            this.x3, this.y3, 0,	//2
            // Back Face
            this.x1, this.y1, 0,	//3
			this.x2, this.y2, 0,	//4
			this.x3, this.y3, 0 	//5
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
			3, 5, 4
        ];

		//Facing Z positive
		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, -1,
			0, 0, -1,
			0, 0, -1
		];

		/*
		Texture coords (s,t)
		+----------> s
        |
        |
		|
		v
        t
        */

	   this.texCoords = [
 
		0, 0,
		1, 0,
		0.5, -0.707,
		1, 0,
		0, 0,
		0.5, -0.707
		
		
	]

		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}

	updateTexCoords(afs, aft) {
		this.texCoords = [
			0, 0,
			1/afs, 0,
			0.5/afs, -0.707/aft,
			1/afs, 0,
			0, 0,
			0.5/afs, -0.707/aft
		];
		this.updateTexCoordsGLBuffers();
    }
}