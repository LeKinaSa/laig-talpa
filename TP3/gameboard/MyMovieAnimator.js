/**
 * MyMovieAnimator
 * @description
 */
class MyMovieAnimator extends MyAnimator {
    constructor(scene, gameOrchestrator, sequence, initialBoard) {
        super(scene, gameOrchestrator);
        this.sequence = sequence; // List of MyAnimator
        this.active = null;
        this.index = -1;
        this.initialBoard = initialBoard;
    }

    start() {
        this.gameOrchestrator.gameboard = this.initialBoard;
    }

    startNewAnimator() {
        ++ this.index;
        if (this.index < this.sequence.length) {
            this.active = this.sequence[this.index];
            this.active.reset();
            this.active.start();
            var pos = this.active.positions;
            var initialTile  = this.gameOrchestrator.gameboard.getTile(pos[0][0], pos[0][1]);
            var  finalTile   = this.gameOrchestrator.gameboard.getTile(pos[1][0], pos[1][1]);
            this.initialPiece = this.gameOrchestrator.gameboard.getPiece(initialTile);
            this.finalPiece   = this.gameOrchestrator.gameboard.getPiece(  finalTile);
            if (this.initialPiece != null) { this.initialPiece.startMovement(); }
            if (  this.finalPiece != null) {   this.finalPiece.startMovement(); }
        }
        else {
            this.finished = true;
        }
    }

    update(t) {
        if (this.active == null) {
            this.startNewAnimator();
        }

        if (this.finish()) {
            return;
        }
        else {
            this.active.update(t);
            if (this.active.finish()) {
                this.active = null;
                if (this.initialPiece != null) { this.initialPiece.finishMovement(); }
                if (  this.finalPiece != null) {   this.finalPiece.finishMovement(); }
            }
        }
    }

    display() {
        if (this.active != null) {
            this.active.display();
        }
    }

}