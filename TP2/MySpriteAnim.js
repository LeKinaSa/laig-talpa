/**
 * MySpriteAnim
 * Uses MySpriteSheet to Represent Animation
 */
class MySpriteAnim {
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
    }
}
