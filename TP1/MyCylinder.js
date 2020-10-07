/**
 * MyCylinder 
 * @constructor
 * @param  scene - MyScene object
 * @param  height - cylinder's height
 * @param  topRadius - top radius
 * @param  bottomRadius - bottom radius
 * @param  stacks - number of height divisions
 * @param  slices - number of slices around Y axis
*/
class MyCylinder extends CGFobject {
    constructor(scene, height, topRadius, bottomRadius, stacks, slices) {
        super(scene);
        this.height = height;
        this.topRadius = topRadius;
        this.bottomRadius = bottomRadius;
        this.heightDivs = stacks;
        this.circleDivs = slices;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
        
        var angleInc = (2 * Math.PI) / this.circleDivs;
        var circleVertices = this.circleDivs + 1;    
        var heightInc = this.height / this.heightDivs;
        var currentRadius = this.bottomRadius;
        var radiusInc = (this.topRadius - this.bottomRadius) / this.heightDivs;
    
        var currentHeight = 0;
        var angle = 0;

        // build an all-around stack at a time, starting on "z=0" and proceeding "for positive z"
        for (let stack = 0; stack <= this.height; stack++) {
            // in each stack, build all the slices around, starting on longitude 0
            angle = 0;
            for (let slice = 0; slice <= this.circleDivs; slice++) {
                //--- Vertices coordinates
                var x = currentRadius * Math.sin(-angle);
                var y = currentRadius * Math.cos(angle);
                var z = currentHeight;
                this.vertices.push(x, y, z);
                console.log(x, y, z);
    
                //--- Indices
                if (stack < this.heightDivs && slice < this.circleDivs) {
                    var current = stack * circleVertices + slice;
                    var next = current + circleVertices;
                    // pushing two triangles using indices from this round (current, current+1)
                    // and the ones directly south (next, next+1)
                    // (i.e. one full round of slices ahead)
                    
                    this.indices.push(current + 1, current, next);
                    this.indices.push(current + 1, next, next + 1);
                }
    
                //--- Normals
                // at each vertex, the direction of the normal is equal to 
                // the vector from the center of the cylinder to the vertex.
                this.normals.push(x/this.radius, y/this.radius, 0);
                angle += angleInc;
    
                //--- Texture Coordinates
                this.texCoords.push(slice/this.circleDivs , stack/this.heightDivs);
            }
            currentHeight += heightInc;
            currentRadius += radiusInc;
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    
}
