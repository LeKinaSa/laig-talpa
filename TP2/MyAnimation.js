/**
 * MyAnimation class: represents an animation
**/
class MyAnimation {
    /**
     * @constructor
     * @abstract
     * @param {CGFscene} scene
     */
    constructor(scene) {
        this.scene        = scene;
        this.startTime    = 0;
        this.endTime      = 0;
        this.initTransf   = [[0, 0, 0],
                             [0, 0, 0],
                             [1, 1, 1]];
        this.finalTransf  = [[0, 0, 0],
                             [0, 0, 0],
                             [1, 1, 1]];
    }

    changeInitTransf(translate, rotate, scale) {
        this.initTransf = [translate, rotate, scale];
    }

    changeFinalTransf(translate, rotate, scale) {
        this.finalTransf = [translate, rotate, scale];
    }

    update(t) {}

    apply() {}
}

    