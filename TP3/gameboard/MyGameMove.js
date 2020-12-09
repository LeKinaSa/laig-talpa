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
        var column     = this.originTile.position[0];
        var line       = this.originTile.position[1];
        
        var direction;
        if (this.destinationTile == null) {
            direction = 'x';
        }

        var nextColumn = this.destinationTile.position[0];
        var nextLine   = this.destinationTile.position[1];
        
        if     (column < nextColumn) {
            direction = 'r';
        }
        else if (column > nextColumn) {
            direction = 'l';
        }
        else if ( line  <  nextLine ) {
            direction = 'u';
        }
        else if ( line  >  nextLine ) {
            direction = 'd';
        }
        return [column, line, direction];
    }
}
