const getGlobal = function () {
    if (typeof self !== 'undefined') { return self; }
    if (typeof window !== 'undefined') { return window; }
    if (typeof global !== 'undefined') { return global; }
    console.warn("Failed to locate global variable (window, self etc.)")
    return {};
};
  

Module['preRun'] = function() {
    const globals = getGlobal();
    function stdin() {
        if(globals.stdin)
            return globals.stdin()
        return null;
    }

    let stdoutBuffer = "";
    function stdout(code) {
        if (code === "\n".charCodeAt(0) && stdoutBuffer !== "") {
            if(globals.stdout)
                globals.stdout(stdoutBuffer);
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
            if(globals.stderr){
                globals.stderr(stderrBuffer)
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
