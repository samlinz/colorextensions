# Color extensions

Parse and convert colors. Interpolate between colors or create colormaps as lists.

## Features

-   Automatically infer color type and parse from string.
-   Convert between types.
-   Create colormaps of two or more colors.
-   Interpolate colors in colormaps.
-   Create lists of colors from colormaps.

## Currently supported types

-   Hex (#000, #FF00FF, ae141c)
    -   Short or long form, with or without hash
-   RGB (rgb(255, 0, 123) rgb(0,0,255))
    -   Whitespace between values allowed but not encouraged
-   RGBA (rgba(0,0,0,0.5))
-   Javascript object
    -   Properties _r_, _g_, _b_, _a_

## Examples

```javascript
const {
    hexToRgb,
    objToRgb,
    convertTo,
    getColorType
} = require("color-extensions");

// Convert between types
hexToRgb("#fff"); // Produces 'rgb(255,255,255)'
objToRgb({ r: 255, g: 128, b: 0, a: 0.1 }); // Produces 'rgba(255,128,0,0.1)'

// Automatic inference of source type.
convertTo("#00ff00", "rgb"); // Produces 'rgb(0,255,0)'
convertTo("#00ff00", "object"); // Produces { r: 0, g: 255, b: 0 }

// Infer the types.
getColorType("#FFF"); // Produces 'hex_short'
getColorType("#FFF000"); // Produces 'hex_long'
```

```javascript
const { ColorInterpolator } = require("color-extensions");

// Create colormap from interval points (range 0-1) and endpoint colors.
const colorMap = {
    0: "#fff", // Start white
    0.3: "#f00", // Red
    0.5: "#000", // Black
    1.0: "#0000ff" // End with blue
};

const interpolator = new ColorInterpolator(colorMap);

// Get single value.
interpolator.getColor(0.23); // Produces '#ff3c3c', the type is inferred from colormap.
interpolator.getColor(0.23, "rgb"); // Produces 'rgb(255,60,60)'

// Get range of color values.
interpolator.generateColors(10);
/*
Produces:
[
    '#ffffff',
    '#ffa1a1',
    '#ff4242',
    '#d50000',
    '#470000',
    '#00001c',
    '#000055',
    '#00008e',
    '#0000c6',
    '#0000ff'
]
*/

// Same thing, explicit format.
interpolator.generateColors(10, "rgb");

// Static version without creating object, also using alpha values.
ColorInterpolator.generateColors(10, "rgba(0,0,0,0.5)", "rgba(255,255,255,1)");
```

## Installation

```
npm install color-extensions
```

Node:

```
const colorExtensions = require("color-extensions")
```

Webpack:

```
import * as colorExtensions from "color-extensions";
```

Browser script:

```
Include file colorextensions.min.js in page and access through global object ColorExtensions
```

## Conversions

Root level functions.

<dl>
  <dt><code>hexToObj(value)</code></dt>
  <dd><em>Hex to JS object</em></dd>
  <dt><code>objToHex(value, hexOptions)</code></dt>
  <dd><em>JS object to hex</em></dd>
  <dt><code>rgbToObj(value)</code></dt>
  <dd><em>RGB/RGBA to JS object</em></dd>
  <dt><code>objToRgb(value)</code></dt>
  <dd><em>JS object to RGB/RGBA. RGBA if *a* property present.</em></dd>
  <dt><code>hexToRgb(value)</code></dt>
  <dd><em>Hex to RGB/RGBA.</em></dd>
  <dt><code>rgbToHex(value, hexOptions)</code></dt>
  <dd><em>RGB/RGBA to hex.</em></dd>
</dl>

Functions converting to hex take optional object which has properties _prefix_ and _shortForm_. Hex colors with shortForm=true use short (3 character) hex color if possible and fall back into 6 character form if not applicable.

## Classes

Root level classes.

#### **ColorMap**

Represents a color map used by interpolator and produces interval colors.
Not really necessary for user.

<dl>
  <dt><code>constructor(colors)</code></dt>
  <dd><em>Creates a colormap from the colormap object.</em></dd>
  <dt><code>getColorsAndFraction(fraction)</code></dt>
  <dd><em>Returns a fraction relative to the subinterval and the endpoint colors.</em></dd>
</dl>

#### **ColorInterpolator**

Produces values from colormap.

<dl>
  <dt><code>constructor(...args)</code></dt>
  <dd><em>Given either two colors, or object representing colormap.</em></dd>
  <dt><code>getColor(fraction, format?)</code></dt>
  <dd><em>Produces the color from the colormap at the provided point, value range 0.0-1.0</em></dd>
  <dt><code>static interpolateColor(fraction, ..args)</code></dt>
  <dd><em>Produces interpolated color at point fraction from the two color range or colormap provided as rest arguments without creating new interpolator.</em></dd>
  <dt><code>generateColors(count, format?)</code></dt>
  <dd><em>Produces a list of length *count* of colors from the interpolator.</em></dd>
  <dt><code>static generateColors(fraction, ..args)</code></dt>
  <dd><em>Same as above but without creating object.</em></dd>
</dl>

## TODO

-   HSL types
-   Matplotlib colormaps
