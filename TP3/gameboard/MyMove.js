class MyMove {
    constructor(scene, gameOrchestrator, initialGameState, player, originId, destinId) {
        this.scene = scene;
        this.gameOrchestrator = gameOrchestrator;
        this.prolog = this.gameOrchestrator.prolog;
        this.initialGameState = initialGameState; // Board
        this.player = player;
        this.originId = originId;
        this.destinId = destinId;
        this.column = 0;
        this.line   = 0;
        this.direction = 'x';
    }

    /**
     * Calculate Position of the Piece
     * Based on Id
     * Id Calculation : (line - 1) * 8 + (column - 1)
     */
    calculatePosition(id) {
        return [id % 8 + 1, Math.floor(id / 8) + 1];
    }

    getMove() {
        var originPos = this.calculatePosition(this.originId);
        var destinPos = this.calculatePosition(this.destinId);

        this.column = originPos[0];
        this.line   = originPos[1];

        if (originPos[0] == destinPos[0]) {
            // Same Column
            if (originPos[1] == destinPos[1]) {
                // Same Line
                this.direction = "x";
            }
            else if ((originPos[1] + 1) == destinPos[1]) {
                // Next Line
                this.direction = "u";
            }
            else if ((originPos[1] - 1) == destinPos[1]) {
                // Line Before
                this.direction = "d";
            }
            else {
                // Line too far away
                this.direction = "e";
            }
        }
        else if (originPos[1] == destinPos[1]) {
            // Same Line
            if ((originPos[0] + 1) == destinPos[0]) {
                // Next Column
                this.direction = "r";
            }
            else if ((originPos[0] - 1) == destinPos[0]) {
                // Column Before
                this.direction = "l";
            }
            else {
                // Column too far away
                this.direction = "e";
            }
        }
        else {
            // Diagonal
            this.direction = "e";
        }

        console.log(this.originId, this.destinId);
        console.log(originPos[0], originPos[1], destinPos[0], destinPos[1]);
        console.log(this.column, this.line, this.direction);
    }

    isValid() {
        this.getMove();

        // Prolog Verification
        this.prolog.playerMoveRequest(8, this.initialGameState, this.player, this.column, this.line, this.direction);
        return this.gameOrchestrator.playerMoveReply(this.prolog.request);
    }
}
