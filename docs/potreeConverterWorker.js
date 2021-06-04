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

new Module().then(async pcModule => {
    const FS = pcModule.FS;
    FS.mkdir('/data');
    // FS.mount(FS.filesystems.IDBFS, {}, '/data');
    // await new Promise((resolve, reject)=>{
    //     FS.syncfs(true, function (err) {
    //         if(err) reject(err)
    //         else
    //         resolve()
    //     })
    // })
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
            postMessage({
                'type': 'stdout',
                'data': 'Saving data to disk...'
            });
            // await new Promise((resolve, reject)=>{
            //     FS.syncfs(function (err) {
            //         if(err) reject(err)
            //         else
            //         resolve()
            //     })
            // })
            
            var totalTime = now() - time;
            postMessage({
                'type': 'stdout',
                'data': 'Finished processing (took ' + totalTime + 'ms)'
            });

            let buffers;
            if (FS.analyzePath('/data/output').exists) {
                const outputs = FS.readdir('/data/output').filter((name) => {
                    if (name.startsWith('.')) return false
                    const path = '/data/output/' + name;
                    const stat = FS.stat(path)
                    const isDir = FS.isDir(stat.mode);
                    console.log((isDir ? "Dir: " : "File: ") + path, " size:" + stat.size)
                    if (isDir) console.log(FS.readdir(path));
                    return !isDir
                })
                console.log("ouput files: ", outputs)
                buffers = outputs.map((name) => {
                    const path = '/data/output/' + name;
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