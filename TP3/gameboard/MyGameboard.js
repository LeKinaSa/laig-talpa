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
    }

    addPiece(tile) {

    }

    removePiece(tile) {

    }

    getPiece(tile) {
        // return piece;
    }

    getTile(piece){
        // return tile;
    }

    getTile(x, y) {
        // return tile;
    }

    movePiece(piece, startingTile, destinationTile) {

    }

    display() {
        for (var i = 0; i < this.tiles.length; ++ i) {
            this.tiles[i].display();
        }
    }
}