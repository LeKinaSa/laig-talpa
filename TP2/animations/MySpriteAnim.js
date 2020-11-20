/**
 * MySpriteAnim
 * Uses MySpriteSheet to Represent Animation
 */
class MySpriteAnim extends MyAnimation {
    /**
     * 
     * @param {CGFscene} scene - Reference to Scene object
     * @param {MySpriteSheet} spriteSheet - Reference to MySpriteSheet object
     * @param {float} duration - duraction of the animation, in seconds
     * @param {int} startCell - index of the first sprite
     * @param {int} endCell   - index of the last sprite
     */
    constructor(scene, spriteSheet, duration, startCell, endCell) {
        super(scene);
        this.spriteSheet = spriteSheet;
        this.duration = duration;
        this.startCell = startCell;
        this.endCell = endCell;
        this.currentCell = startCell;
        this.plane = new MyRectangle(scene, 0, 0, 1, 1);
        this.initTime = 0;
    }

    update(t) {
        t = t / 1000;

        if (this.initTime == 0) { this.initTime = t; }
        
        var delta_time = t - this.initTime;
        var instant = delta_time % this.duration;
        var timePerCell = this.duration / (this.endCell - this.startCell + 1);
        var cellOffset = instant / timePerCell;
        var cell = this.startCell + Math.floor(cellOffset);
        this.currentCell = cell;
    }

    display() {
        this.spriteSheet.activateShader();
        this.spriteSheet.activateCellP(this.currentCell);
        this.plane.display();
        this.spriteSheet.deactivateShader();
    }

    updateTexCoords() {}
}
