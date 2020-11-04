/**
 * MySpriteText
 * Uses MySpriteSheet to Represent Text
 */
class MySpriteText {
    /**
     * MySpriteText
     * @constructor
     * @param {CGFscene} scene - Reference to Scene object
     * @param {string} text - Text to be represented with the SpriteSheet 
     */
    constructor(scene, text) {
        super(scene);
        this.text = text;
    }
}
