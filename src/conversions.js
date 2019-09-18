import { RGB_PROPERTIES, RGB_REGEX, COLOR_TYPES, HSL_REGEX } from "./constants";
import { isRgbInValidRange, validateRgbObject, getColorType } from "./utils";

/**
 * Convert color as hex string to object with rgb integer properties.
 *
 * @exports
 * @param {string} hex Color as hexadecimal string, short or long form.
 * @returns JS Object with r, g, b, (a) properties.
 */
export function hexToObj(hex) {
    if (typeof hex !== "string") throw Error(`${hex} is not string`);

    let hexStr = hex.slice();

    // Remove the prefix if present.
    if (hexStr[0] === "#") hexStr = hexStr.substr(1);

    const hexLen = hexStr.length;

    // Check if the hex string is short or long form.
    let shortForm = null;
    if (hexLen === 3) shortForm = true;
    else if (hexLen === 6) shortForm = false;
    else throw Error(`Invalid length for hex string ${hexLen}`);

    const result = {
        r: null,
        g: null,
        b: null
    };

    const charsPerColor = shortForm ? 1 : 2;
    for (const key of Object.keys(result)) {
        let colorStr = hexStr.substr(0, charsPerColor);
        hexStr = hexStr.substr(charsPerColor);
        if (colorStr.length === 1) {
            colorStr = colorStr.repeat(2);
        }
        const colorInt = parseInt(colorStr, 16);
        if (Number.isNaN(colorInt)) {
            throw Error(`Failed to convert string ${colorStr} to integer`);
        }
        result[key] = colorInt;
    }

    return result;
}

/**
 * Convert RGB object to hex string.
 *
 * @exports
 * @param {object} obj JS Object with r, g, b, (a) properties.
 * @param {object?} options Optional hex options.
 * @returns Hex color string.
 */
export function objToHex(obj, options) {
    validateRgbObject(obj);

    const optShortForm = options && options.shortForm;
    const optPrefix = options && "prefix" in options ? options.prefix : true;

    let result = optPrefix ? "#" : "";
    for (const property of RGB_PROPERTIES) {
        const colorInt = +obj[property];
        if (!isRgbInValidRange(colorInt))
            throw Error(`Color is not valid rgb ${colorInt}`);

        let colorHex = colorInt.toString(16);
        if (colorHex.length === 1) colorHex = `0${colorHex}`;
        result += colorHex;
    }

    // Convert hex string to short form if possible.
    if (optShortForm) {
        const hexWithoutPrefix = optPrefix ? result.substr(1) : result.slice();
        let resultShort = optPrefix ? "#" : "";

        for (let i = 0; i < 3; i++) {
            // Verify that color can be reprented in short form.
            if (hexWithoutPrefix[i * 2] !== hexWithoutPrefix[i * 2 + 1]) {
                resultShort = null;
                break;
            }
            resultShort += hexWithoutPrefix[i * 2];
        }

        result = resultShort || result;
    }

    return result;
}

/**
 * Convert RGB string to RGB object.
 *
 * @param {string} rgb RGB color string.
 * @returns JS Object with r, g, b, (a) properties.
 */
export function rgbToObj(rgb) {
    const matches = RGB_REGEX.exec(rgb);
    if (!matches) throw Error(`Could not parse rgb ${rgb}`);
    if (matches.length < 4) throw Error(`Invalid number of matched groups`);

    const result = {
        r: +matches[1],
        g: +matches[2],
        b: +matches[3]
    };

    // RGBA.
    if (matches[4] !== undefined) {
        result["a"] = +matches[4];
    }

    return result;
}

/**
 * Convert RGB object to rgb string.
 *
 * @param {object} obj JS Object with r, g, b, (a) properties.
 * @return RGB(A) color string.
 */
export function objToRgb(obj) {
    validateRgbObject(obj);
    const rgba = obj.a !== undefined && obj.a !== null;
    const prefix = rgba ? "rgba" : "rgb";

    // Make sure that alpha value has at max 2 decimal places.
    let rgbaValue = obj["a"];
    if (rgba) {
        const rgbaText = rgbaValue + "";
        rgbaValue = rgbaText.length > 3 ? rgbaValue.toFixed(2) : rgbaValue;
    }

    return `${prefix}(${obj["r"]}, ${obj["g"]}, ${obj["b"]}${
        rgba ? `, ${rgbaValue}` : ""
    })`;
}

/**
 * Convert hex string to RGB string.
 *
 * @exports
 * @param {string} hex Hex string.
 * @param {object?} options
 * @return RGB(A) color string.
 */
export function hexToRgb(hex) {
    return objToRgb(hexToObj(hex));
}

/**
 * Convert HSL(A) string into JS object.
 *
 * @exports
 * @param {string} hsl HSL(A) string.
 * @returns JS Object with r, g, b, (a) properties.
 */
export function hslToObj(hsl) {
    const matches = HSL_REGEX.exec(hsl);
    if (!matches) throw Error(`Could not parse hsl ${hsl}`);
    if (matches.length < 4) throw Error(`Invalid number of matched groups`);

    const { h, s, l } = {
        h: +matches[1],
        s: +matches[2] / 100,
        l: +matches[3] / 100
    };

    if (h < 0 || h >= 360) throw Error(`H ${h} out-of-range`);
    if (s < 0 || s > 1) throw Error(`S ${s * 100} out-of-range`);
    if (l < 0 || l > 1) throw Error(`L ${l * 100} out-of-range`);

    let a = null;
    if (matches[4] !== undefined) {
        a = +matches[4];
    }

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r_,
        g_,
        b_ = 0;

    if (h >= 0 && h < 60) {
        [r_, g_, b_] = [c, x, 0];
    }
    if (h >= 60 && h < 120) {
        [r_, g_, b_] = [x, c, 0];
    }
    if (h >= 120 && h < 180) {
        [r_, g_, b_] = [0, c, x];
    }
    if (h >= 180 && h < 240) {
        [r_, g_, b_] = [0, x, c];
    }
    if (h >= 240 && h < 300) {
        [r_, g_, b_] = [x, 0, c];
    }
    if (h >= 300 && h < 360) {
        [r_, g_, b_] = [c, 0, x];
    }

    const [r, g, b] = [(r_ + m) * 255, (g_ + m) * 255, (b_ + m) * 255];

    const result = {
        r: Math.round(r),
        g: Math.round(g),
        b: Math.round(b)
    };

    if (a !== undefined && a !== null) {
        result.a = a;
    }

    return result;
}

