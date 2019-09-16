import * as constants from "./constants";
import * as conversions from "./conversions";
import * as colorInterpolator from "./colorinterpolator";

// Create a global object which exposes an API to browser scripts.
window.ColorExtensions = {
    COLOR_TYPES: constants.COLOR_TYPES,
    RGB_PROPERTIES: constants.RGB_PROPERTIES,
    hexToObj: conversions.hexToObj,
    objToHex: conversions.objToHex,
    objToRgb: conversions.objToRgb,
    hexToRgb: conversions.hexToRgb,
    rgbToHex: conversions.rgbToHex,
    convertTo: conversions.convertTo,
    ColorMap: colorInterpolator.ColorMap,
    ColorInterpolator: colorInterpolator.ColorInterpolator
};
