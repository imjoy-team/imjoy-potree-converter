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

            window.stdout = function(data){
                const p = document.createElement('p')
                p.innerHTML = data
                document.body.appendChild(p)
            }
            pcModule.callMain(['./PotreeConverter', '-i', '/tmp/point-cloud.txt', '--overwrite']);
        });
        

    </script>

</head>
<body>

<h1>PotreeConverter</h1>


</body>
</html>

```


## Development
Compile the files:
```
./emsdk install 2.0.23
./emsdk activate 2.0.23
source ./emsdk/emsdk_env.sh
emmake make PotreeConverter
```

## Performance

~1 minutes for 1 million points

```js
console.time('execution time')
for(let i=0;i<10000;i++) 
    pcModule.callMain(['./PotreeConverter', '-i', '/tmp/point-cloud.txt', '--overwrite']);
console.timeEnd('execution time');

// execution time: 57504 ms(for 10000*100 points)
```