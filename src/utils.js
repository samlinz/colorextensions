import { RGB_PROPERTIES, COLOR_TYPES, RGB_REGEX, HSL_REGEX } from "./constants";

export function isRgbInValidRange(int) {
    return int >= 0 && int <= 255;
}

export function validateRgbObject(obj) {
    if (RGB_PROPERTIES.some(prop => !(prop in obj)))
        throw Error(
            `Object ${JSON.stringify(obj)} does not include required properties`
        );

    if (RGB_PROPERTIES.some(prop => Number.isNaN(+obj[prop])))
        throw Error(`Object ${JSON.stringify(obj)} had non-numeric property`);

    if (
        RGB_PROPERTIES.some(prop => {
            const val = +obj[prop];
            return val < 0 || val > 255;
        })
    )
        throw Error(`Object ${JSON.stringify(obj)} had out-of-range values`);
}

/**
 * Infer the type of the given color value, returns string.
 *
 * @exports
 * @param {string|object} value Color value.
 * @returns String of the color's type.
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

    // Check if value is RGB(A).
    if (value.startsWith("rgb")) {
        if (!RGB_REGEX.test(value))
            throw Error("Value started with rgb but had invalid form");

        return COLOR_TYPES["RGB"];
    }

    // Check if value is HSL(A).
    if (value.startsWith("hsl")) {
        if (!HSL_REGEX.test(value))
            throw Error("Value started with hsl but had invalid form");

        return COLOR_TYPES["HSL"];
    }

    // Value has to be hex without prefix.
    const hexType = handleHex(value);
    if (hexType) return hexType;

    throw Error("Couldn't determine the color type of the value");
}

export function parseHsl(hsl) {
    const matches = HSL_REGEX.exec(hsl);
    if (!matches) throw Error(`Could not parse hsl ${hsl}`);
    if (matches.length < 4) throw Error(`Invalid number of matched groups`);

    const { h, s, l } = {
        h: +matches[1],
        s: +matches[2],
        l: +matches[3]
    };

    if (h < 0 || h >= 360) throw Error(`H ${h} out-of-range`);
    if (s < 0 || s > 100) throw Error(`S ${s} out-of-range`);
    if (l < 0 || l > 100) throw Error(`L ${l} out-of-range`);

    let a = null;
    if (matches[4] !== undefined) {
        a = +matches[4];
    }

    return { h, s, l, a };
}
