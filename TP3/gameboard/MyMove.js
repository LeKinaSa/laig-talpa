class MyMove {
    constructor(scene, gameOrchestrator, initialBoard, player, originId, destinId) {
        this.scene = scene;
        this.gameOrchestrator = gameOrchestrator;
        this.prolog = this.gameOrchestrator.prolog;
        this.initialBoard = initialBoard;
        this.player = player;
        this.originId = originId;
        this.destinId = destinId;
        this.column = 0;
        this.line   = 0;
        this.direction = 'e';
    }

    /**
     * Transform the Prolog Board from String to List
     */
    getInitialBoard() {
        var boardStr = this.initialBoard.substring(2, this.initialBoard.length - 2);
        var auxList = boardStr.split("],[");
        
        var board = [];
        for(let i = 0; i < auxList.length; i++){
            var line = auxList[i].split(",");
            board.push(line);
        }
        return board;
    }

    /**
     * Calculate Position of the Piece
     * Based on Id
     * Id Calculation : (line - 1) * 8 + (column - 1)
     * @param {*} id 
     */
    calculatePosition(id) {
        return [id % 8 + 1, Math.floor(id / 8) + 1];
    }

    /**
     * Obtain the Move in Column, Line and Direction
     */
    getMove() {
        var originPos = this.calculatePosition(this.originId);
        var destinPos = this.calculatePosition(this.destinId);

        this.column = originPos[0];
        this.line   = originPos[1];

        if (originPos[0] == destinPos[0]) {
            // Same Column
            if (originPos[1] == destinPos[1]) {
                // Same Line
                this.direction = 'x';
            }
            else if ((originPos[1] + 1) == destinPos[1]) {
                // Next Line
                this.direction = 'u';
            }
            else if ((originPos[1] - 1) == destinPos[1]) {
                // Line Before
                this.direction = 'd';
            }
            else {
                // Line too far away
                this.direction = 'e';
            }
        }
        else if (originPos[1] == destinPos[1]) {
            // Same Line
            if ((originPos[0] + 1) == destinPos[0]) {
                // Next Column
                this.direction = 'r';
            }
            else if ((originPos[0] - 1) == destinPos[0]) {
                // Column Before
                this.direction = 'l';
            }
            else {
                // Column too far away
                this.direction = 'e';
            }
        }
        else {
            // Diagonal
            this.direction = 'e';
        }
    }

    /**
     * Verify on Prolog if the Move is Valid
     */
    isValid() {
        this.getMove();

        // Prolog Verification
        this.prolog.playerMoveRequest(8, this.initialBoard, this.player, this.column, this.line, this.direction);
        return this.gameOrchestrator.playerMoveReply(this.prolog.request);
    }
}
