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
        this.stacks = stacks;
        this.slices = slices;

        this.initBuffers();
    }

    initBuffers() {
        
        // TODO:

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    
}