/**
 * MyKeyframe class: represents an keyframe from an animation
**/
class MyKeyframe {
    /**
     * @constructor
     * @param {time} instant - time instant correspondent to this key frame
     * @param {transformation} transformation - transformation correspont to this key frame 
     */
    constructor(instant, transformation) {
        this.instant = instant;
        this.transformation = transformation;
    }

}
