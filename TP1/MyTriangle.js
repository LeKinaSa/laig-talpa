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

		this.initBuffers();
	}
	initBuffers() {
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
            2, 1, 0,
            3, 4, 5
		];

		//Facing Z positive
		this.normals = [
			0, 0, 1,
			0, 0, 1,
            0, 0, 1,
            // Back Face
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

		// TODO: 

		0, 1,
		1, 1,
		0, 0,
        1, 0,
        0, 1,
        1, 1
	]

		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}

	updateTexCoords(afs, aft) {}
}