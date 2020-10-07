/**
 * MyTorus
 * 
 * @constructor
 * @param scene - Reference to MyScene object
 * @param inner - inner circunference
 * @param outer - outer circunference
 * @param slices - inner circunference slices
 * @param loops - outer circunference slices
 */

class MyTorus extends CGFobject {
    constructor(scene, inner, outer, slices, loops) {
        super(scene);
        this.innerRadius = inner;
        this.outerRadius = outer;
        this.slices = slices;
        this.loops = loops;
        console.log(inner, outer, slices, loops);

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
    
        var phi = 0;
        var theta = 0;
        var phiInc = (2 * Math.PI) / this.slices;
        var thetaInc = (2 * Math.PI) / this.loops;
        var loopVertices = this.loops + 1;
    
        // build an all-around stack at a time
        for (let outerSlice = 0; outerSlice <= this.loops; outerSlice++) {
            // in each stack, build all the slices around
            theta = 0;
            for (let innerSlice = 0; innerSlice <= this.slices; innerSlice++) {
                //--- Vertices coordinates
                var x = (this.outerRadius + this.innerRadius * Math.cos(theta)) * Math.cos(phi);
                var y = (this.outerRadius + this.innerRadius * Math.cos(theta)) * Math.sin(phi);
                var z = this.innerRadius * Math.sin(theta);
                this.vertices.push(x, y, z);
    
                //--- Indices
                if (outerSlice < this.loops && innerSlice < this.slices) {
                    var current = outerSlice * loopVertices + innerSlice;
                    var next = current + loopVertices;
                    // pushing two triangles using indices from this round (current, current+1)
                    // and the ones directly south (next, next+1)
                    // (i.e. one full round of slices ahead)
                    
                    this.indices.push(current + 1, current, next);
                    this.indices.push(current + 1, next, next + 1);
                }
    
                //--- Normals
                // at each vertex, the direction of the normal is equal to 
                // the vector from the center of the sphere to the vertex.
                // in a sphere of radius equal to one, the vector length is one.
                // therefore, the value of the normal is equal to the position vector
                var outerX = this.outerRadius * Math.cos(phi);
                var outerY = this.outerRadius * Math.sin(phi);
                var outerZ = 0;
                this.normals.push((x - outerX) / this.innerRadius, (y - outerY) / this.innerRadius, (z - outerZ) / this.innerRadius);
                
    
                //--- Texture Coordinates
                this.texCoords.push(innerSlice/this.slices, outerSlice/this.loops);
                
                theta += thetaInc;
            }
            phi += phiInc;
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
