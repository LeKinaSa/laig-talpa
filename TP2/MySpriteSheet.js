/**
 * MySpriteSheet
 * Stores SpriteSheet Texture and Controls Shader
 */
class MySpriteSheet {
    /**
     * MySpriteSheet
     * @constructor
     * @param {CGFscene} scene - Reference to Scene object
     * @param {CGFtexture} texture - Reference to the spritesheet texture
     * @param {int} sizeM - Number of Columns
     * @param {int} sizeN - Number of Lines
     */
    constructor(scene, texture, sizeM, sizeN) {
        super(scene);
        this.texture = texture;
        this.columns = sizeM;
        this.lines   = sizeN;
    }
}
