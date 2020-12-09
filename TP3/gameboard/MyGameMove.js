class MyGameMove extends MyMove {
    constructor (movedPiece, originTile, destinationTile, initialGameState) {
        super(initialGameState);        
        this.movedPiece       = movedPiece;
        this.originTile       = originTile;
        this.destinationTile  = destinationTile;
    }

    animate() {

    }

    toProlog() {
        var column     = this.originTile.getColumn();
        var line       = this.originTile.getLine();
        
        var direction;
        if (this.destinationTile == null) {
            direction = 'x';
        }

        var nextColumn = this.destinationTile.getColumn();
        var nextLine   = this.destinationTile.getLine();
        
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
