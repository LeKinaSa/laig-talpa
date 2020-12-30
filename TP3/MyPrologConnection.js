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
    convertToString(listArgs) {
        let str = "";
        for (let i=0; i<listArgs.length; ++ i) {
            if (Array.isArray(listArgs[i]))
                str += '[' + this.toStringObject(listArgs[i]) + ']';
            else
                str += listArgs[i];
            if (i < listArgs.length - 1)
                str += ',';
        }
        return str;
    }

    /*
    *   Send a Prolog Request
    *   - based on "index.html" given to test "server.pl"
    */
    sendPrologRequest(args, onSuccess, onError, port) {
        let requestString = '[' + this.convertToString(args) + ']';

        var requestPort = port || 8081;
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, false);
        //request.open('GET', 'http://localhost:'+requestPort+'/'+args, true);

        request.onload  = onSuccess || function(data) { console.log("Request successful. Reply: " + data.target.response); }
        request.onerror =  onError  || function()     { console.log("Error waiting for response"); }

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();

        this.request = request;
    }

    /* ------------------------------------------------------------------------------------
    ----------------------------------- REQUEST HANDLERS ----------------------------------
    --------------------------------------------------------------------------------------*/

    /**
     * Starts the Game
     * @param {*} dimensions dimensions of the board
     */
    startRequest(dimensions){
        this.sendPrologRequest([this.start, dimensions]);
    }

    /**
     * Verify if the player won the game
     * @param {*} dimensions dimensions of the board
     * @param {*} board current board
     * @param {*} player player that is gonna be verified
     */
    gameOverRequest(dimensions, board, player) {
        this.sendPrologRequest([this.GameOver, dimensions, board, player]);
    }

    /**
     * Calculates AI Move
     * @param {*} dimensions dimensions of the board
     * @param {*} board current board
     * @param {*} player bot player
     * @param {*} level bot difficulty
     */
    AIMoveRequest(dimensions, board, player, level) {
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
    playerMoveRequest(dimensions, board, player, column, line, direction) {
        this.sendPrologRequest([this.playerMove, dimensions, board, player, column, line, direction], this.playerMoveReply);
    }

    /**
     * Makes new Move
     * @param {*} dimensions dimensions of the board
     * @param {*} board current board
     * @param {*} player current player
     * @param {*} move move that is gonna be made
     */
    moveRequest(dimensions, board, player, move) {
        this.sendPrologRequest([this.move, dimensions, board, player, move], this.moveReply);
    }

    /* ------------------------------------------------------------------------------------
    ---------------------------------- RESPONSE HANDLERS ----------------------------------
    --------------------------------------------------------------------------------------*/
    /**
     * Gets the initial Board
     * @param {*} data initial board and player
     */
     startReply(data) {
        let answer = data.target.response.split("-");
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

        this.request = result;
    }

    /**
     * Gets AI Move
     * @param {*} data move (column-line-direction)
     */
    AIMoveReply(data) {
        let answer = data.target.response.split("-");
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
        let answer = data.target.response;
        if (answer != "0") {
            return false;
        }
        return true;
    }

    /**
     * Makes move, returning new board
     * @param {*} data new board and next player to move
     */
    moveReply(data) {
        let answer = data.target.response.split("-");
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
}

//defining constants to be easier to work with the code
MyPrologConnection.prototype.start = 0;
MyPrologConnection.prototype.GameOver = 1;
MyPrologConnection.prototype.AIMove = 2;
MyPrologConnection.prototype.playerMove = 3;
MyPrologConnection.prototype.move = 4;