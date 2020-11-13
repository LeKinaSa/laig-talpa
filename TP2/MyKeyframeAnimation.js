const DEGREE_TO_RADIANS = Math.PI / 180;

/**
 * MyKeyframeAnimation class: represents all the keyframes from an animation
**/
class MyKeyframeAnimation extends MyAnimation {
    /**
     * @constructor
     */
    constructor(scene) {
        super(scene);
        this.keyframes = []; // list with all the keyframes from the animation
        this.addKeyframe(new MyKeyframe(scene, 0, [0, 0, 0], [0, 0, 0], [1, 1, 1]));
        this.currentState = mat4.create();
        this.initTime = 0;
    }

    // Adds a keyframe to the keyframes list
    addKeyframe(keyframe) {
        // Keyframe class - aux class to create the Keyframes
        this.keyframes.push(keyframe);
        this.keyframes.sort((a, b) => (a.instant > b.instant) ? 1 : -1);
    }
    
    update(t) {
        t = t / 1000;
        // verify if it's the first call -> if it's the first, change init to current time
        
        if (this.initTime == 0) {
            this.initTime = t;
        }

        /**
         * delta_time -> animation's elapsed time
         * elapsed time = actual time - init time
         * for example: first call -> deltaTime = 0
         */
        var delta_time = t - this.initTime;

        
        /**
         * the delta_time needs to be between the initial and the final instants of the animation
         */
        if ((delta_time < this.keyframes[0].instant)
         || (delta_time > this.keyframes[this.keyframes.length - 1].instant)) {
           return;
        }

        /**
         * identify the indexes from the frames needed to represent the object on the screen
         * if delta_time matches one of the frame instants, then the position is the same as the frame
         * if it doesn't, then we look for the frames exactly before and after the delta_time
         */
        var kf1_index, kf2_index, kf_index = -1;
        for (var i = 0; i < this.keyframes.length; ++ i) {
            if (this.keyframes[i].instant == delta_time) {
                kf_index = i;
                break;
            }
            else if (this.keyframes[i].instant > delta_time) {
                kf2_index = i;
                kf1_index = i - 1;
                break;
            }
        }

        var T = [0, 0, 0];
        var R = [0, 0, 0];
        var S = [1, 1, 1];

        if (kf_index != -1) {
            var kf = this.keyframes[kf_index];
            T = kf.translation;
            S = kf.scale;
            vec3.scale(R, kf.rotation, DEGREE_TO_RADIANS);
        }
        else {
            // Interpolations
            var kf1 = this.keyframes[kf1_index];
            var kf2 = this.keyframes[kf2_index];
            
            /**
             *                    INTERPOLATION (BETWEEN 2 KEYFRAMES)
             *                     X = Xi + XTtotal * Telapsed/Ttotal
             * X:        current value
             * Xi:       initial value
             * XTotal:   value between initial/end time
             * Telapsed: time from start until now
             * Ttotal:   total animation time
             */

            var elapsedTime = delta_time  - kf1.instant;
            var totalTime   = kf2.instant - kf1.instant;

            // Translation
            T = vec3.lerp(T, kf1.translation, kf2.translation, elapsedTime/totalTime);
        
            // Rotation
            var R1 = [0, 0, 0]; vec3.scale(R1, kf1.rotation, DEGREE_TO_RADIANS);
            var R2 = [0, 0, 0]; vec3.scale(R2, kf2.rotation, DEGREE_TO_RADIANS);
            R = vec3.lerp(R, R1, R2, elapsedTime/totalTime);

            // Scale
            S = vec3.lerp(S, kf1.scale, kf2.scale, elapsedTime/totalTime);    
        }

        
        // Update current state
        var axis = [[1, 0, 0],
                    [0, 1, 0],
                    [0, 0, 1]];
        this.currentState = mat4.create();
        mat4.translate(this.currentState, this.currentState, T);
        mat4.rotate   (this.currentState, this.currentState, R[0], axis[0]);
        mat4.rotate   (this.currentState, this.currentState, R[1], axis[1]);
        mat4.rotate   (this.currentState, this.currentState, R[2], axis[2]);
        mat4.scale    (this.currentState, this.currentState, S);
    }

    apply() {
        this.scene.multMatrix(this.currentState);
    }

}
