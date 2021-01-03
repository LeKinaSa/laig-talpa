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
        this.gameboard = new MyGameBoard(this.scene);
        this.gameSequence = new MyGameSequence(this.scene);
        this.theme = new MySceneGraph(this.scene.selectedTheme, this.scene);
        this.prolog = new MyPrologConnection();

        this.savedboard = null;

        this.initialBoard = null;
        this.gameState = [];
        this.over = false;
        this.player = 0;
        this.winner = null;
        this.score = {
            "1": 0,
           "-1": 0,
       };

        /**
         *  1 - red player              0 - player
         * -1 - blue player             1 - random bot
         *                              2 - greedy bot
         */
        this.players = {
             "1": 0,
            "-1": 0,
        };
        this.dimensions = this.scene.selectedDimension;

        // Player Moves
        this.selectedPieces = 0;
        this.selected = [null, null];
        this.selectedIds = [0, 0];
        this.botLastPieces = [null, null];

        // Undo Move
        this.lastMove = null;
        this.lastMovedPieces = [null, null];
        this.lastBotMove = null;
        this.lastBotMovedPieces = [null, null];

        // Timer
        this.startTime = 0;
        this.time = 0;

        this.timedGame = false;
        this.startTurnTime = 0;
        this.defaultTurnTime = 30;
        this.turnTime = 30;
        this.timeout = false;

        this.timer = new MyTimer(this.scene);

        // Movie
        this.startedMovie = false;

        this.state = {
            menu: 10, // before starting game
            start: 0, // game start
            load_scenario: 1, // (keep game state), load file, render scene, board, pieces, etc.
            next_turn: 2, // Human? pick piece or tile. Prolog? [Request(s) to prolog] get piece/tile, 
            // possible moves and destination piece/tile
            render_possible_moves: 3, // based on previous render possible target tiles
            // Human? render and move to next state.
            // Prolog? render and wait a couple of seconds…
            destination_piece_selection: 4, // Human? pick destination tile/piece. Prolog? 
            // render destination piece/tile.
            end_game: 5, // display winner and goto menu

            // INTERRUPTING GAME STATES

            undo: 6,    //  undo the last game movement. Updates turn.
            movie: 7,   // > keep game state. Renders all the game movements (should use 
                        // the same animation features used for movement animation).
            restart: 8, // restart the game -> verify the dimensions
        };

        this.currentState = this.state.menu;
    }

    changeDimension() {
        this.restart();
    }

    changeTheme(theme) {
        this.theme = new MySceneGraph(theme, this.scene);
    }

    changeRedPlayer(mode) {
        this.players["1"] = parseInt(mode);
        this.restart();
    }

    changeBluePlayer(mode) {
        this.players["-1"] = parseInt(mode);
        this.restart();
    }

    /**
     * Update Elapsed Time
     * @param {time} t - current time
     */
    updateTime(t) {
        t = t / 1000;
        /* verify if it's the first call -> if it's the first, change startTime to current time */
        if (this.startTime == 0)    { this.startTime = t; }

        /**
         * this.time -> game's elapsed time
         * elapsed time = actual time - init time
         * for example: first call -> this.time = 0
         */
        this.time = t - this.startTime;

        if(this.timedGame && !this.timeout){
            if (this.startTurnTime == 0){ this.startTurnTime = t;} 
            this.turnTime = this.defaultTurnTime - (t - this.startTurnTime);
        }
        if(this.timer.getTime(this.turnTime) == "00:00"){
            this.timeout = true;
        }
        
    }

    restart() {        
        this.gameSequence = new MyGameSequence(this.scene);
        // Player Moves
        this.selectedPieces = 0;
        this.selected = [null, null];
        this.selectedIds = [0, 0];

        // Undo Move
        this.lastMove = null;
        this.lastMovedPieces = [null, null];
        this.lastBotMove = null;

        // Timer
        this.startTime = 0;
        this.time = 0;
        this.timer = new MyTimer(this.scene);

        // Movie
        this.startedMovie = false;
        // TODO
        // this.gameSequence.restart();

        // Dimensions
        this.dimensions = this.scene.selectedDimension;
        
        this.currentState = this.state.start;
        this.scene.restart = false;
    }

    /* -----------------------------------------------------------------------------------
    ---------------------------------------- MOVES ---------------------------------------
    -------------------------------------------------------------------------------------*/

    renderMove() {
        // Check if Move is Valid
        this.gameState = this.gameboard.toProlog();
        var move = new MyMove(this.scene, this, this.dimensions, this.gameState, this.player, this.selectedIds[0], this.selectedIds[1]);
        if (move.isValid()) {
            this.gameSequence.addGameMove(move); // add move to the game sequence
            this.animator = new MyMoveAnimator(this.scene, this, this.selected, this.selectedIds, this.dimensions);
            this.gameSequence.addMoveAnimator(this.animator); // add move to the game sequence
            this.animator.start();
            
            this.lastMove = move;
            this.lastMovedPieces = [this.selected[0], this.selected[1]];
            this.lastBotMove = null;
            this.lastBotMovedPieces = [null, null];
            
            this.currentState = this.state.end_game;
        }
        else {
            this.selected[0] = null;
            this.selected[1] = null;
            this.currentState = this.state.next_turn;
        }
    }

    renderAIMove() {
        this.gameState = this.gameboard.toProlog();
        var levelAI = this.players[this.player.toString()];
        this.prolog.AIMoveRequest(this.dimensions, this.gameState, this.player, levelAI);
        var moveParameters = this.AIMoveReply(this.prolog.request);
        
        var move = new MyAIMove(this.scene, this.dimensions, this.gameState, this.player, this.gameboard, moveParameters);
        this.lastBotMove = move;
        this.lastBotMovedPieces = [move.getPieces()[0], move.getPieces()[1]];
        
        this.animator = new MyMoveAnimator(this.scene, this, move.getPieces(), move.getIds(), this.dimensions);
        this.gameSequence.addMoveAnimator(this.animator); // add move to the game sequence
        this.animator.start();
    }

    forceMove(){
        this.gameState = this.gameboard.toProlog();
        var levelAI = "1";
        this.prolog.AIMoveRequest(this.dimensions, this.gameState, this.player, levelAI);
        var moveParameters = this.AIMoveReply(this.prolog.request);
        
        var move = new MyAIMove(this.scene, this.dimensions, this.gameState, this.player, this.gameboard, moveParameters);
        this.lastBotMove = move;
        this.lastBotMovedPieces = [move.getPieces()[0], move.getPieces()[1]];
        
        this.animator = new MyMoveAnimator(this.scene, this, move.getPieces(), move.getIds(), this.dimensions);
        this.gameSequence.addMoveAnimator(this.animator); // add move to the game sequence
        this.animator.start();
    }

    undo() {
        if (this.lastBotMove != null) {
            this.animator = new MyUndoAnimator(this.scene, this, this.lastBotMove, this.lastBotMovedPieces, this.dimensions);
            this.gameSequence.addMoveAnimator(this.animator); // add undo move to the game sequence
            this.animator.start();
            this.lastBotMove = null;
            this.lastBotMovedPieces = [null, null];
            return false;
        }
        else if (this.lastMove != null) {
            this.animator = new MyUndoAnimator(this.scene, this, this.lastMove, this.lastMovedPieces, this.dimensions);
            this.gameSequence.addMoveAnimator(this.animator); // add undo move to the game sequence
            this.animator.start();
            this.lastMove = null;
            this.lastMovedPieces = [null, null];
            return true;
        }
        return true;
    }

    movie() {
        // activate an animation that plays the game sequence
        this.startedMovie = true;
        this.animator = new MyMovieAnimator(this.scene, this, this.gameSequence.getMoveAnimators(), this.initialBoard);
        this.animator.start();
    }

    /* -----------------------------------------------------------------------------------
    ---------------------------------------- MAIN ----------------------------------------
    -------------------------------------------------------------------------------------*/

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
        this.updateTime(t);
        this.updateHTML();
    }

    orchestrate() {
        let result = null;
        if (this.scene.movie && this.currentState != this.state.movie) {
            this.savedboard = this.gameboard; 
            this.currentState = this.state.movie;
        }
        else if (this.scene.undo && this.currentState != this.state.undo) {
            this.savedboard = this.gameboard; 
            this.currentState = this.state.undo;
        }
        else if (this.scene.restart && this.currentState != this.state.start) {
            this.restart();
        }

        if(this.currentState == this.state.end_game && this.over){
            this.over = false;
            this.winner = 0;
            this.restart();
        }
        if (!this.over) {
            switch(this.currentState) {
                case this.state.menu:
                    break;
                case this.state.start:
                    this.prolog.startRequest(this.dimensions);
                    result = this.startReply(this.prolog.request);
                    this.player = result[0];
                    this.gameboard.toJS(result[1]);
                    this.initialBoard = new MyGameBoard(this.scene);
                    this.initialBoard.toJS(result[1]);
                    this.currentState = this.state.next_turn;
                    break;
    
                case this.state.next_turn: // select origin piece
                    if(!this.scene.rotatingcamera){
                        if (this.players[this.player.toString()] == "0") {
                            // human : choose a piece
                            if (this.selected[0] != null) {
                                this.currentState = this.state.destination_piece_selection;
                            }
                            if(this.timeout){
                                this.forceMove();
                                this.timeout = false;
                                this.startTurnTime = 0;
                                this.turnTime = 30;
                                this.currentState = this.state.end_game;   
                            }
                            
                        }
                        else {
                            this.renderAIMove();
                            this.currentState = this.state.end_game;                            
                        }
                    }
                    break;
    
                case this.state.destination_piece_selection: // select destination piece
                    if (this.selected[1] != null) {
                        this.renderMove(); // animation
                    }
                    break;
    
                case this.state.end_game: // end game
                    if (this.animator == null) {
                        // animation is over
                        this.selected[0] = null;
                        this.selected[1] = null;

                        this.prolog.gameOverRequest(this.dimensions,this.gameboard.toProlog(), this.player);
                        result = this.gameOverReply(this.prolog.request);
                        this.winner = result;
                        if (this.winner != 0) {
                            this.over = true;
                            if      (this.winner ==  1) { 
                                console.log("Red Player Wins");                                  
                                this.score["1"]++;
                            }
                            else if (this.winner == -1) { 
                                console.log("Blue Player Wins");                              
                                this.score["-1"]++;
                            }
                            this.currentState = this.state.end_game;
                        }
                        else {
                            this.scene.rotateCamera();
                            this.player = -this.player;
                            this.currentState = this.state.next_turn;
                        }
                    }
                    break;

                case this.state.undo:
                    if (this.animator == null) {
                        if (this.undo()) {
                            this.timeout = false;
                            this.startTurnTime = 0;
                            this.turnTime = 30;
                            this.currentState = this.state.next_turn;
                        }
                    }                    
                    break;
    
                case this.state.movie:
                    if (!this.scene.movie) {
                        this.startedMovie = false;
                        this.animator = null;
                        this.currentState = this.state.next_turn;
                    }
                    else if ((this.animator == null) && (!this.startedMovie)) {
                        this.movie();
                        this.timeout = false;
                        this.startTurnTime = 0;
                        this.turnTime = 30;
                    }
                    break;
                
                case this.state.restart:
                    if (!this.scene.restart) {
                        this.restart();
                        this.currentState = this.state.start;
                    }
                    break;

                default:
                    console.log("Unknown Game State");
                    break;
            }
        }
        
    }

    display() {
        this.theme.displayScene();
        if (this.animator != null) {
            this.animator.display();
        }
        this.gameboard.display();
        //this.timer.display(this.time);
    }

    /* -----------------------------------------------------------------------------------
    --------------------------------------- PICKING --------------------------------------
    -------------------------------------------------------------------------------------*/

    managePick(mode, results) {
        if (mode == false) {
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
            // Pieces for the Move Obtained
            // Unselect Pieces
            if (this.selected[0] != null) {
                this.selected[0].resetSelection();
            }
            if (this.selected[1] != null) {
                this.selected[1].resetSelection();
            }
            this.selectedPieces = 0;
        }
    }

    /* -----------------------------------------------------------------------------------
    ------------------------------ PROLOG RESPONSE HANDLERS ------------------------------
    -------------------------------------------------------------------------------------*/

    /**
     * Gets the initial Board
     * @param {*} data initial board and player
     */
    startReply(data) {
        if(data.response == "Syntax Error")
            return data.response;
        let answer = data.response.split("-");
        if (answer[0] != "0") {
            console.log("Error");
        }
        var Player = answer[2]; 
        var boardStr = answer[1].substring(2, answer[1].length - 2);
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

    /**
     * Verifies if the game as finished
     * @param {*} data winner
     */
    gameOverReply(data) {
        let answer = data.response;
        if (answer[0] != "0") {
            console.log("Error");
        }
        if(answer[2] == " ") return (answer[3] + answer[4]);
        return answer[2];
    }

    /**
     * Gets AI Move
     * @param {*} data move (column-line-direction)
     */
    AIMoveReply(data) {
        let answer = data.response.split("-");
        if (answer[0] != "0") {
            console.log("Error");
            return [];
        }
        return [answer[1], answer[2], answer[3]];
    }      

    /**
     * Verifies if player move is valid
     * @param {*} data move (column-line-direction)
     */
    playerMoveReply(data) {
        let answer = data.response;
        if (answer == "1") {
            return false;
        }
        return true;
    }

    /**
     * Makes move, returning new board
     * @param {*} data new board and next player to move
     */
    moveReply(data) {
        let answer = data.response.split("-");
        if (answer[0] != "0") {
            console.log("Error");
        }
        var player = answer[2]; 
        var boardStr = answer[1].substring(2, answer[1].length - 2);;
        var auxList = boardStr.split("],[");
        
        var board = [];
        for (let i = 0; i < auxList.length; ++ i) {
            var line = auxList[i].split(",");
            board.push(line);
        }

        var result = [];
        result.push(player);
        result.push(board);
        return result;
    }

    updateHTML() {
        if(this.currentState != this.state.menu){
            if(this.player == 1){
                document.getElementById("player").innerText = "Red Player's turn";
                document.getElementById("next").innerText = "Next Turn: Blue Player";
            }
            else if(this.player == -1){
                document.getElementById("player").innerText = "Blue Player's turn";
                document.getElementById("next").innerText = "Next Turn: Red Player";
            }
    
            document.getElementById("score").innerText = "Red " + this.score["1"] + " : " + this.score["-1"] + " Blue";
            
            document.getElementById("time").innerText = "Total Time: " + this.timer.getTime(this.time) + " seconds ";
            
            if(this.timedGame)
                document.getElementById("turn-time").innerText = "Time Left: " + this.timer.getTime(this.turnTime) + " seconds ";
            else{
                document.getElementById("turn-time").innerText = "Game Not Timed";
            }
        }
        else{
            document.getElementById("info").innerText = "Game didn't start yet";
        }
       
    }
}
