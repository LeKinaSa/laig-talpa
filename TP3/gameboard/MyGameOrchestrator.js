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
        this.state = { 
            menu: 0, // show menu and handle settings.
            load_scenario: 1, // (keep game state), load file, render scene, board, pieces, etc.
            next_turn: 2, // Human? pick piece or tile. Prolog? [Request(s) to prolog] get piece/tile, 
            // possible moves and destination piece/tile
            render_possible_moves: 3, // based on previous render possible target tiles
            // Human? render and move to next state.
            // Prolog? render and wait a couple of seconds…
            destination_piece_selection: 4, // Human? pick destination tile/piece. Prolog? 
            // render destination piece/tile.
            movement_animation: 5, // selection is moved with based on some animation f(t)
            next_turn: 6, // [request to prolog] and evaluate game end or Next turn.
            end_game: 7, // display winner and goto menu

            // INTERRUPTING GAME STATES

            undo: 8, //  undo the last game movement. Updates turn.
            movie: 9, // > keep game state. Renders all the game movements (should use 
            // the same animation features used for movement animation). 
        };

        this.currentState = this.state.menu;
    }

    /**
     * Updates animation
     * @param {*} time current time
     */
    update(time){
        if(this.animator != undefined)
            this.animator.update(time);
    }

    renderMove(){
        // TODO
        this.currentState = this.state.movement_animation;
    }

    undo(){
        // TODO
        this.currentState = this.state.movement_animation;
    }

    movie(){
        // TODO
        // activate an animation that plays the game sequence
        this.currentState = this.state.movement_animation;
    }

    orchestrate(){

    }

    display(){
        //this.theme.display();
        this.animator.display();
        this.gameboard.display();
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
