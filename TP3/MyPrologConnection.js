/**
 * MyPrologConnection
**/
class MyPrologConnection {
    constructor() {
        this.request = null;
    }

    /*
    *   Convert arguments to String
    */
    convertToString(args) {
        let str = "";
        for (let i = 0; i <= args.length; ++i) {
            if (Array.isArray(args[i])) { str += this.convertToString(args[i]); }
            else                        { str += args[i]; }
            if (i < args.length-1) { str += ','; }
        }
        console.log(str);
        return str;
    }

    /*
    *   Send a Prolog Request
    *   - based on "index.html" given to test "server.pl"
    */
    sendPrologRequest(args, onSuccess, onError, port) {
        let requestString = '[' + this.convertToString(args) + ']';
        
        self = this;

        var requestPort = port || 8081
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);
        //request.open('GET', 'http://localhost:'+requestPort+'/'+args, true);

        request.onload = onSuccess || function(data) { console.log("Request successful. Reply: " + data.target.response); }
        request.onerror = onError  || function()     { console.log("Error waiting for response"); }

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }

    /* ------------------------------------------------------------------------------------
    ----------------------------------- REQUEST HANDLERS ----------------------------------
    --------------------------------------------------------------------------------------*/

    /**
     * Starts the Game
     * @param {*} dimensions dimensions of the board
     */
    startRequest(dimensions){
        this.sendPrologRequest([this.start, dimensions], this.startReply);
    }

    /**
     * Verify if the player won the game
     * @param {*} dimensions dimensions of the board
     * @param {*} board current board
     * @param {*} player player that is gonna be verified
     */
    gameOverRequest(dimensions, board, player){
        this.sendPrologRequest([this.GameOver, dimensions, board, player], this.gameOverReply);
    }

    /**
     * Calculates AI Move
     * @param {*} dimensions dimensions of the board
     * @param {*} board current board
     * @param {*} player bot player
     * @param {*} level bot difficulty
     */
    AIMoveRequest(dimensions, board, player, level){
        this.sendPrologRequest([this.AIMove, dimensions, board, player, level], this.AIMoveReply);
    }

    /**
     * Calculates Player Move
     * @param {*} dimensions dimensions of the board
     * @param {*} board current board
     * @param {*} player current player
     * @param {*} column column of the move
     * @param {*} line line of the move
     * @param {*} direction direction of the move
     */
    playerMoveRequest(dimensions, board, player, column, line, direction){
        this.sendPrologRequest([this.playerMove, dimensions, board, player, column, line, direction], this.playerMoveReply);
    }

    /**
     * Makes new Move
     * @param {*} dimensions dimensions of the board
     * @param {*} board current board
     * @param {*} player current player
     * @param {*} move move that is gonna be made
     */
    moveRequest(dimensions, board, player, move){
        this.sendPrologRequest([this.move, dimensions, board, player, move], this.moveReply);
    }

    /* ------------------------------------------------------------------------------------
    ---------------------------------- RESPONSE HANDLERS ----------------------------------
    --------------------------------------------------------------------------------------*/

    /**
     * Gets the initial Board
     * @param {*} data initial board
     */
    startReply(data){
        let response_array = JSON.parse(data.target.response);
            self.response= response_array[1];
    }

    /**
     * Verifies if the game as finished
     * @param {*} data winner
     */
    gameOverReply(data){
        let response_array = JSON.parse(data.target.response);
            self.response= response_array[1];
        if (response_array == self.Full)
            self.response= true;
        else
            self.response= false;
    }

    /**
     * Gets AI Move
     * @param {*} data move 
     */
    AIMoveReply(data){
        let response_array = JSON.parse(data.target.response);
            self.response= response_array[1];
    }

    /**
     * Gets player move
     * @param {*} data move (column-line-direction)
     */
    playerMoveReply(data){
        let response_array = JSON.parse(data.target.response);
            self.response= response_array[1];
    }

    /**
     * Makes new move, returning new board
     * @param {*} data new baord and next player
     */
    moveReply(data){
        let response_array = JSON.parse(data.target.response);
        if (response_array[0] == self.Ok)
            self.response=response_array[1];
        else
            self.response=false;
    }
}

//defining constants to be easier to work with the code
MyPrologConnection.prototype.start = 0;
MyPrologConnection.prototype.GameOver = 1;
MyPrologConnection.prototype.AIMove = 2;
MyPrologConnection.prototype.playerMove = 3;
MyPrologConnection.prototype.move = 4;