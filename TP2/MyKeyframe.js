/**
 * MyKeyframe class: represents an keyframe from an animation
**/
class MyKeyframe {
    /**
     * @constructor
     * @param {integer} instant
     * @param {vec3} translation
     * @param {vec3} rotation
     * @param {vec3} transformation
     */
    constructor(instant, translation, rotation, scale) {
        this.instant = instant;
        this.translation = translation;
        this.rotation = rotation;
        this.scale = scale;
    }

}
