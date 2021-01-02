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
            }
        }
    }

    display() {
        if (this.active != null) {
            this.active.display();
        }
    }

}