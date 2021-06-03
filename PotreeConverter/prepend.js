Module['preRun'] = function() {
    function stdin() {
        return null;
    }

    let stdoutBuffer = "";
    function stdout(code) {
        if (code === "\n".charCodeAt(0) && stdoutBuffer !== "") {
            console.log(stdoutBuffer);
            stdoutBuffer = "";
        } else {
        stdoutBuffer += String.fromCharCode(code);
        }
    }

    let stderrBuffer = "";
    function stderr(code) {
        if (code === "\n".charCodeAt(0) && stderrBuffer !== "") {
            console.error(stderrBuffer);
            stderrBuffer = "";
        } else {
            stderrBuffer += String.fromCharCode(code);
        }
    }

    FS.init(stdin, stdout, stderr);
}
