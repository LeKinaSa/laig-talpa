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
        this.scene.pushMatrix();

        this.activateShader();
        this.texture.apply();
        for (let index = 0; index < this.text.length; index ++) {
            // Activate Sprite
            this.activateCellP(text.charAt(index));

            // Display Base Geometry
            if (i > 0) this.scene.translate(1, 0, 0);
            this.plane.display();
        }
        this.deactivateShader();
        
        this.scene.popMatrix();
    }
}
