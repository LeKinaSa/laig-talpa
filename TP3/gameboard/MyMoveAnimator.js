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
        this.movingCurrentPosition   = [0, 0]; // Position = [column, line]
        this.removingCurrentPosition = [0, 0]; // Position = [column, line]
    }

    /**
     * Calculate Positions needed for the Animation
     */
    calculatePositions() {
        if (this.ids[0] != this.ids[1]) {
            this.calculateMovingPiecePositions();
        }
        this.calculateRemovingPiecePositions();
    }

    /**
     * Calculate Position of the Involved Pieces (Moving)
     * Based on Id
     * Id Calculation : (line - 1) * 8 + (column - 1)
     */
    calculateMovingPiecePositions() {
        // Move from Id 0 to Id 1
        //    Origin   to Destination if Move
        // Destination to    Origin   if Undo
        var originId = this.ids[0];
        var destinId = this.ids[1];

        var originPosition   = [originId % 8 + 1, Math.floor(originId / 8) + 1];
        var destinPosition   = [destinId % 8 + 1, Math.floor(destinId / 8) + 1];
        this.positions       = [[originPosition[0], originPosition[1]],
                                [destinPosition[0], destinPosition[1]]];
        this.movingCurrentPosition = originPosition;
    }

    /**
     * Obtains the initial and final positions for the Piece to be removed
     * Based on Id
     * Id Calculation : (line - 1) * 8 + (column- 1)
     */
    calculateRemovingPiecePositions() {
        // Move from Destination Id to Outside the Board
        var removingPieceId = this.ids[1];  // Destination Id
        var position = [removingPieceId % 8 + 1, Math.floor(removingPieceId / 8) + 1];
        var outsideBoardPos = [-10, -10, -10]; // TODO
        this.removingPositions = [[       position[0],          0        ,        position[1]],
                                  [outsideBoardPos[0], outsideBoardPos[1], outsideBoardPos[2]]]; 
        this.removingCurrentPosition = this.removingPositions[0];
    }

    /**
     * Resets Animation
     */
    reset() {}

    /**
     * Starts Animation
     */
    start(pieces, ids) {
        this.pieces[0] = pieces[0]; //  Moving  Piece
        this.pieces[1] = pieces[1]; // Removing Piece
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
        if (this.ids[0] != this.ids[1]) {
            this.gameOrchestrator.gameboard.movePieceByPosition(this.positions[0][0], this.positions[0][1],
                                                                this.positions[1][0], this.positions[1][1]);
        }
        else {
            this.gameOrchestrator.gameboard.removePieceByPosition(this.positions[0][0], this.positions[0][1]);
        }
        return true;
    }
    
    /**
     * Updates Animation
     * @param {time} t - current time
     */
    update(t) {
        if (this.ids[0] != this.ids[1]) {
            this.updateMovingPiece(t);
        }
        this.updateRemovingPiece(t);
    }

    /**
     * Updates Animation for the Moving Piece
     * @param {time} t - current time
     */
    updateMovingPiece(t) {
        var deltaTime = this.getDeltaTime(t);

        if (deltaTime >= this.totalTime) {
            this.movingCurrentPosition = this.positions[1];
            this.finished = true;
            return;
        }

        // Portion of the Animation that has elapsed
        var elapsedAnimation = deltaTime / this.totalTime;
        
        // Animation Based on elapsedAnimation
        // Update the Value on this.movingCurrentPosition
        var initialPosition = this.positions[0];
        var  finalPosition  = this.positions[1];
        this.movingCurrentPosition[0] = initialPosition[0] + elapsedAnimation * (finalPosition[0] - initialPosition[0]);
        this.movingCurrentPosition[1] = initialPosition[1] + elapsedAnimation * (finalPosition[1] - initialPosition[1]);
    }

    /**
     * Updates Animation for the Moving Piece
     * @param {time} t - current time
     */
    updateRemovingPiece(t) {
        // TODO - piece will have to jump out of the board
    }

    /**
     * Display Animation
     */
    display() {

        // Moving Piece
        if (this.ids[0] != this.ids[1]) {
            this.scene.pushMatrix();

            var column = this.movingCurrentPosition[0];
            var  line  = this.movingCurrentPosition[1];
            // Translation According to the Current Position on the Board
            this.scene.translate(4.5 - line, 0, 4.5 - column);
            this.scene.rotate(-Math.PI/2, 1, 0, 0);

            this.pieces[0].display();

            this.scene.popMatrix();
        }

        // Removing Piece
        this.scene.pushMatrix();
        this.pieces[1].display();
        this.scene.popMatrix();
    }
}