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
        
        this.tileMaterial = new CGFappearance(this.scene);
        this.tileMaterial.setShininess(30);
        this.tileMaterial.setAmbient (0.5, 0.5, 0.5, 1.0);
        this.tileMaterial.setDiffuse (0.8, 0.8, 0.8, 1.0);
        this.tileMaterial.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.tileMaterial.setEmission(0.0, 0.0, 0.0, 1.0);

        this.tileTexture = new CGFtexture(this.scene, "./scenes/images/tile.png");
        
        this.tileMaterial.setTexture(this.tileTexture);
        this.tileMaterial.setTextureWrap('REPEAT', 'REPEAT');
        this.tileMaterial.apply();
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
    setPiece(gameboard, piece) {
        this.unsetPiece(gameboard);
        this.piece = piece;
    }

    /**
     * Unset the Piece standing on this Tile
     */
    unsetPiece(gameboard) {
        if (this.piece != null) {
            gameboard.addRemovedPiece(this.piece);
            this.piece = null;
        }
    }
    unsetPiece() {
        this.piece = null;
    }

    /**
     * Get Piece
     */
    getPiece() {
        return this.piece;
    }

    /**
     * Get Column
     */
    getColumn() {
        return this.position[0];
    }

    /**
     * Get Line
     */
    getLine() {
        return this.position[1];
    }

    /**
     * Display Tile Primitive and the Piece Standing on that Tile
     */
    display() {
        // Obtain Position in the Board
        var column = this.position[0];
        var  line  = 9 - this.position[1];
        
        // Register for Picking
        if (this.piece != null) {
            this.scene.registerForPick(line * 8 + column, this.piece);
        }
        this.scene.pushMatrix();

        // Translation According to the Position on the Board
        this.scene.translate(4.5 - line, 0, 4.5 - column);

        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.tileMaterial.apply();
        this.tile.display();
        if (this.piece != null) {
            this.piece.display();
        }
        this.scene.popMatrix();

        // Clear from Picking
        if (this.piece != null) {
            this.scene.clearPickRegistration();
        }
    }
}
