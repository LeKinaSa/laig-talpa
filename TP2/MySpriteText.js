/**
 * MySpriteText
 * Uses MySpriteSheet to Represent Text
 */
class MySpriteText extends MySpriteSheet {
    /**
     * MySpriteText
     * @constructor
     * @param {CGFscene} scene - Reference to Scene object
     * @param {string} text - Text to be represented with the SpriteSheet 
     */
    constructor(scene, text) {
        this.scene = scene;
        this.text = text;
        this.plane = new MyRectangle(scene, 0, 0, 1, 1);
    }

    display() {
        var p;
        var charCode;
        this.scene.pushMatrix();

        this.activateShader();
        this.texture.apply();
        for (let index = 0; index < this.text.length; index ++) {
            // Get Character Sprite Position
            charCode = this.text.charCodeAt(index);
            p = this.getCharacterPosition(charCode);

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
        // 48 < charCode < 57  - 0 9
        // 65 < charCode < 90  - A Z
        // 97 < charCode < 122 - a z
        charCode = charCode - 48;
        if (charCode > 9) charCode = charCode - 7;
        if (charCode > 35) charCode = charCode - 6;
        return charCode;
    }
}
