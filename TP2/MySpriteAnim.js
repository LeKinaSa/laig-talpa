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
        this.scene = scene;
        this.spriteSheet = spriteSheet;
        this.duration = duration;
        this.startCell = startCell;
        this.endCell = endCell;
    }

    updateAnimation(t) {
        var instant = t % this.duration;
        var timePerCell = this.duration / (this.endCell - this.startCell + 1);
        // TODO

    }
}
