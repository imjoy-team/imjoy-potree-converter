.PHONY: default
default: build


# OLD
#	[ -d $@ ] || git clone https://github.com/m-schuetz/LAStools.git
#	# Patch it	
#	cp LAStools/LASlib/src/Makefile LAStools/LASlib/src/Makefile.old && \
#	sed 's/COMPILER  = g++$$/COMPILER  = ${CXX}/g' < LAStools/LASlib/src/Makefile.old > LAStools/LASlib/src/Makefile

LASzip:
	cd LAStools/LASzip && \
	mkdir -p build && cd build && \
	CC="$(CC)" CXX="$(CXX)" cmake -DCMAKE_BUILD_TYPE=Release .. \
		-DCMAKE_C_COMPILER="$(CC)" -DCMAKE_CXX_COMPILER="$(CXX)" && \
	make -j$(nproc) && \
	emranlib src/liblaszip.a


.PHONY: LAStools
LAStools: LASzip
	cd LAStools/LASlib/src && \
	CC="$(CC)" CXX="$(CXX)" make && \
	cd ../../src && \
	LIBS="-llaszip -L../LASzip/build/src" CC="$(CC)" CXX="$(CXX)" make


HERE=$(realpath ./)
PotreeConverter: LASzip
	mkdir -p build && cd build && \
	CC="$(CC)" CXX="$(CXX)" cmake .. \
		-DCMAKE_C_COMPILER="$(CC)" -DCMAKE_CXX_COMPILER="$(CXX)" \
		-DCMAKE_BUILD_TYPE=Release \
		-DLASZIP_INCLUDE_DIRS=$(HERE)/LAStools/LASzip/dll \
		-DLASZIP_LIBRARY_DIR=$(HERE)/LAStools/LASzip/build/src/ && \
	make -j$(nproc) && \
	cp $(HERE)/PotreeConverter/index.html $(HERE)/build/PotreeConverter/index.html && \
	cp $(HERE)/build/PotreeConverter/*.js $(HERE)/docs && \
	cp $(HERE)/build/PotreeConverter/*.wasm $(HERE)/docs


#		-DLASZIP_LIBRARY=$(HERE)/LAStools/LASzip/build/src/liblaszip.dylib && \

.PHONY: build
build: PotreeConverter LAStools

.PHONY: clean
clean:
	rm -rf build
	cd LAStools && make clean
