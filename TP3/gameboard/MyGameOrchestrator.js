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

        this.gameState = [];
        this.player = 0;
        this.selectedPieces = 0;
        this.selected = [null, null];
        this.state = { 
            so_para_nao_dar_load_infinito: 999,
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
        //this.currentState = this.state.so_para_nao_dar_load_infinito;
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

    startReply(data) {
        let answer = data.response.split("-");
        if (answer[0] != "0") {
            console.log("Error");
        }
        var Player = answer[2]; 
        var boardStr = answer[1].substring(2, answer[1].length - 2);;
        var auxList = boardStr.split("],[");
        
        var board = [];
        for(let i = 0; i < auxList.length; i++){
            var line = auxList[i].split(",");
            board.push(line);
        }
        var result = [];
        
        result.push(Player);
        result.push(board);

        return result;
    }

    orchestrate(){
        switch(this.currentState){
            case this.state.menu:
                this.prolog.startRequest(8);
                let result = this.startReply(this.prolog.request);
                this.player = result[0];
                this.gameboard.toJS(result[1]);
                // this.gameboard.tile = result[1];
                


                // TODO: APAGAR ISTO DEPOIS; SO PARA NAO IMPRIMIR INFINITAS VEZES
                this.currentState = this.state.so_para_nao_dar_load_infinito;
                break;
            case this.state.so_para_nao_dar_load_infinito:
                break;
            default:
                console.log("Unknown Game State");
                break;
        }
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
            console.log(id); //TODO : remove
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
