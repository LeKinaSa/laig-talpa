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
        this.scene = scene;
        this.texture = texture;
        this.columns = sizeM;
        this.lines   = sizeN;
        this.shader  = new CGFshader(this.scene.gl, "spritesheet.vert", "spritesheet.frag");
        this.shader.setUniformsValues({ dimensions: [this.columns, this.lines] });
    }

    activateShader() {
        this.setActiveShader(this.shader);
        this.texture.apply();
    }

    activateCellP(p) {
        let column = p % this.columns;
        let line   = (p - column) / this.columns;
        this.activateCellMN(column, line);
    }

    activateCellMN(column, line) {
        this.shader.setUniformsValues({ charCoords: [column, line] });
    }

    deactivateShader() {
        this.setActiveShader(this.scene.defaultShader);
    }

}
