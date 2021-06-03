# from wasmer import engine, Store, Module, Instance
# from wasmer_compiler_cranelift import Compiler
# store = Store()

# # Let's define the store, that holds the engine, that holds the compiler.
# store = Store(engine.JIT(Compiler))

# # Let's compile the module to be able to execute it!
# module = Module(store, open('build/PotreeConverter/PotreeConverter.wasm', 'rb').read())

# print(module)
# # Now the module is compiled, we can instantiate it.
# instance = Instance(module)


# # Call the exported `sum` function.
# result = instance.exports.main()

# print(result) # 42!

# from wasmer import engine, Store, Module, Instance
# from wasmer_compiler_cranelift import Compiler

# from wasmer import Module, wasi

# # Compile the Wasm module.
# wasm_bytes = open('build/PotreeConverter/PotreeConverter.wasm', 'rb').read()

# # Let's define the store, that holds the engine, that holds the compiler.
# store = Store(engine.JIT(Compiler))
# module = Module(store, wasm_bytes)


# # Create the WASI object.

# wasi_env = wasi.StateBuilder("PotreeConverter").arguments(['-i', '/tmp/point-cloud.txt', '--overwrite']).environments({"ABC": "DEF", "X": "YZ"}).map_directory("the_host_current_dir", ".").finalize()

# # Get an `ImportObject` object from the `Wasi` object.
# import_object = wasi_env.generate_import_object_for_module(module)

# # Instantiate the module with the import object.
# instance = module.instantiate(import_object)

# # Have fun!
# instance.exports._start()



from wasmer import wasi, Store, Module, Instance

store = Store()
module = Module(store, open('build/PotreeConverter/PotreeConverter.wasm', 'rb').read())

# Get the WASI version.
wasi_version = wasi.get_version(module, strict=False)

# Build a WASI environment for the imports.
wasi_env = wasi.StateBuilder('PotreeConverter').arguments(['-i', '/tmp/point-cloud.txt', '--overwrite']).finalize()

# Generate an `ImportObject` from the WASI environment.
import_object = wasi_env.generate_import_object(store, wasi_version)

# Now we are ready to instantiate the module.
instance = Instance(module, import_object)

# … But (!) WASI needs an access to the memory of the
# module. Simple, pass it.
wasi_env.memory = instance.exports.memory

# Here we go, let's start the program.
instance.exports._start()