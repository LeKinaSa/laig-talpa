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
     * Remove the Piece Standing on this Position
     * @param {int} column
     * @param {int} line
     */
    removePieceByPosition(column, line) {
        var tile = this.getTile(column, line);
        this.removePiece(tile);
    }

    /**
     * Get the Piece Standing on this Tile
     * @param {MyTile} tile - Tile where the Piece is Standing
     */
    getPiece(tile) {
        return tile.getPiece();
    }

    /**
     * Get the Tile in this Column and Line of the GameBoard
     * @param {int} column
     * @param {int} line
     */
    getTile(column, line) {
        var x = 8 - line;
        var y = column - 1;
        var tile = this.tiles[x * 8 + y];
        return tile;
    }

    /**
     * Move the Piece from Starting Tile to Destination Tile
     * @param {MyTile} startingTile - Starting Tile
     * @param {MyTile} destinationTile - Destination Tile
     */
    movePiece(startingTile, destinationTile) {
        var piece = this.getPiece(startingTile);
        startingTile.unsetPiece();
        destinationTile.setPiece(this, piece);
    }

    /**
     * Move the Piece from Starting Position to Destination Position
     * @param {int} startingColumn 
     * @param {int} startingLine 
     * @param {int} destinationColumn 
     * @param {int} destinationLine 
     */
    movePieceByPosition(startingColumn, startingLine, destinationColumn, destinationLine) {
        var startingTile    = this.getTile(startingColumn, startingLine);
        var destinationTile = this.getTile(destinationColumn, destinationLine);
        this.movePiece(startingTile, destinationTile);
    }

    /**
     * Display GameBoard
     */
    display() {
        for (var i = 0; i < this.tiles.length; ++ i) {
            this.tiles[i].display();
        }
    }

    /**
     * Reset Picking Selection
     */
    resetPickingSelections() {
        for (var i = 0; i < this.tiles.length; ++ i) {
            this.tiles[i].resetPickingSelection();
        }
    }

    /**
     * Turn the GameBoard into a Prolog Board
     */
    toProlog() {
        var board = [];
        var piece;
        var symbol;
        for (var tile = 0; tile < this.tiles.length; ++ tile) {
            piece = this.tiles[tile].getPiece();
            if      (      piece      ==  null ) {
                symbol = ' ';
            }
            else if (piece.getColor() ==  'red') {
                symbol = 'X';
            }
            else if (piece.getColor() == 'blue') {
                symbol = 'O';
            }
            else {
                console.log("Error in Piece Color.\n");
            }
            board.push(symbol);
        }
    }
}
