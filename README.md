# WIP - CanvasGL
`canvas-gl` is a wrapper around WebGL to give it a friendlier interface with some out-of-the-box drawing commands similar to the plain old `CanvasRenderingContext2D` API. 

## API
The API is designed to be friendly to someone who neither knows nor cares about WebGL and just wants to draw some stuff on the canvas quickly. 

Using this library will not be as performant as writing your own project-specific implementation (and if you do I recommend [regl](https://github.com/regl-project/regl)) as we can't assume anything about individual use cases.

If you want a more performant, low-implementation cost WebGL replacement for `CanvasRenderingContext2D` then give this a try!

## Example
Please see the `test-project` workspace on GitHub for up-to-date usage examples.

## TODO
- Rects
- Arcs
- Bezier curves
- Arbritrary paths with miters?
- Line caps
- Gradient coloring of primitives
- Anti-aliasing  

__Potential TODOs__:
- Custom primitive registration by passing custom regl commands?
- Helper function for resizing the canvas, respecting DPR?

## Attributions
* [regl](https://github.com/regl-project/regl) - Copyright (c) 2016 Mikola Lysenko
* [parse-css-color](https://github.com/noeldelgado/parse-css-color) - Copyright (c) Noel Delgado <pixelia.me@gmail.com> (pixelia.me)

## Contributions
Contributions are always welcome! Please submit them on GitHub :)