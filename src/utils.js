import { RGB_PROPERTIES, COLOR_TYPES, RGB_REGEX } from "./constants";

export function isRgbInValidRange(int) {
    return int >= 0 && int <= 255;
}

export function validateRgbObject(obj) {
    if (RGB_PROPERTIES.some(prop => !(prop in obj)))
        throw Error(
            `Object ${JSON.stringify(obj)} does not include required properties`
        );
}

/**
 * Infer the type of the given color value, returns string.
 *
 * @param {string|object} value Color value.
 */
export function getColorType(value) {
    const isValidHexLenght = val => val.length === 3 || val.length === 6;
    const handleHex = val => {
        if (val.length === 3) return COLOR_TYPES["HexShort"];
        if (val.length === 6) return COLOR_TYPES["HexLong"];
    };

    // Check if value is object.-
    if (typeof value === "object") {
        validateRgbObject(value);
        return COLOR_TYPES["Object"];
    }

    if (typeof value !== "string") {
        throw Error("Value was not string");
    }

    // Check if hex starting with hash.
    if (value.startsWith("#")) {
        const colorValues = value.substr(1);
        if (!isValidHexLenght(colorValues)) {
            throw Error(
                "Value started with hash but had invalid number of color values"
            );
        }

        const hexType = handleHex(colorValues);
        if (hexType) return hexType;
    }

    // Check if value is RGB.
    if (value.startsWith("rgb")) {
        if (!RGB_REGEX.test(value))
            throw Error("Value started with rgb but had invalid form");

        return COLOR_TYPES["RGB"];
    }

    // Value has to be hex without prefix.
    const hexType = handleHex(value);
    if (hexType) return hexType;

    throw Error("Couldn't determine the color type of the value");
}
