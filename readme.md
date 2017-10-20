# TODO #
- [x] Get sample volume data from [Stanford's database](https://graphics.stanford.edu/data/voldata/)
- [ ] compress,
- [ ] Generate a cheksum, stream data to the front-end, check integrity
- [ ] decompress
- [ ] Decode data to pure voxel representation.
- [ ] Find or write a volumetric renderer, preferebly Three.js base.

## Sources ##

### three.js examples ###

* kinect

### Basic ###
- https://en.wikipedia.org/wiki/Scalar_field
- https://en.wikipedia.org/wiki/Voxel
- https://en.wikipedia.org/wiki/Volume_rendering

### Advenced ###
- Book: Production volume rendering

### Practical ###
- http://www.lebarba.com/ and its resources


## Questions ##
- Should I do data preprocessing, like Noise reduction?

## cljs vs. js ##
[performance](https://numergent.com/2015-12/ClojureScript-performance-revisited.html) would be statisfying

## Libaries ##
-
- pako is a javascript port of zlib with cljsjs support with node and browser support.
[pako](https://github.com/nodeca/pako)
[zlib](https://zlib.net/)
