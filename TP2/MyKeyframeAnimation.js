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
        this.addKeyframe(new MyKeyframe(scene, 0, [0,0,0], [0,0,0], [1,1,1]));
        this.currentState = mat4.create();
        this.init = 0;
        this.previous = 0;
    }

    // Adds a keyframe to the keyframes list
    addKeyframe(instant, translation, rotation, scale){
        // Keyframe class - aux class to create the Keyframes
        this.keyframes.push(new MyKeyframe(instant, translation, rotation, scale));
        this.keyframes.sort((a, b) => (a.instant > b.instant) ? 1 : -1);
    }

    update(t) {
        // verify if it's the first call -> if it's the first, change init to current time
        if(this.init == 0){
            this.init = t;
            this.previous = t;
        }

        /*
        * delta_time -> animation's elapsed time
        * elapsed time = actual time - init time
        * for example: first call -> deltaTime = 0
        */
        var delta_time = t - this.init;

        /*
        *  go through all frames; if the keyframe's instant is > than elapsed time, treat the
        *  keyframe
        */
        var aux = -1;
        for(var i = 0; i < this.keyframes.length; i++){
            if(this.keyframes[i].instant > delta_time)
                aux = i;
                break;
        }

        /*
        *  if there's no keyframe with instant bigger than elapsed time, no keyframe should
        *  be processed
        */
        if (aux == -1) return;

        // else -> iterpolations
        var kf1 = this.keyframes[aux-1];
        var kf2 = this.keyframes[aux];

        /*
        *  delta_last_call -> time elapsed since the last time the function was called
        *  delta_lasst_call = current time - time from the previous call
        */
        var delta_last_call = t - this.previous;

        /* 
        * n -> "divisions"; number of times update is called betweern the keyframes
        * used to help with interpolations
        * n = instant from the current keyframe - instant from the keyframe before (elapsed
        * time between keyframes) / time elapsed since the last time the function was called
        * 
        * used to calculate scale
        */
        var n = (kf2.instant - kf1.instant)/(delta_last_call);

        /* 
        * count_n -> "counts" the number of times the function was called since the instant
        * from the keyframe before
        * count_n = animation's elapsed time - instant from the previous keyframe / time
        * elapsed since the last time the function was called
        * 
        * used to calculate scale
        */
        var count_n = (delta_time - kf1.instant)/delta_last_call;

        /*
        *                               INTERPOLATION
        *                     X = Xi + XTtotal * Telapsed/TTotal
        * X:        current value
        * Xi:       initial value
        * XTotal:   value between initial/end time
        * Telapsed: time from start until now
        * TTotal:   total animation time
        */
        var T = [0,0,0];
        var R = [0,0,0];
        var S = [1,1,1];

        // Translation
        
        /*T[0] = kf1.translation[0] + (kf2.translation[0] - kf1.translation[0]) * (delta_time - kf1.instant)/(kf2.instant-kf1.instant);
        T[1] = kf1.translation[1] + (kf2.translation[1] - kf1.translation[1]) * (delta_time - kf1.instant)/(kf2.instant-kf1.instant);
        T[2] = kf1.translation[2] + (kf2.translation[2] - kf1.translation[2]) * (delta_time - kf1.instant)/(kf2.instant-kf1.instant);*/
        T = vec3.lerp(T, kf1.translation, kf2.translation, (delta_time - kf1.instant)/(kf2.instant-kf1.instant));
        // Rotation
        /*R[0] = kf1.rotation[0] * DEGREE_TO_RAD + (kf2.rotation[0] - kf1.rotation[0]) * DEGREE_TO_RAD * (delta_time - kf1.instant)/(kf2.instant-kf1.instant);
        R[1] = kf1.rotation[1] * DEGREE_TO_RAD + (kf2.rotation[1] - kf1.rotation[1]) * DEGREE_TO_RAD * (delta_time - kf1.instant)/(kf2.instant-kf1.instant);
        R[2] = kf1.rotation[2] * DEGREE_TO_RAD + (kf2.rotation[2] - kf1.rotation[2]) * DEGREE_TO_RAD * (delta_time - kf1.instant)/(kf2.instant-kf1.instant);*/

        R = vec3.lerp(R, kf1.rotation * DEGREE_TO_RAD, kf2.rotation * DEGREE_TO_RAD, (delta_time - kf1.instant)/(kf2.instant-kf1.instant));

        /*
        * Scale - exponential
        * 
        * the value for scale is equal to kf1 * ((kf2/kf1)^^(1/n))^^count_n
        *   EXCEPTION, if one of them is negative, calculate the difference
        * between them 
        *  
        * example 1, kf1.scale[0] = 1, kf2.scale[0] = 2;
        * S[0] = 1 * ((2/1)^^(1/n))^^count_n
        * 
        * example 2, kf1.scale[0] = -2, kf2.scale[0] = 1;
        * difference = 1 - (-2) = 3;
        * kf1_x = -2 + 3 = 1;A
        * kf2_x = 1 + 3 = 4;
        * S[0] = 1 * ((4/1)^^(1/n))^^count_n - 3
        */

       // Scale
       S = vec3.lerp(S, kf1.scale, kf2.scale, (delta_time - kf1.instant)/(kf2.instant-kf1.instant));
        
       /*
        // Scale X
        if((kf2.scale[0] * kf1.scale[0]) <= 0){
            var difference = 1 - Math.min(kf2.scale[0], kf1.scale[0]);
            var kf1_x = kf1.scale[0] + difference;
            var kf2_x = kf2.scale[0] + difference;
            S[0] = kf1_x * Math.pow(Math.pow(kf2_x/kf1_x,1/n), count_n) - difference;
        }
        else S[0] = kf1.scale[0] * Math.pow(Math.pow(kf2.scale[0]/kf1.scale[0], 1/n), count_n);

        // Scale Y
        if((kf2.scale[1] * kf1.scale[1]) <= 0){
            var difference = 1 - Math.min(kf2.scale[1], kf1.scale[1]);
            var kf1_y = kf1.scale[1] + difference;
            var kf2_y = kf2.scale[1] + difference;
            S[1] = kf1_y * Math.pow(Math.pow(kf2_y/kf1_y,1/n), count_n) - difference;
        }
        else S[1] = kf1.scale[1] * Math.pow(Math.pow(kf2.scale[1]/kf1.scale[1], 1/n), count_n);

        // Scale Z
        if((kf2.scale[2] * kf1.scale[2]) <= 0){
            var difference = 1 - Math.min(kf2.scale[2], kf1.scale[2]);
            var kf1_z = kf1.scale[2] + difference;
            var kf2_z = kf2.scale[2] + difference;
            S[2] = kf1_z * Math.pow(Math.pow(kf2_z/kf1_z,1/n), count_n) - difference;
        }
        else S[2] = kf1.scale[2] * Math.pow(Math.pow(kf2.scale[2]/kf1.scale[2], 1/n), count_n);
        */

        // Update current state
        this.currentState = mat4.create();
        mat4.translate(this.currentState, this.currentState, ...T);
        mat4.rotate(this.currentState, this.currentState, ...R);
        mat4.scale(this.currentState, this.currentState, ...S);

        // previous = last time update(t) was called
        this.previous = t;
    }

    apply(){
        this.scene.multMatrix(this.currentState);
    }

}
