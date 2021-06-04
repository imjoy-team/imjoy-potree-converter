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
            var result = pcModule.callMain(['./PotreeConverter'].concat(config.arguments));
            var totalTime = now() - time;
            postMessage({
                'type': 'stdout',
                'data': 'Finished processing (took ' + totalTime + 'ms)'
            });

            postMessage({
                'type': 'done',
                'data': result,
                'time': totalTime
            });
        }
    };


    postMessage({
        'type': 'ready'
    });
})