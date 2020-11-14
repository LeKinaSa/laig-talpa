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
        this.scene = scene;
        this.text = text;
        this.spriteSheet = new MySpriteSheet(this.scene, new CGFtexture("./scenes/images/font.png"), 10, 10);
        this.plane = new MyRectangle(this.scene, 0, 0, 1, 1);
    }

    display() {
        this.scene.pushMatrix();

        this.spriteSheet.activateShader();
        this.scene.translate(- this.text.length / 2, -0.5, 0);
        var p;
        for (var index = 0; index < this.text.length; index ++) {
            // Get Character Sprite Position
            p = this.getCharacterPosition(index);

            // Activate Sprite
            this.spriteSheet.activateCellP(p);

            // Display Base Geometry
            if (index > 0) this.scene.translate(1, 0, 0);
            this.plane.display();
        }
        this.spriteSheet.deactivateShader();
        
        this.scene.popMatrix();
    }

    getCharacterPosition(index) {
        // Get Char Code
        var charCode = this.text.charCodeAt(index);
        
        // Get Position in the SpriteSheet
        if ((charCode >= 32) && (charCode <= 126)) {
            return charCode - 32;
        }
        return 0;
    }

    updateTexCoords() {}
}
