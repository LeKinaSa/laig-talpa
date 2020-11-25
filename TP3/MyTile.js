/**
 * MyTile
 * Represents the Tiles in the Prolog Game
 */
class MyTile {
    /**
     * MyTile
     * @constructor
     * @param {CGFscene} scene - Reference to MyScene object
     */
    constructor(scene) {
        this.scene = scene;
        this.tile = new MyRectangle(this.scene, -0.5, -0.5, 0.5, 0.5);
        this.piece = null;
    }

    /**
     * Modifies the Piece standing on this Tile
     * @param {MyPiece} piece - Piece Standing on this Tile
     */
    modifyPiece(piece) {
        this.piece = piece;
    }

    /**
     * Display Tile Primitive and the Piece Standing on that Tile
     */
    display() {
        this.scene.pushMatrix();
        this.tile.display();
        this.piece.display();
        this.scene.popMatrix();
    }

    /**
     * Updates the Texture Coordinates based on the Amplification
     * Only here because of inheritance
     */
    updateTexCoords(afs, aft) { }
}
