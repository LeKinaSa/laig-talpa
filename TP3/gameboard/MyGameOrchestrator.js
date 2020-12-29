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
    constructor(scene) {
        super(scene);
        this.animator = null;
        this.gameboard = new MyGameBoard(scene);
        this.gameSequence = new MyGameSequence(scene);
        //this.theme = new MyScenegraph(…);
        this.prolog = new MyPrologConnection();

        this.gameState = [];
        this.player = 0;
        this.selectedPieces = 0;
        this.selected = [null, null];
        this.selectedIds = [0, 0];

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
            end_game: 6, // display winner and goto menu

            // INTERRUPTING GAME STATES

            undo: 7, //  undo the last game movement. Updates turn.
            movie: 8, // > keep game state. Renders all the game movements (should use 
            // the same animation features used for movement animation). 
        };

        this.currentState = this.state.menu;
        //this.currentState = this.state.so_para_nao_dar_load_infinito;
    }

    /**
     * Updates animation
     * @param {*} t current time
     */
    update(t) {
        if (this.animator != null) {
            this.animator.update(t);
            if (this.animator.finish()) {
                this.animator = null;
            }
        }
    }

    renderMove() {
        // TODO
        this.currentState = this.state.movement_animation;

        // Check if the move is valid

        var move = new MyMove(this.scene, this.gameState, this.player, this.selected[0], this.selected[1]);
        this.animator = new MyMoveAnimator(this.scene, this, move);
        this.animator.start(this.selected, this.selectedIds);
    }

    undo() {
        // TODO
        this.currentState = this.state.movement_animation;
    }

    movie() {
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

    orchestrate() {
        // TODO: nao sei se posso fazer isto aqui... perguntar à clara
        this.managePick(this.scene.pickMode, this.scene.pickResults);
        this.scene.clearPickRegistration();

        switch(this.currentState) {
            case this.state.menu:
                this.prolog.startRequest(8);
                let result = this.startReply(this.prolog.request);
                this.player = result[0];
                this.gameboard.toJS(result[1]);
                this.currentState = this.state.next_turn;          
                break;

            case this.state.next_turn: // select origin piece
                // human : choose a piece
                if (this.selected[0] != null) {
                    this.currentState = this.state.destination_piece_selection;
                }
                break;

            case this.state.destination_piece_selection: // select destination piece
                if (this.selected[1] != null) {
                    this.renderMove();
                }
                break;

            case this.state.movement_animation: // move animation
                if (this.animator != null) {
                    // this.animator.start();
                }

                // animation is over
                this.selected[0] = null;
                this.selected[1] = null;
                // next turn
                this.currentState = this.state.next_turn; 
                break;

            default:
                console.log("Unknown Game State");
                break;
        }
    }

    display() {
        //this.theme.display();
        if (this.animator != null) {
            this.animator.display();
        }
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
            this.selectedIds[this.selectedPieces] = id;
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
