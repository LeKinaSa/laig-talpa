/**
 * MyAnimator
 * @description Manages the animation of a game sequence
 */
class MyAnimator extends CGFobject{
    constructor(scene, gameOrchestrator){
        super(scene);
        this.gameOrchestrator = gameOrchestrator;
    }

    /**
     * Resets animation
     */
    reset(){}

    /**
     * Starts animation
     */
    start(){}

    /**
     * Updates animation
     * @param {*} time current time
     */
    update(time){}

    /**
     * Display Animation
     * Optionally can look at the orchestrator to stop current animation.
     */
    display(){}
}