/**
 * MyGameOrchestrator
 * @description Manages the entire game
 * 
 * Load of new scenes
 * Manage gameplay (game states)
 * Manages undo
 * Manages movie play
 * Manage object selection
 */
class MyGameOrchestrator extends CGFobject{
    constructor(scene){
        super(scene);
        this.animator = new MyAnimator(scene, this);
        this.gameboard = new MyGameBoard(scene);
        this.gameSequence = new MyGameSequence(scene);
        //this.theme = new MyScenegraph(…);
        this.prolog = new MyPrologConnection();
        this.selectedPieces = 0;
        this.selected = [null, null];
    }

    /**
     * Updates animation
     * @param {*} time current time
     */
    update(time){
        this.animator.update(time);
    }

    display(){
        //this.theme.display();
        this.animator.display();
        this.gameboard.display();
    }

    onHandshakeSuccess(){
        console.log("Success");
    }

    onHandshakeFailure(){
        console.log("Error");
    }

    makeRequest(){
        let context = this;
        this.prolog.sendPrologRequest("handshake", context.onHandshakeSuccess, context.onHandshakeFailure );
    }

    managePick(mode, results) {
        if (mode == false /* && some other game conditions */) {
            if (results != null && results.length > 0) {
                for (var i = 0; i < results.length; ++ i) {
                    var obj = results[i][0];
                    if (obj) {
                        var uniqueId = results[i][1];
                        this.onObjectSelected(obj, uniqueId);
                    }
                }
                // clear results
                results.splice(0, results.length);
            }
        }
    }

    onObjectSelected(obj, id) {
        if (obj instanceof MyPiece) {
            // Selecting a Piece
            obj.select();
            this.selected[this.selectedPieces] = obj;
            ++ this.selectedPieces;
        }

        if (this.selectedPieces == 2) {
            // Move Completed

            // Unselect Pieces
            this.selected[0].resetSelection();
            this.selected[1].resetSelection();
            this.selectedPieces = 0;
            
            // Make a Move
            // TODO: this.selected tem as duas peças que foram selecionadas
        }
    }
}
