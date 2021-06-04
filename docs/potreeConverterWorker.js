import Module from "./PotreeConverter.js";

function mountFiles(FS, files) {
    try {
        FS.mkdir('/files');
    }
    catch (e) {
        console.log('Unmount existing /files')
        FS.unmount('/files');
    }
    FS.mount(FS.filesystems.WORKERFS, {
        blobs: files
    }, '/files');
}

new Module().then(pcModule => {
    const FS = pcModule.FS;
    var now = Date.now;
    self.stdout = function (data) {
        postMessage({
            'type': 'stdout',
            'data': data
        });
    }
    onmessage = function (event) {

        var message = event.data;

        if (message.type === "command") {
            var config = {
                files: message.files || [],
                arguments: message.arguments || [],
            };
            mountFiles(FS, config.files);

            postMessage({
                'type': 'start',
                'data': config.arguments.join(" ")
            });

            postMessage({
                'type': 'stdout',
                'data': 'Received command: ' +
                    config.arguments.join(" ")
            });

            var time = now();
            pcModule.callMain(['./PotreeConverter'].concat(config.arguments));
            var totalTime = now() - time;
            postMessage({
                'type': 'stdout',
                'data': 'Finished processing (took ' + totalTime + 'ms)'
            });
            let buffers;
            if (FS.analyzePath('/tmp/output').exists) {
                const outputs = FS.readdir('/tmp/output').filter((name) => {
                    if (name.startsWith('.')) return false
                    const path = '/tmp/output/' + name;
                    const stat = FS.stat(path)
                    const isDir = FS.isDir(stat.mode);
                    console.log((isDir ? "file: " : "Dir:") + name, " size:" + stat.size)
                    if (isDir) console.log(FS.readdir(path));
                    return !isDir
                })
                console.log("ouput files: ", outputs)
                buffers = outputs.map((name) => {
                    const path = '/tmp/output/' + name;
                    const stat = FS.stat(path)
                    return { name, data: FS.readFile(path, { encoding: 'binary' }), size: stat.size }
                })
            }

            postMessage({
                'type': 'done',
                'data': buffers,
                'time': totalTime
            });
        }
    };


    postMessage({
        'type': 'ready'
    });
})