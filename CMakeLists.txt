cmake_minimum_required(VERSION 2.8)

project(Potree)

set(CMAKE_MODULE_PATH "${CMAKE_SOURCE_DIR}/cmake" ${CMAKE_MODULE_PATH})

set(CMAKE_EXECUTABLE_SUFFIX ".js")

if(UNIX)
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall  -std=c++20 -lstdc++ -lm -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -s EXPORTED_FUNCTIONS=['_main'] -lidbfs.js -lproxyfs.js -lworkerfs.js -s EXPORTED_RUNTIME_METHODS=['ccall','cwrap','callMain','FS'] -s ENVIRONMENT='web','worker' -s EXPORT_ES6=1 -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s NO_EXIT_RUNTIME=1 --pre-js ${CMAKE_CURRENT_LIST_DIR}/PotreeConverter/prepend.js")
    # set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -std=c++17 -pthread -lstdc++ -lstdc++fs -lm")
    # SET(CMAKE_EXE_LINKER_FLAGS  "${CMAKE_EXE_LINKER_FLAGS} -lstdc++fs" )
endif()


add_subdirectory(PotreeConverter)
