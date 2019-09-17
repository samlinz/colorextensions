export const COLOR_TYPES = {
    Object: "object",
    HexShort: "hex_short",
    HexLong: "hex_long",
    RGB: "rgb"
};

export const RGB_PROPERTIES = ["r", "g", "b"];
export const RGB_REGEX = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)/i;
