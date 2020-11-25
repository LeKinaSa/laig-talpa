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
     * Set the Piece standing on this Tile
     * @param {MyPiece} piece - Piece Standing on this Tile
     */
    setPiece(piece) {
        this.piece = piece;
        this.piece.placeOnTile(this);
    }

    /**
     * Unset the Piece standing on this Tile
     */
    unsetPiece() {
        this.piece = null;
        this.piece.placeOnTile(null);
    }

    /**
     * Get Piece
     */
    getPiece() {
        return this.piece;
    }

    /**
     * Display Tile Primitive and the Piece Standing on that Tile
     */
    display() {
        this.scene.pushMatrix();
        this.tile.display();
        if (this.piece != null) {
            this.piece.display();
        }
        this.scene.popMatrix();
    }

    /**
     * Updates the Texture Coordinates based on the Amplification
     * Only here because of inheritance
     */
    updateTexCoords(afs, aft) { }
}
