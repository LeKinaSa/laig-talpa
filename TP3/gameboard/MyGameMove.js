class MyGameMove {
    constructor (movedPiece, originTile, destinationTile, initialGameState) {
        this.movedPiece       = movedPiece;
        this.originTile       = originTile;
        this.destinationTile  = destinationTile;
        this.initialGameState = initialGameState;
    }

    animate() {

    }

    toProlog() {
        var column  = 0;
        var line = 0;
        var direction = 0;
        return [column, line, direction];
    }
}
