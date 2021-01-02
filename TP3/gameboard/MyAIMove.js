class MyAIMove extends MyGameMove {
    constructor(scene, dimensions, initialBoard, player, gameBoard, moveParameters) {
        super(scene, dimensions, initialBoard, player);
        this.gameBoard = gameBoard;
        this.column    = parseInt(moveParameters[0]);
        this.line      = parseInt(moveParameters[1]);
        this.direction =          moveParameters[2];
        this.calculateIds();
        this.findPieces();
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
        this.originId = (this.line - 1) * this.dimensions + (this.column - 1);
        this.destinId = this.originId;
        switch (this.direction) {
            case 'u':
                this.destinId = this.originId + this.dimensions;
                break;
            case 'd':
                this.destinId = this.originId - this.dimensions;
                break;
            case 'r':
                this.destinId = this.originId + 1;
                break;
            case 'l':
                this.destinId = this.originId - 1;
                break;
            case 'x':
                this.destinId = this.originId;
                break;
            default:
                console.log("Error with AI Play.");
                break;
        }
    }

    findPieces() {
        var originPos = this.calculatePosition(this.originId);
        var destinPos = this.calculatePosition(this.destinId);
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
        return [this.originId, this.destinId];
    }
}
