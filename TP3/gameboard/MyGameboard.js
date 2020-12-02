/**
 * MyGameBoard
 * Represents the Game Board in the Prolog Game
 */

class MyGameBoard {
    /**
     * MyGameBoard
     * @constructor
     * @param {CGFscene} scene - Reference to MyScene object
     */
    constructor(scene) {
        this.scene = scene;
        this.tiles = [];
        for (var line = 8; line >= 1; -- line) {
            for (var column = 1; column <= 8; ++ column) {
                this.tiles.push(new MyTile(this.scene, [column, line]));
            }
        }
        this.removedPieces = [];
    }

    /**
     * Add Piece to the Removed Pieces List
     * @param {MyPiece} piece - Piece that got removed from the board 
     */
    addRemovedPiece(piece) {
        this.removedPieces.push(piece);
    }

    /**
     * Remove the Piece Standing on this Tile
     * @param {MyTile} tile - Tile where the Piece is Standing
     */
    removePiece(tile) {
        tile.unsetPiece(this);
    }

    /**
     * Get the Piece Standing on this Tile
     * @param {MyTile} tile - Tile where the Piece is Standing
     */
    getPiece(tile) {
        tile.getPiece();
    }

    /**
     * Get the Tile in this Column and Line of the GameBoard
     * @param {int} column
     * @param {int} line
     */
    getTile(column, line) {
        var x = column - 1;
        var y = 8 - line;
        var tile = this.tiles[x * 8 + y];
        console.log(tile);
        return tile;
    }

    /**
     * Move the Piece from Starting Tile to Destination Tile
     * @param {MyTile} startingTile - Starting Tile
     * @param {MyTile} destinationTile - Destination Tile
     */
    movePiece(startingTile, destinationTile) {
        var piece = this.getPiece(startingTile);
        destinationTile.setPiece(this, piece);
    }

    /**
     * Display GameBoard
     */
    display() {
        for (var i = 0; i < this.tiles.length; ++ i) {
            this.tiles[i].display();
        }
    }
}