window.ColorExtensions = (function() {
    const COLOR_TYPES = {
        Object: "object",
        HexShort: "hex_short",
        HexLong: "hex_long",
        RGB: "rgb"
    };

    const RGB_PROPERTIES = ["r", "g", "b"];
    const RGB_REGEX = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/;

    function isRgbInValidRange(int) {
        return int >= 0 && int <= 255;
    }

    alert('hello world!')

    function validateRgbObject(obj) {
        if (RGB_PROPERTIES.some(prop => !(prop in obj)))
            throw Error(
                `Object ${JSON.stringify(
                    obj
                )} does not include required properties`
            );
    }

    /**
     * Convert color as hex string to object with rgb integer properties.
     * @param {string} hex Color as hexadecimal string, short or long form.
     */
    function hexToObj(hex) {
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
    function objToHex(obj, options) {
        const optShortForm = options && options.shortForm;
        const optPrefix = options && options.prefix ? options.prefix : true;

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
            const hexWithoutPrefix = optPrefix
                ? result.substr(1)
                : result.slice();
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
    function rgbToObj(rgb) {
        const matches = RGB_REGEX.exec(rgb);
        if (!matches) throw Error(`Could not parse rgb ${rgb}`);
        if (matches.length !== 4)
            throw Error(`Invalid number of matched groups`);
        return {
            r: matches[1],
            g: matches[2],
            b: matches[3]
        };
    }

    /**
     * Convert RGB object to rgb string.
     * @param {object} obj RGB object.
     */
    function objToRgb(obj, options) {
        const optAlpha = (options && options.alpha) || null;

        validateRgbObject(obj);
        const prefix = optAlpha !== null ? "rgba" : "rgb";
        return `${prefix}(${obj["r"]},${obj["g"]},${obj["b"]}${
            optAlpha ? `,${optAlpha}` : ""
        })`;
    }

    /**
     * Convert hex string to RGB string.
     * @param {string} hex Hex string.
     * @param {object?} options
     */
    function hexToRgb(hex, options) {
        return objToRgb(hexToObj(hex), options);
    }

    /**
     * Convert RGB string to hex string.
     * @param {string} rgb RGB string.
     * @param {object?} options
     */
    function rgbToHex(rgb, options) {
        return objToHex(rgbToObj(rgb), options);
    }

    function getColorType(value) {
        const isValidHexLenght = val => val.length === 3 || val.length === 6;
        const handleHex = val => {
            if (val.length === 3) return COLOR_TYPES["HexShort"];
            if (val.length === 6) return COLOR_TYPES["HexLong"];
        };

        // Check if value is object.-
        if (typeof value === "object") {
            if (RGB_PROPERTIES.every(p => p in value)) {
                return COLOR_TYPES["Object"];
            }
            throw Error("Value was object but was missing required properties");
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

    function convertTo(value, convertToType, options) {
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
            if (convertToType.startsWith("hex"))
                return objToHex(value, options);
            if (convertToType === COLOR_TYPES["RGB"]) return objToRgb(value);
            return value;
        }

        throw Error("Invalid type for the input value");
    }

    /**
     * Class which holds start and end color values and can produce any
     * color between those values.
     */
    class ColorInterpolator {
        constructor(colormap) {
            this.type = getColorType(start);

            this.start = convertTo(start, COLOR_TYPES["Object"]);
            this.stop = convertTo(stop, COLOR_TYPES["Object"]);

            this.rangeR = +this.stop["r"] - +this.start["r"];
            this.rangeG = +this.stop["g"] - +this.start["g"];
            this.rangeB = +this.stop["b"] - +this.start["b"];
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

            // Calculate the new values between the provided start and end values.
            const r = (+this.start["r"] + fraction * this.rangeR) | 0;
            const g = (+this.start["g"] + fraction * this.rangeG) | 0;
            const b = (+this.start["b"] + fraction * this.rangeB) | 0;

            const colorObj = {
                r,
                g,
                b
            };

            // Convert object to either the original or provided color type.
            return convertTo(colorObj, type || this.type);
        }
    }

    function interpolateColor(start, end, fraction, type=null) {
        const interpolator = new ColorInterpolator(start, end);
        return interpolator.getColor(fraction, type);
    }

    // Return public API.
    return {
        hexToObj,
        objToHex,
        objToRgb,
        hexToRgb,
        rgbToHex,
        convertTo,
        ColorInterpolator
    };
})();
