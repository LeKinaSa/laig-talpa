class MyDefBarrel extends CGFobject{
	constructor(scene, base, middle, height, slices, stacks) {
        super(scene);
        this.base   = base;
        this.middle = middle;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

		this.initBuffers();
	}
	initBuffers() {
        var r = this.base;
        var R = this.middle;
        var H = 4/3 * (R - r);
        var L = this.height;
        var alpha = Math.PI / 6; // 30graus
        var controlvertexes = [
            [r, 0, 0],
            [r + H, 0, H / Math.tan(alpha)],
            [r + H, 0, L - H / Math.tan(alpha)],
            [r, 0, L]
        ];
        var nurbsSurface = new CGFnurbsSurface(this.slices - 1, this.stacks - 1, controlvertexes);
        this.obj = new CGFnurbsObject(this.scene, this.slices, this.stacks, nurbsSurface)
    }

    /**
     * Updates the Texture Coordinates based on the Amplification
     * @param {float} afs - Amplification Factor on S 
     * @param {float} aft - Amplification Factor on T
     */
	updateTexCoords(afs, aft) { }
}
