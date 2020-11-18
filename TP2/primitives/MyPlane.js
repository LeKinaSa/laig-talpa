class MyPlane extends CGFobject{
	constructor(scene) {
		super(scene);

		this.initBuffers();
	}
	initBuffers() {
		
	}
    /**
     * Updates the Texture Coordinates based on the Amplification
     * @param {float} afs - Amplification Factor on S 
     * @param {float} aft - Amplification Factor on T
     */
	updateTexCoords(afs, aft) {
		var tmp = this.texCoords;
        var auxCoords = [];
        for(let i = 0; i < this.texCoords.length; i++){
            if(i % 2 == 0) auxCoords.push(this.texCoords[i]/afs);
            else auxCoords.push(this.texCoords[i]/aft);
        }
        this.texCoords = auxCoords;
        this.updateTexCoordsGLBuffers();
		this.texCoords = tmp;

		
	}
}

