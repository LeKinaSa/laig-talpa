/**
 * MyTile
 * Represents the Tiles in the Prolog Game
 */
class MyTile {
    /**
     * MyTile
     * @constructor
     * @param {CGFscene} scene - Reference to MyScene object
     * @param {Position} position - Position of the Tile in the Game Board
     */
    constructor(scene, position) {
        this.scene = scene;
        this.tile = new MyRectangle(this.scene, -0.5, -0.5, 0.5, 0.5);
        this.position = position;
        this.piece = this.startingPiece();
    }

    startingPiece() {
        var column = this.position[0] % 2; // Is column odd or even ?
        var  line  = this.position[1] % 2; // Is  line  odd or even ?

        if (line == column) { // If line and column are both odd or both even
            // Piece is red
            return new MyPiece(this.scene, 'red');
        }
        else { // If line and column are 1 odd and 1 even
            // Piece is blue
            return new MyPiece(this.scene, 'blue');
        }
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
        if (this.piece != null) {
            this.piece.placeOnTile(null);
            this.piece = null;
        }
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

        // Translation According to the Position on the Board
        var column = this.position[0];
        var  line  = 9 - this.position[1];
        this.scene.translate(column-3.5, 0, line-3.5); // TODO : maybe trade line and column

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
