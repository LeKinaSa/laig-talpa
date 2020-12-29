/**
 * MyMoveAnimator
 * @description Class that defines the animations for the moves
 */
class MyMoveAnimator extends MyAnimator {
    constructor(scene, gameOrchestrator, move) {
        super(scene, gameOrchestrator);
        this.move = move;
        this.pieces    = []; // pieces involved in the move
        this.ids       = []; // Ids of the Pieces involved in the move
        this.positions = []; // Positions of the Pieces involved in the move
        this.totalTime = 2;
        this.currentPosition = [0, 0]; // Position = [column, line]
    }

    /**
     * Calculate Position of the Involved Pieces
     * Based on Id
     * Id Calculation : (line - 1) * 8 + column
     */
    calculatePositions() {
        var originId = this.ids[0];
        var destinId = this.ids[1];

        var originPosition = [originId % 8, Math.floor(originId / 8) + 1];
        var destinPosition = [destinId % 8, Math.floor(destinId / 8) + 1];

        this.positions = [originPosition, destinPosition];
        this.currentPosition = originPosition;
    }

    /**
     * Resets Animation
     */
    reset() {}

    /**
     * Starts Animation
     */
    start(pieces, ids) {
        this.pieces = pieces;
        this.ids = ids;

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
        return true;
    }
    
    /**
     * Updates Animation
     * @param {time} t - current time
     */
    update(t) {
        var deltaTime = getDeltaTime(t);

        // Portion of the Animation that has elapsed
        var elapsedAnimation = deltaTime / this.totalTime;
        
        //TODO: make animation based on elapsedAnimation
        // update the value on this.currentPosition
    }

    /**
     * Display Animation
     */
    display() {
        var column =     this.currentPosition[0];
        var  line  = 9 - this.currentPosition[1];
        // Translation According to the Current Position on the Board
        this.scene.translate(4.5 - line, 0, 4.5 - column);
    }
}