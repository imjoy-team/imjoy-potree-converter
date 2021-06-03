# ImJoy Potree Converter

PotreeConverter compiled into WebAssembly

## Usage
```html
<!DOCTYPE html>
<html>
<head>
    <script type="module">
        import Module from "http://localhost:8000/build/PotreeConverter/PotreeConverter.js";
        
        new Module().then(pcModule => {
            pcModule.FS.writeFile('/tmp/point-cloud.txt', `0.000000000000000000e+00 0.000000000000000000e+00 0.000000000000000000e+00
1.000000000000000000e+01 0.000000000000000000e+00 0.000000000000000000e+00`);

            window.reportProgress = (status, progress, total)=>{
                console.log('Progress:', status, progress, total);
            }
            pcModule.callMain(['./PotreeConverter', '-i', '/tmp/point-cloud.txt', '--overwrite']);
        });
        

    </script>

</head>
<body>

<h1>My First Heading</h1>

<p>My first paragraph.</p>

</body>
</html>

```


## Development
Compile the files:
```
source ./emsdk/emsdk_env.sh
emmake make PotreeConverter
```