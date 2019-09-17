import * as conversions from "../src/conversions";

describe("Hex conversions", () => {
    it("should convert hex to obj", () => {
        let obj = conversions.hexToObj("#fff");
        expect(obj).toEqual({ r: 255, g: 255, b: 255 });

        obj = conversions.hexToObj("#f0f");
        expect(obj).toEqual({ r: 255, g: 0, b: 255 });

        obj = conversions.hexToObj("#00f");
        expect(obj).toEqual({ r: 0, g: 0, b: 255 });

        obj = conversions.hexToObj("#AA103E");
        expect(obj).toEqual({ r: 170, g: 16, b: 62 });
    });

    it("should convert obj to hex", () => {
        let obj = conversions.objToHex({ r: 255, g: 255, b: 255 });
        expect(obj).toEqual("#ffffff");
        obj = conversions.objToHex(
            { r: 255, g: 255, b: 255 },
            { shortForm: true }
        );
        expect(obj).toEqual("#fff");
        obj = conversions.objToHex(
            { r: 255, g: 255, b: 255 },
            { shortForm: true, prefix: false }
        );
        expect(obj).toEqual("fff");

        obj = conversions.objToHex({ r: 255, g: 0, b: 255 });
        expect(obj).toEqual("#ff00ff");
        obj = conversions.objToHex(
            { r: 255, g: 0, b: 255 },
            { shortForm: true }
        );
        expect(obj).toEqual("#f0f");

        obj = conversions.objToHex(
            { r: 170, g: 16, b: 62 },
            { shortForm: true }
        );
        expect(obj).toEqual("#aa103e");
        obj = conversions.objToHex(
            { r: 170, g: 16, b: 62 },
            { shortForm: false }
        );
        expect(obj).toEqual("#aa103e");
    });

    it("should fail for invalid hex", () => {
        let func = () => conversions.hexToObj("e");
        expect(func).toThrow();
        func = () => conversions.hexToObj("12341246uä");
        expect(func).toThrow();
        func = () => conversions.hexToObj("1231231");
        expect(func).toThrow();
    });

    it("should fail for invalid obj", () => {
        let func = () => conversions.objToHex({ r: -5, g: 5, b: 5 });
        expect(func).toThrow();
        func = () => conversions.objToHex({ r: 255, g: 255 });
        expect(func).toThrow();
    });
});

describe("RGB conversions", () => {
    it("should convert rgb to obj", () => {
        let obj = conversions.rgbToObj("rgb(255, 0, 255)");
        expect(obj).toEqual({ r: 255, g: 0, b: 255 });

        obj = conversions.rgbToObj("rgb(128, 128, 128)");
        expect(obj).toEqual({ r: 128, g: 128, b: 128 });

        obj = conversions.rgbToObj("rgba(32,125,255,0.1)");
        expect(obj).toEqual({ r: 32, g: 125, b: 255, a: 0.1 });
    });

    it("should convert obj to rgb", () => {
        let obj = conversions.objToRgb({ r: 255, g: 0, b: 255 });
        expect(obj).toEqual("rgb(255,0,255)");

        obj = conversions.objToRgb({ r: 127, g: 127, b: 127 });
        expect(obj).toEqual("rgb(127,127,127)");

        obj = conversions.objToRgb({ r: 0, g: 0, b: 255, a: 0.2 });
        expect(obj).toEqual("rgba(0,0,255,0.2)");
    });

    it("should convert rgb to hex", () => {
        let obj = conversions.rgbToHex("rgb(255, 0, 255)");
        expect(obj).toEqual("#ff00ff");
        obj = conversions.rgbToHex("rgb(255, 0, 255)", { shortForm: true });
        expect(obj).toEqual("#f0f");
        obj = conversions.rgbToHex("rgb(170, 16, 62)", { shortForm: true });
        expect(obj).toEqual("#aa103e");
    });

    it("should convert hex to rgb", () => {
        let obj = conversions.hexToRgb("0e0");
        expect(obj).toEqual("rgb(0,238,0)");
        obj = conversions.rgbToHex("rgba(128, 128, 128, 0.2)", {
            shortForm: true
        });
        expect(obj).toEqual("#808080");
        obj = conversions.rgbToHex("rgba(255, 255, 255, 0.2)", {
            shortForm: true
        });
        expect(obj).toEqual("#fff");
    });
});
