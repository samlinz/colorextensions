export const COLOR_TYPES = {
    Object: "object",
    HexShort: "hex_short",
    HexLong: "hex_long",
    RGB: "rgb",
    HSL: "hsl"
};

export const RGB_PROPERTIES = ["r", "g", "b"];
export const RGB_REGEX = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)/i;
export const HSL_REGEX = /hsla?\(\s*(\d+)\s*,\s*(\d+)\s*%,\s*(\d+)%\s*(?:,\s*([\d.]+)\s*)?\)/i;
