/**
 * MyMoveAnimator
 * @description Class that defines the animations for the moves
 */
class MyMoveAnimator extends MyAnimator{
    constructor(scene, move){
        super(scene);
        this.move = move;
        this.pieces = []; // pieces involved in the move
        this.over = false;
    }

    update(t){
    }

    display(){

    }

}