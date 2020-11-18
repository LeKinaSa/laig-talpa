class MyPatch extends CGFobject{
	constructor(scene, npointsU, npointsV, npartsU, npartsV, controlpoints) {
        super(scene);
        this.scene = scene;
        this.upoints = npointsU;
        this.vpoints = npointsV;
        this.uparts = npartsU;
        this.vparts = npartsV;
        this.cps = controlpoints;
		this.initBuffers();
	}
	initBuffers() {
        this.cps = 
        [
        ];

        //var nurbsSurface = new CGFnurbsSurface(1, 1, this.cps);
        //this.obj = new CGFnurbsObject(this.scene, this.uparts, this.vparts, nurbsSurface );
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