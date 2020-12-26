/**
 * MyGameOrchestrator
 * @description Manages the entire game
 * 
 * Load of new scenes
 * Manage gameplay (game states)
 * Manages undo
 * Manages movie play
 * Manage object selection
 */
class MyGameOrchestrator extends CGFobject{
    constructor(scene){
        super(scene);
        this.animator = new MyAnimator(scene, this);
        this.gameboard = new MyGameBoard(scene);
        this.gameSequence = new MyGameSequence(scene);
        //this.theme = new MyScenegraph(…);
        this.prolog = new MyPrologConnection();
    }

    /**
     * Updates animation
     * @param {*} time current time
     */
    update(time){
        this.animator.update(time);
    }

    display(){
        //this.theme.display();
        this.animator.display();
        this.gameboard.display();
    }

    onHandshakeSuccess(){
        console.log("Success");
    }

    onHandshakeFailure(){
        console.log("Error");
    }

    makeRequest(){
        let context = this;
        this.prolog.sendPrologRequest("handshake", context.onHandshakeSuccess, context.onHandshakeFailure );
    }
}