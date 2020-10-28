/**
 * MyKeyframeAnimation class: represents all the keyframes from an animation
**/
class MyKeyframeAnimation extends MyAnimation {
    /**
     * @constructor
     * @param {list of key frames} keyframes - list of all the key frames in this animation
     */
    constructor(keyframes) {
        this.keyframes = keyframes;
        this.current_t = 0;
    }

    updateAnimation(t) {
        var initial_t; // TODO -> possibly from MyAnimation
        var delta_t = t - initial_t;
        this.current_t = this.current_t + delta_t;

        var current_keyframe; // TODO
        var next_keyframe; // TODO

        var partial_time = this.current_t - current_keyframe.instant;

        // Interpolate Translation
        // TODO

        // Interpolate Rotation
        // TODO

        // Interpolate Scale
        // TODO

        // Build new Animation Matrix
        this.matrix; // TODO
    }

}
