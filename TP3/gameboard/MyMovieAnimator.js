/**
 * MyMovieAnimator
 * @description
 */
class MyMovieAnimator extends MyAnimator {
    constructor(scene, gameOrchestrator, sequence) {
        super(scene, gameOrchestrator);
        this.sequence = sequence; // list of MyMoveAnimator
    }

    start(){
        this.reset();

        for(let i = 0; i < this.sequence.length; i++){
            this.sequence[i].reset();
            this.sequence[i].start();
        }
    }

}