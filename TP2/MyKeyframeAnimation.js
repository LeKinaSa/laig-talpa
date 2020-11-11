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
        this.final = 0;
    }

    // Adds a keyframe to the keyframes list
    addKeyframe(keyframe){
        // Keyframe class - aux class to create the Keyframes
        this.keyframes.push(keyframe);
        this.keyframes.sort((a, b) => (a.instant > b.instant) ? 1 : -1);
        this.final=this.keyframes[this.keyframes.length-1].instant;
        console.log(this.final);
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
            if(this.keyframes[i].instant > delta_time){
                aux = i;
                break;
            }
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
        T = vec3.lerp(T, kf1.translation, kf2.translation, (delta_time - kf1.instant)/(kf2.instant-kf1.instant));
       
        // Rotation
        R = vec3.lerp(R, kf1.rotation * DEGREE_TO_RAD, kf2.rotation * DEGREE_TO_RAD, (delta_time - kf1.instant)/(kf2.instant-kf1.instant));

        // Scale
        S = vec3.lerp(S, kf1.scale, kf2.scale, (delta_time - kf1.instant)/(kf2.instant-kf1.instant));
        
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
