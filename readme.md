# TODO #

- [X] Decode data to pure voxel representation.
- [X] Write a particle base volume renderer.
- [X] Write a Three.js based volumetric renderer.
- [X] Discover a possibility of mipmaping
- [X] Write volumetric shader.
- [X] Volumetric frustrum culling
- [X] Add slice rendering alongside nearest neighbor and linear interpolation
- [ ] Webgl limits texture size by its highest dimmension. So I must write a rectangular montage instead of a vertical one.
- [ ] Option to change background color
- [X] add gui folders/categories
  - example: https://workshop.chromeexperiments.com/examples/gui/#3--Folders
- [ ] connect to code climate
- [ ] Camera Control should log its state as an URL, which would provide the possibility to share user views, and as dat.gui state als to save different views between sessions.
  - example: https://workshop.chromeexperiments.com/examples/gui/#5--Saving-Values
  - example: https://workshop.chromeexperiments.com/examples/gui/#9--Updating-the-Display-Automatically
- [ ] Make gui not selectable while moving camera, to avoid accidental gui element selection.
- [ ] Window scale responsivness.
- [ ] Separate Orthographics Camera Control to its own module
- [ ] Camera view slicer
- [ ] Front-end data validaton
- [ ] VR gui
- [ ] ranged sliders for xyz clipping
- [ ] Dive into the shader
  - [ ] near clipping
  - [ ] dynamic volumetric data reshape
- [ ] Non realtime rendering

## Optimalization ##

- [ ] while paning render only the new piercing points in the camera space.
- [ ] while zooming-in only render in a given frame frequency, sclae up the render result in the rest

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
