class MyPlane extends CGFobject{
	constructor(scene, npartsU, npartsV) {
        super(scene);
        this.scene = scene;
        this.u = npartsU;
        this.v = npartsV;
		this.initBuffers();
	}
	initBuffers() {
        this.cps = 
        [
            [
                [-0.5, 0.0, 0.5, 1 ],
                [-0.5, 0.0, -0.5, 1 ]
            ],
            [
                [ 0.5, 0.0, 0.5, 1 ],
                [ 0.5, 0.0, -0.5, 1 ]							 
            ]
        ];

        var nurbsSurface = new CGFnurbsSurface(1, 1, this.cps);
        this.obj = new CGFnurbsObject(this.scene, this.u, this.v, nurbsSurface);
    }
    
    display(){
        this.scene.pushMatrix();
        this.obj.display();
        this.scene.popMatrix();
    }
    /**
     * Updates the Texture Coordinates based on the Amplification
     * @param {float} afs - Amplification Factor on S 
     * @param {float} aft - Amplification Factor on T
     */
	updateTexCoords(afs, aft) {
	}
}

