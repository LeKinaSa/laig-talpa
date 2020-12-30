/**
 * MyMoveAnimator
 * @description Class that defines the animations for the moves
 */
class MyMoveAnimator extends MyAnimator {
    constructor(scene, gameOrchestrator) {
        super(scene, gameOrchestrator);
        this.pieces    = []; // pieces involved in the move
        this.ids       = []; // Ids of the Pieces involved in the move
        this.positions = []; // Positions of the Pieces involved in the move
        this.totalTime = 1;
        this.currentPosition = [0, 0]; // Position = [column, line]
    }

    /**
     * Calculate Position of the Involved Pieces
     * Based on Id
     * Id Calculation : (line - 1) * 8 + (column - 1)
     */
    calculatePositions() {
        var originId = this.ids[0];
        var destinId = this.ids[1];

        var originPosition   = [originId % 8 + 1, Math.floor(originId / 8) + 1];
        var destinPosition   = [destinId % 8 + 1, Math.floor(destinId / 8) + 1];
        this.positions       = [originPosition, destinPosition];
        console.log(this.positions);
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
        this.pieces[0] = pieces[0];
        this.pieces[1] = pieces[1];
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
        this.gameOrchestrator.gameboard.movePieceByPosition(this.positions[0][0], this.positions[0][1],
                                                            this.positions[1][0], this.positions[1][1]);
        return true;
    }
    
    /**
     * Updates Animation
     * @param {time} t - current time
     */
    update(t) {
        var deltaTime = this.getDeltaTime(t);

        if (deltaTime >= this.totalTime) {
            this.currentPosition = this.positions[1];
            this.finished = true;
            return;
        }

        // Portion of the Animation that has elapsed
        var elapsedAnimation = deltaTime / this.totalTime;
        
        // Animation Based on elapsedAnimation
        // Update the Value on this.currentPosition
        var initialPosition = this.positions[0];
        var  finalPosition  = this.positions[1];
        this.currentPosition[0] = initialPosition[0] + elapsedAnimation * (finalPosition[0] - initialPosition[0]);
        this.currentPosition[1] = initialPosition[1] + elapsedAnimation * (finalPosition[1] - initialPosition[1]);
    }

    /**
     * Display Animation
     */
    display() {
        this.scene.pushMatrix();

        var column = this.currentPosition[0];
        var  line  = this.currentPosition[1];
        // Translation According to the Current Position on the Board
        this.scene.translate(4.5 - line, 0, 4.5 - column);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);

        this.pieces[0].display();

        this.scene.popMatrix();
    }
}