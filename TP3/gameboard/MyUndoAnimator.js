/**
 * MyMoveAnimator
 * @description Class that defines the animations for the moves
 */
class MyUndoAnimator extends MyMoveAnimator {
    constructor(scene, gameOrchestrator) {
        super(scene, gameOrchestrator);
        this.move      = null;  // Move that will be undo
    }

    /**
     * Obtains the initial and final positions for the Piece to be removed
     * Based on Id
     * Id Calculation : (line - 1) * 8 + (column- 1)
     */
    calculateRemovingPiecePositions() {
        // Move from Outside the Board to Destination Id
        var removingPieceId = this.ids[0];  // Destination Id
        var position = [removingPieceId % 8 + 1, Math.floor(removingPieceId / 8) + 1];
        var outsideBoardPos = [0, 5, 0]; // TODO
        this.removingPositions = [[outsideBoardPos[0], outsideBoardPos[1], outsideBoardPos[2]],
                                  [       position[0],          0        ,        position[1]]]; 
        this.removingCurrentPosition = this.removingPositions[0];
    }

    /**
     * Starts Animation
     */
    start(move, pieces) {
        this.move = move;
        this.pieces[0] = pieces[0]; //  Moving  Piece
        this.pieces[1] = pieces[1]; // Removing Piece
        this.ids = [this.move.destinId, this.move.originId];

        this.calculatePositions();

        this.pieces[0].startMovement();
        this.pieces[1].startMovement();
    }

    /**
     * Finish Animation
     */
    finish() {
        if (!this.finished) {
            return false;
        }
        this.pieces[0].finishMovement();
        this.pieces[1].finishMovement();
        this.gameOrchestrator.gameboard.toJS(this.move.initialBoard);
        this.gameOrchestrator.player = this.move.player;
        return true;
    }
}