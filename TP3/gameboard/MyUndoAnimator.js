/**
 * MyUndoAnimator
 * @description Class that defines the animations for the undo moves
 */
class MyUndoAnimator extends MyMoveAnimator {
    constructor(scene, gameOrchestrator, move, pieces) {
        super(scene, gameOrchestrator, pieces, []);
        this.move = move;
        this.ids = [this.move.destinId, this.move.originId];
    }

    /**
     * Obtains the initial and final positions for the Piece to be removed
     * Based on Id
     * Id Calculation : (line - 1) * 8 + (column - 1)
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
     * Finish Animation
     */
    finish() {
        if (!this.finished) {
            return false;
        }
        this.pieces[0].finishMovement();
        this.pieces[1].finishMovement();
        this.gameOrchestrator.gameboard.toJS(this.move.getInitialBoard());
        this.gameOrchestrator.player = this.move.player;
        return true;
    }
}