/**
 * Convert RGB object to HSL string.
 * Adapted from https://www.rapidtables.com/convert/color/hsl-to-rgb.html
 *
 * @exports
 * @param {object} obj Object with r, g, b, (a) properties.
 * @returns HSL(A) color string.
 */
export function objToHsl(obj) {
    validateRgbObject(obj);

    const { r, g, b, a } = obj;
    const r_ = r / 255,
        g_ = g / 255,
        b_ = b / 255;
    const cMax = Math.max(r_, g_, b_);
    const cMin = Math.min(r_, g_, b_);
    const delta = cMax - cMin;

    let h = 0;
    if (delta > 0) {
        if (cMax === r_) {
            h = (((g_ - b_) / delta) % 6) * 60;
        } else if (cMax === g_) {
            h = ((b_ - r_) / delta + 2) * 60;
        } else if (cMax === b_) {
            h = ((r_ - g_) / delta + 4) * 60;
        } else {
            throw Error(`Delta out of range ${delta}`);
        }
    }

    if (h < 0) {
        h = 360 + h;
    } else if (h > 360) {
        h = h - 360;
    } else if (h === 360) {
        h = 0;
    }

    let l = (cMax + cMin) / 2;
    let s = 0;
    if (delta !== 0) {
        s = delta / (1 - Math.abs(2 * l - 1));
    }

    l *= 100;
    s *= 100;

    h = Math.round(h);
    s = Math.round(s);
    l = Math.round(l);

    const useAlpha = a !== undefined && a !== null;
    return `hsl${useAlpha ? "a" : ""}(${h}, ${s}%, ${l}%${
        useAlpha ? `, ${a}` : ""
    })`;
}

/**
 * Convert RGB string to hex string.
 *
 * @exports
 * @param {string} rgb RGB color string.
 * @param {object?} options Optional hex options.
 * @return Hex color string.
 */
export function rgbToHex(rgb, options) {
    return objToHex(rgbToObj(rgb), options);
}

/**
 * Convert HSL string to Hex string.
 *
 * @export
 * @param {string} hsl HSL(A) color string.
 * @param {object?} options Optional hex options.
 * @returns
 */
export function hslToHex(hsl, options) {
    return objToHex(hslToObj(hsl), options);
}

/**
 * Convert Hex string to HSL(A) string.
 *
 * @exports
 * @param {string} hex Hex color string.
 * @returns HSL(A) color string.
 */
export function hexToHsl(hex) {
    return objToHsl(hexToObj(hex));
}

/**
 * Convert RGB(A) string to HSL(A) string.
 *
 * @exports
 * @param {string} rgb RGB(A) color string.
 * @returns HSL(A) color string
 */
export function rgbToHsl(rgb) {
    return objToHsl(rgbToObj(rgb));
}

/**
 * Convert HSL(A) string to RGB(A) string.
 *
 * @exports
 * @param {string} rgb HSL(A) color string.
 * @returns RGB(A) color string.
 */
export function hslToRgb(rgb) {
    return objToRgb(hslToObj(rgb));
}

/**
 * Convert any given valid color string or object into another color type.
 * Type of the value will be inferred automatically.
 *
 * @exports
 * @param {string|object} value Any valid color value.
 * @param {string} convertToType Target color type.
 * @param {object?} options Optional hex options.
 * @return Provided color value converted to provided type.
 */
export function convertTo(value, convertToType, options) {
    // Get source type.
    const type = getColorType(value);

    // Source: hex.
    if (type.startsWith("hex")) {
        if (convertToType === COLOR_TYPES["RGB"]) return hexToRgb(value);
        if (convertToType === COLOR_TYPES["HSL"]) return hexToHsl(value);
        if (convertToType === COLOR_TYPES["Object"]) return hexToObj(value);
        return objToHex(hexToObj(value), options);
    }

    // Source: rgb.
    if (type === COLOR_TYPES["RGB"]) {
        if (convertToType === COLOR_TYPES["Object"]) return rgbToObj(value);
        if (convertToType === COLOR_TYPES["HSL"]) return rgbToHsl(value);
        if (convertToType.startsWith("hex")) {
            return rgbToHex(value, options);
        }
        return objToRgb(rgbToObj(value));
    }

    // Source: HSL.
    if (type === COLOR_TYPES["HSL"]) {
        if (convertToType.startsWith("rgb")) return hslToRgb(value);
        if (convertToType === COLOR_TYPES["Object"]) return hslToObj(value);
        if (convertToType.startsWith("hex")) {
            return hslToHex(value, options);
        }
        const obj = hslToObj(value);
        return objToHsl(obj);
    }

    // Source: object.
    if (type === COLOR_TYPES["Object"]) {
        if (convertToType.startsWith("hex")) return objToHex(value, options);
        if (convertToType === COLOR_TYPES["RGB"]) return objToRgb(value);
        if (convertToType === COLOR_TYPES["HSL"]) return objToHsl(value);
        return value;
    }

    throw Error("Invalid type for the input value");
}
