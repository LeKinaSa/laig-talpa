/**
 * MyKeyframeAnimation class: represents all the keyframes from an animation
**/
class MyKeyframeAnimation extends MyAnimation {
    /**
     * @constructor
     */
    constructor(scene, update) {
        super(scene, update);
        this.keyframes = []; // list with all the keyframes from the animation
        this.matrix = mat4.create();
    }

    // Adds a keyframe to the keyframes list
    addKeyframe(instant, translation, rotation, scale){
        // Keyframe class - aux class to create the Keyframes
        this.keyframes.push(new Keyframe(instant, translation, rotation, scale));
    }

    updateAnimation(t) {
        // Build new Animation Matrix
        this.matrix = mat4.create();
        var T = [0,0,0]; // translation
        var R = [0,0,0]; // rotation
        var S = [1,1,1]; // scale

        for(let i in this.keyframes){
            // if the current time is after the instant from the keyframe that we are analysing
            if(t > this.keyframes[i].instant){
                // Get translation vector from the keyframe
                T[0] = this.keyframes[i].translation[0];
                T[1] = this.keyframes[i].translation[1];
                T[2] = this.keyframes[i].translation[2];
                // Get rotation vector from the keyframe
                R[0] = this.keyframes[i].rotation[0];
                R[1] = this.keyframes[i].rotation[1];
                R[2] = this.keyframes[i].rotation[2];
                // Get scale vector from the keyframe
                S[0] = this.keyframes[i].scale[0];
                S[1] = this.keyframes[i].scale[1];
                S[2] = this.keyframes[i].scale[2];
            }
            else{
                var partial_time = this.keyframes[i].instant;
                // for iterations exccept the 1st one... (1st one is always 0 because it's the
                // beginning of the animation)
                if(i != 0){
                    partial_time -= this.keyframes[i-1].instant;
                    t -= this.keyframes[i-1].instant;
                }
            }
        }
        
        // Interpolate Translation
        // TODO

        // Interpolate Rotation
        // TODO

        // Interpolate Scale
        // TODO
    }

}
