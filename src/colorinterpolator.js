import { convertTo } from "./conversions";
import { getColorType } from "./utils";
import { COLOR_TYPES } from "./constants";

/**
 * A color map of two or more points.
 *
 * @export
 * @class ColorMap
 */
export class ColorMap {
    constructor(values) {
        this.fractionsAndColors = [];

        let firstFraction = null;
        let lastFraction = null;

        // Convert color values and range fractions into lists.
        for (const [fraction, color] of Object.entries(values)) {
            const convertedFraction = +fraction;
            const convertedColor = convertTo(color, COLOR_TYPES["Object"]);
            this.fractionsAndColors.push([convertedFraction, convertedColor]);
        }

        this.fractionsAndColors.sort((a, b) => a[0] - b[0]);

        for (const [fraction] of this.fractionsAndColors) {
            if (firstFraction === null) firstFraction = fraction;
            lastFraction = fraction;
        }

        // Validate endpoints.
        if (firstFraction !== 0)
            throw Error(
                `Invalid colormap; should begin from 0, not ${firstFraction}`
            );
        if (lastFraction !== 1)
            throw Error(
                `Invalid colormap; should end in 1, not ${lastFraction}`
            );
    }

    /**
     * Convert the total fraction into a corrected fraction between two colors
     * in color map. Return the corrected fraction from between two colors
     * and also the color endpoints.
     *
     * @param {number} fraction Fraction in the full interval.
     * @returns A tuple of subfraction, start color, end color.
     * @memberof ColorMap
     */
    getColorsAndFraction(fraction) {
        for (let i = 0; i < this.fractionsAndColors.length; i++) {
            const [currentFraction, currentColor] = this.fractionsAndColors[i];
            const [nextFraction, nextColor] = this.fractionsAndColors[i + 1];

            if (fraction >= currentFraction && fraction <= nextFraction) {
                // Found the color interval, get the fraction relative to this subinterval.
                const correctedFraction =
                    (fraction - currentFraction) /
                    (nextFraction - currentFraction);
                return [correctedFraction, currentColor, nextColor];
            }
        }
    }
}

/**
 * Class which holds start and end color values and can produce any
 * color between those values.
 */
export class ColorInterpolator {
    constructor(...args) {
        this.colorMap = null;

        // Object from which the default color will be inferred.
        let colorInferObject = null;

        // Two color points, convert to colormap.
        if (args.length === 2) {
            this.colorMap = new ColorMap({
                0: args[0],
                1: args[1]
            });
            colorInferObject = args[0];
        } else if (args.length === 1) {
            this.colorMap = new ColorMap(args[0]);
            colorInferObject = Object.values(args[0])[0];
        } else {
            throw Error(`Invalid arguments`);
        }

        this.type = getColorType(colorInferObject);
    }

    /**
     * Get color range between two colors.
     *
     * @memberof ColorInterpolator
     */
    getRange(start, stop) {
        return {
            r: +stop["r"] - +start["r"],
            g: +stop["g"] - +start["g"],
            b: +stop["b"] - +start["b"]
        };
    }

    /**
     * Return a color between the start and stop colors.
     *
     * @param {number} fraction Fraction between 0 and 1.
     * @param {string} type If present return the interpolated color in this format.
     */
    getColor(fraction, type = null) {
        if (typeof fraction !== "number") {
            throw Error(`Invalid fraction ${fraction}`);
        }
        if (fraction < 0 || fraction > 1) {
            throw Error(`Fraction out of range ${fraction}`);
        }

        // Get the two color endpoints.
        const [
            correctedFraction,
            startColor,
            stopColor
        ] = this.colorMap.getColorsAndFraction(fraction);

        // Get range between the two colors the fraction falls in between.
        const { r: rangeR, g: rangeG, b: rangeB } = this.getRange(
            startColor,
            stopColor
        );

        // Calculate the new values between the provided start and end values.
        const r = Math.round(+startColor["r"] + correctedFraction * rangeR) | 0;
        const g = Math.round(+startColor["g"] + correctedFraction * rangeG) | 0;
        const b = Math.round(+startColor["b"] + correctedFraction * rangeB) | 0;

        const colorObj = {
            r,
            g,
            b
        };

        // Convert object to either the original or provided color type.
        return convertTo(colorObj, type || this.type);
    }

    /**
     * Create an interpolated color without creating an interpolator object.
     *
     * @static
     * @param {number} fraction Point of the color in color map.
     * @param {any...} args Color map arguments, either start and end point or color map object.
     * @returns A color in the same format as the colors in the map.
     * @memberof ColorInterpolator
     */
    static interpolateColor(fraction, ...args) {
        const interpolator = new ColorInterpolator(...args);
        return interpolator.getColor(fraction);
    }

    /**
     * Generate a list of interpolated colors from a colormap.
     *
     * @param {number} n The count of colors in the list.
     * @param {string?} format Format in which to produce the colors.
     * @returns A list of n colors from the start to end of the colormap.
     * @memberof ColorInterpolator
     */
    generateColors(n, format) {
        const step = 100 / (n - 1);

        const result = [];
        let count = 0;
        for (let i = 0; i <= 100; i += step) {
            count++;

            // Fix potential issues with floating point precision.
            if (count === n) {
                i = 100;
            }
            result.push(this.getColor(i / 100, format));
        }

        if (result.length < n) {
            result.push(this.getColor(1.0, format));
        }

        return result;
    }

    /**
     * Generate a list of interpolated colors from a colormap.
     *
     * @static
     * @param {number} n The count of colors in the list.
     * @param {any...} args Color arguments, either start and end points or color map object.
     * @returns A list of n colors from the start to end of the colormap.
     * @memberof ColorInterpolator
     */
    static generateColors(n, ...args) {
        const interpolator = new ColorInterpolator(...args);
        return interpolator.generateColors(n);
    }
}
