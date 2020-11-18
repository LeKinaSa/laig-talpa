class MyPatch extends CGFobject{
	constructor(scene, npointsU, npointsV, npartsU, npartsV, controlpoints) {
        super(scene);
        this.scene = scene;
        this.upoints = npointsU;
        this.vpoints = npointsV;
        this.uparts = npartsU;
        this.vparts = npartsV;
        this.controlVertexes = controlpoints;
        this.cps = [[]];
        this.initBuffers();
        // -------- Prints
        console.log("upoints: " + this.upoints);
        console.log("vpoints: " + this.vpoints);
        console.log("uparts: " + this.uparts);
        console.log("vparts: " + this.vparts);
        for(var i = 0; i < this.controlVertexes.length; i++){
            console.log("cp " + i + ": " + this.controlVertexes[i]);
        }
	}
	initBuffers() {
        var aux = 0; // goes through controlVertexes
        for(var i = 0; i < this.upoints; i++) {
            this.cps[i] = []; // it's clear
            for(var j = 0; j < this.vpoints; j++) {
                this.cps[i][j] = this.controlVertexes[aux]; // x y z
                this.cps[i][j].push(1); // w
                aux++;
            }
        }
        var nurbsSurface = new CGFnurbsSurface(this.upoints-1, this.vpoints-1, this.cps);
        this.obj = new CGFnurbsObject(this.scene, this.uparts, this.vparts, nurbsSurface);
        console.log(this.obj);
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