/**
 * MyPiece
 * Represents the Pieces in the Prolog Game
 */
class MyPiece {
    /**
     * MyPiece
     * @constructor
     * @param {CGFscene} scene - Reference to MyScene object
     * @param {MyTile} tile - Tile where the Piece is placed
     */
    constructor(scene, tile) {
        this.scene = scene;
        this.piece = new MyCylinder(this.scene, 0.5, 1, 1, 2, 4);
        this.tile = tile;
    }

    /**
     * Display Piece Primitive
     */
    display() {
        this.piece.display();
    }

    /**
     * Updates the Texture Coordinates based on the Amplification
     * Only here because of inheritance
     */
    updateTexCoords(afs, aft) { }
}
