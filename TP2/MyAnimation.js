/**
 * MyAnimation class: represents an animation
**/
class MyAnimation {
    /**
     * @constructor
     * @param {time} start_time - starting time for this animation
     * @param {time} end_time   - end time for this animation
     * @param {tranformation} start_transf - starting transformation for this animation
     * @param {tranformation} end_transf   - end transformation for this animation
     */
    constructor(start_time, end_time, start_transf, end_transf) {
        this.start_time  = start_time;
        this.end_time    = end_time;
        this.start_transf = start_transf;
        this.end_transf   = end_transf;
    }

}

    