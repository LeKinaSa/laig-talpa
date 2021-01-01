/**
 * MyMovieAnimator
 * @description
 */
class MyMovieAnimator extends MyAnimator {
    constructor(scene, gameOrchestrator, sequence) {
        super(scene, gameOrchestrator);
        this.sequence = sequence; // List of MyAnimator
        this.index = -1;
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

        if (this.finished) {
            return;
        }

        this.active.update(t);
    }

    display() {
        if (this.active != null) {
            this.active.display();
        }
    }

}