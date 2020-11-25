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
        this.piece = new MyCylinder(this.scene, 0.5, 0.5, 0.5, 2, 4);
        this.tile = tile;
    }

    /**
     * Places the Piece on a Tile
     * @param {MyTile} tile - Tile where the Piece is placed
     */
    placeOnTile(tile) {
        this.tile = tile;
        this.tile.modifyPiece(this);
    }

    /**
     * Display Piece Primitive
     */
    display() {
        this.scene.pushMatrix();
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
