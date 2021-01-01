/**
 * MyGameSequence
 * @description Stores the a sequence of game moves (MyGameMove objects)
 */
class MyGameSequence extends CGFobject {
    constructor(scene){
        super(scene);
        this.sequence = [];
        this.moveAnimators = [];
    }

    /**
     * Returns the sequence of game moves
     */
    getSequence() {
        return this.sequence;
    }

    /**
     * Returns the sequence of game moves
     */
    getMoveAnimators() {
        return this.moveAnimators;
    }

    /**
     * Adds a game move to the sequence
     * @param {GameMove} gameMove 
     */
    addGameMove(gameMove) {
        this.sequence.push(gameMove);
    }

    /**
     * Adds a game move to the sequence
     * @param {GameMove} gameMove 
     */
    addMoveAnimator(moveAnimator) {
        this.moveAnimators.push(moveAnimator);
    }

    /**
     * Manage undo
     */
    undo() {
        // TODO
    }

    /**
     * Feeds move replay
     */
    moveReplay() {
        console.log(this.moveAnimators);
        /* if (this.currentMove == this.sequence.length) {
            this.scene.gameOrchestrator.gameBoard = this.sequence[0].board;
            this.scene.interface.currentCameraId = this.scene.graph.defaultCameraId;
        } else {
            this.currentMove++;
        } */
    }


}