Module['preRun'] = function() {
    function stdin() {
        if(window.stdin)
            return window.stdin()
        return null;
    }

    let stdoutBuffer = "";
    function stdout(code) {
        if (code === "\n".charCodeAt(0) && stdoutBuffer !== "") {
            if(window.stdout)
                window.stdout(stdoutBuffer);
            else
                console.log(stdoutBuffer);
            stdoutBuffer = "";
        } else {
            stdoutBuffer += String.fromCharCode(code);
        }
    }

    let stderrBuffer = "";
    function stderr(code) {
        if (code === "\n".charCodeAt(0) && stderrBuffer !== "") {
            if(window.stderr){
                window.stderr(stderrBuffer)
            }
            else
                console.error(stderrBuffer);
            stderrBuffer = "";
        } else {
            stderrBuffer += String.fromCharCode(code);
        }
    }

    FS.init(stdin, stdout, stderr);
}
