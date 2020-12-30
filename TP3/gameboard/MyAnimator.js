/**
 * MyAnimator
 * @description Manages the Animation of a Game Sequence
 */
class MyAnimator extends CGFobject {
    constructor(scene, gameOrchestrator) {
        super(scene);
        this.gameOrchestrator = gameOrchestrator;
        this.startTime = 0;
        this.finished = false;
    }

    /**
     * Resets Animation
     */
    reset() {}

    /**
     * Starts Animation
     */
    start() {}

    /**
     * Finish Animation
     */
    finish() {
        return this.finished;
    }

    /**
     * Obtains Elapsed Time
     * @param {time} t - current time
     */
    getDeltaTime(t) {
        t = t / 1000;

        /* verify if it's the first call -> if it's the first, change init to current time */
        if (this.startTime == 0) { this.startTime = t; }
        
        /**
         * delta_time -> animation's elapsed time
         * elapsed time = actual time - init time
         * for example: first call -> deltaTime = 0
         */
        var deltaTime = t - this.startTime;
        return deltaTime;
    }

    /**
     * Updates Animation
     * @param {time} t - current time
     */
    update(t) {}

    /**
     * Display Animation
     * Optionally can look at the orchestrator to stop current animation.
     */
    display() {}
}