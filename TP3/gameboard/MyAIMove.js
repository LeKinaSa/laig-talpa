class MyAIMove {
    constructor(scene, dimensions, gameBoard, moveParameters) {
        this.scene = scene;
        this.dimensions = dimensions;
        this.gameBoard = gameBoard;
        this.column    = parseInt(moveParameters[0]);
        this.line      = parseInt(moveParameters[1]);
        this.direction =          moveParameters[2];
        this.calculateIds();
        this.findPieces();
        console.log([this.column, this.line, this.direction]);
    }

    /**
     * Calculate Position of the Piece
     * Based on Id
     * Id Calculation : (line - 1) * dimensions + (column - 1)
     * @param {*} id 
     */
    calculatePosition(id) {
        return [id % this.dimensions + 1, Math.floor(id / this.dimensions) + 1];
    }

    calculateIds() {
        var originId = (this.line - 1) * this.dimensions + (this.column - 1);
        console.log(originId);
        var destinId = originId;
        switch (this.direction) {
            case 'u':
                destinId = originId + this.dimensions;
                break;
            case 'd':
                destinId = originId - this.dimensions;
                break;
            case 'r':
                destinId = originId + 1;
                break;
            case 'l':
                destinId = originId - 1;
                break;
            case 'x':
                destinId = originId;
                break;
            default:
                console.log("Error with AI Play.");
                break;
        }
        console.log(destinId);
        this.ids = [originId, destinId];
    }

    findPieces() {
        var originPos = this.calculatePosition(this.ids[0]);
        var destinPos = this.calculatePosition(this.ids[1]);
        var originTile = this.gameBoard.getTile(originPos[0], originPos[1]);
        var destinTile = this.gameBoard.getTile(destinPos[0], destinPos[1]);
        var originPiece = originTile.getPiece();
        var destinPiece = destinTile.getPiece();
        this.pieces = [originPiece, destinPiece];
    }

    getPieces() {
        return this.pieces;
    }

    getIds() {
        return this.ids;
    }
}
