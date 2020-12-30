/**
 * MyGameSequence
 * @description Stores the a sequence of game moves (MyGameMove objects)
 */
class MyGameSequence extends CGFobject {
    constructor(scene){
        super(scene);
        this.sequence = [];
    }

    /**
     * Returns the sequence of game moves
     */
    getSequence() {
        return this.sequence;
    }

    /**
     * Adds a game move to the sequence
     * @param {GameMove} gameMove 
     */
    addGameMove(gameMove) {
        this.sequence.push(gameMove);
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
        if (this.currentMove == this.sequence.length) {
            this.scene.gameOrchestrator.gameBoard = this.sequence[0].board;
            this.scene.interface.currentCameraId = this.scene.graph.defaultCameraId;
        } else {
            this.currentMove++;
        }
    }


}