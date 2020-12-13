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

        request.onload = onSuccess || function(data) { console.log("Request successful. Reply: " + data.target.response); }
        request.onerror = onError  || function()     { console.log("Error waiting for response"); }

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }

    /* ------------------------------------------------------------------------------------
    ----------------------------------- REQUEST HANDLERS ----------------------------------
    --------------------------------------------------------------------------------------*/

    // TODO

    /* ------------------------------------------------------------------------------------
    ---------------------------------- RESPONSE HANDLERS ----------------------------------
    --------------------------------------------------------------------------------------*/

    // TODO
}