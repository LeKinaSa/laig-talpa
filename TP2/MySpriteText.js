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
        this.spriteSheet = new MySpriteSheet(this.scene, new CGFtexture("./scenes/images/font.png"), 10, 9);
        this.plane = new MyRectangle(scene, 0, 0, 1, 1);
    }

    display() {
        this.scene.pushMatrix();

        this.activateShader();
        this.scene.translate(- this.text.length / 2, -0.5, 0);
        var p;
        for (let index = 0; index < this.text.length; index ++) {
            // Get Character Sprite Position
            p = this.getCharacterPosition(index);

            // Activate Sprite
            this.activateCellP(p);

            // Display Base Geometry
            if (i > 0) this.scene.translate(1, 0, 0);
            this.plane.display();
        }
        this.deactivateShader();
        
        this.scene.popMatrix();
    }

    getCharacterPosition(charCode) {
        // Get Char Code
        var charCode = this.text.charCodeAt(index);
        
        // Get Position in the SpriteSheet
                // charCode == 46      - .
                // 48 < charCode < 57  - 0 9
                // 65 < charCode < 90  - A Z
                // 97 < charCode < 122 - a z
        if ((charCode >= 33) && (charCode <= 122)) {
            return charCode - 33;
        }
        // depois podemos acrescentar o ' ' (32)
        // { | } ~ a seguir ao z (123, 124, 125, 126)
        // e fazer a textura ser 10x10
        // 32 - 126
        return -1;
    }
}
