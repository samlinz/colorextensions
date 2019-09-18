import { RGB_PROPERTIES, RGB_REGEX, COLOR_TYPES } from "./constants";
import { isRgbInValidRange, validateRgbObject, getColorType } from "./utils";

/**
 * Convert color as hex string to object with rgb integer properties.
 * @param {string} hex Color as hexadecimal string, short or long form.
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
 * @param {object} obj Object with r, g, b properties.
 * @param {object?} options
 */
export function objToHex(obj, options) {
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
 * @param {string} rgb RGB string.
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
 * @param {object} obj RGB object.
 */
export function objToRgb(obj) {
    validateRgbObject(obj);
    const rgba = "a" in obj;
    const prefix = rgba ? "rgba" : "rgb";

    // Make sure that alpha value has at max 2 decimal places.
    let rgbaValue = obj["a"];
    if (rgba) {
        const rgbaText = rgbaValue + "";
        rgbaValue = rgbaText.length > 3 ? rgbaValue.toFixed(2) : rgbaValue;
    }

    return `${prefix}(${obj["r"]},${obj["g"]},${obj["b"]}${
        rgba ? `,${rgbaValue}` : ""
    })`;
}

/**
 * Convert hex string to RGB string.
 * @param {string} hex Hex string.
 * @param {object?} options
 */
export function hexToRgb(hex, options) {
    return objToRgb(hexToObj(hex), options);
}

/**
 * Convert RGB string to hex string.
 * @param {string} rgb RGB string.
 * @param {object?} options
 */
export function rgbToHex(rgb, options) {
    return objToHex(rgbToObj(rgb), options);
}

/**
 * Convert any given valid color string or object into another color type.
 * Type of the value will be inferred automatically.
 *
 * @param {string|object} value Any valid color value.
 * @param {string} convertToType Target color type.
 * @param {object?} options Additional options object.
 */
export function convertTo(value, convertToType, options) {
    const type = getColorType(value);

    if (type.startsWith("hex")) {
        // Hex to rgb.
        if (convertToType === COLOR_TYPES["RGB"])
            return hexToRgb(value, options);

        // Hex to object.
        if (convertToType === COLOR_TYPES["Object"]) return hexToObj(value);

        // Convert hex to hex.
        const obj = hexToObj(value);
        return objToHex(obj, {
            shortForm: convertToType === COLOR_TYPES["HexShort"]
        });
    }

    if (type === COLOR_TYPES["RGB"]) {
        // Rgb to hex.
        if (convertToType.startsWith("hex")) {
            return rgbToHex(value, {
                shortForm: convertToType === COLOR_TYPES["HexShort"]
            });
        }
        // Rgb to object.
        if (convertToType === COLOR_TYPES["Object"]) return rgbToObj(value);

        // Rgb to rgb.
        const obj = rgbToObj(value);
        return objToRgb(obj, options);
    }

    if (type === COLOR_TYPES["Object"]) {
        if (convertToType.startsWith("hex")) return objToHex(value, options);
        if (convertToType === COLOR_TYPES["RGB"]) return objToRgb(value);
        return value;
    }

    throw Error("Invalid type for the input value");
}
