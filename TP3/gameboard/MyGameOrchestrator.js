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
        this.animator = new MyAnimator(scene, this);
        this.gameboard = new MyGameboard(scene);
        this.gameSequence = new MyGameSequence(scene);
        //this.theme = new MyScenegraph(…);
        //this.prolog = new MyPrologInterface(…);
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
}