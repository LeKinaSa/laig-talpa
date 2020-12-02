/**
 * MyPiece
 * Represents the Pieces in the Prolog Game
 */
class MyPiece {
    /**
     * MyPiece
     * @constructor
     * @param {CGFscene} scene - Reference to MyScene object
     * @param {String} color - Color of the Piece : may be 'red' or 'blue'
     */
    constructor(scene, color) {
        this.scene = scene;
        this.piece = new MyCylinder(this.scene, 0.5, 0.5, 0.5, 2, 4);
        this.tile = null;
        this.color = color;

        this.redMaterial = new CGFappearance(this.scene);
        this.redMaterial.setShininess(30);
        this.redMaterial.setAmbient (0.2, 0.0, 0.0, 1.0);
        this.redMaterial.setDiffuse (0.6, 0.0, 0.0, 1.0);
        this.redMaterial.setSpecular(0.8, 0.0, 0.0, 1.0);
        this.redMaterial.setEmission(0.0, 0.0, 0.0, 1.0);
        
        this.blueMaterial = new CGFappearance(this.scene);
        this.blueMaterial.setShininess(30);
        this.blueMaterial.setAmbient (0.0, 0.0, 0.2, 1.0);
        this.blueMaterial.setDiffuse (0.0, 0.0, 0.6, 1.0);
        this.blueMaterial.setSpecular(0.0, 0.0, 0.8, 1.0);
        this.blueMaterial.setEmission(0.0, 0.0, 0.0, 1.0);
    }

    /**
     * Places the Piece on a Tile
     * @param {MyTile} tile - Tile where the Piece is placed
     */
    placeOnTile(tile) {
        this.tile = tile;
    }

    /**
     * Get Piece Type / Color
     */
    getType() {
        return this.color;
    }

    /**
     * Display Piece Primitive
     */
    display() {
        this.scene.pushMatrix();

        // Display Piece Color
        if (this.color == 'red') {
            this.redMaterial.apply();
        }
        else if (this.color == 'blue') {
            this.blueMaterial.apply();
        }

        // Display Piece
        this.scene.rotate(Math.PI/4, 0, 0, 1);
        this.piece.display();
        
        this.scene.popMatrix();
    }

    /**
     * Updates the Texture Coordinates based on the Amplification
     * Only here because of inheritance
     */
    updateTexCoords(afs, aft) { }
}
