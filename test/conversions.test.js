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

        obj = conversions.convertTo("#000", "object");
        expect(obj).toEqual({ r: 0, g: 0, b: 0 });
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

        obj = conversions.convertTo({ r: 0, g: 255, b: 255 }, "hex", {
            shortForm: true
        });
        expect(obj).toEqual("#0ff");
    });

    it("should convert hex to rgb", () => {
        let obj = conversions.hexToRgb("0e0");
        expect(obj).toEqual("rgb(0, 238, 0)");

        obj = conversions.rgbToHex("rgba(128, 128, 128, 0.2)", {
            shortForm: true
        });
        expect(obj).toEqual("#808080");

        obj = conversions.rgbToHex("rgba(255, 255, 255, 0.2)", {
            shortForm: true
        });
        expect(obj).toEqual("#fff");

        obj = conversions.convertTo("#fff", "rgb");
        expect(obj).toEqual("rgb(255, 255, 255)");
    });

    it("should convert hex to hsl", () => {
        let hsl = conversions.hexToHsl("f0f");
        expect(hsl).toEqual("hsl(300, 100%, 50%)");

        hsl = conversions.hexToHsl("#BFBFBF");
        expect(hsl).toEqual("hsl(0, 0%, 75%)");

        hsl = conversions.convertTo("000080", "hsl");
        expect(hsl).toEqual("hsl(240, 100%, 25%)");
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

        obj = conversions.convertTo("rgb(255, 128, 0)", "object");
        expect(obj).toEqual({ r: 255, g: 128, b: 0 });
    });

    it("should convert obj to rgb", () => {
        let obj = conversions.objToRgb({ r: 255, g: 0, b: 255 });
        expect(obj).toEqual("rgb(255, 0, 255)");

        obj = conversions.objToRgb({ r: 127, g: 127, b: 127 });
        expect(obj).toEqual("rgb(127, 127, 127)");

        obj = conversions.objToRgb({ r: 0, g: 0, b: 255, a: 0.2 });
        expect(obj).toEqual("rgba(0, 0, 255, 0.2)");

        obj = conversions.convertTo({ r: 0, g: 128, b: 255, a: 0.2 }, "rgb");
        expect(obj).toEqual("rgba(0, 128, 255, 0.2)");
    });

    it("should convert rgb to hex", () => {
        let obj = conversions.rgbToHex("rgb(255, 0, 255)");
        expect(obj).toEqual("#ff00ff");

        obj = conversions.rgbToHex("rgb(255, 0, 255)", { shortForm: true });
        expect(obj).toEqual("#f0f");

        obj = conversions.rgbToHex("rgb(170, 16, 62)", { shortForm: true });
        expect(obj).toEqual("#aa103e");

        obj = conversions.convertTo("rgb(0, 128, 255)", "hex", {
            shortForm: true
        });
        expect(obj).toEqual("#0080ff");

        obj = conversions.convertTo("rgb(0, 0, 0)", "hex", {
            shortForm: true,
            prefix: false
        });
        expect(obj).toEqual("000");
    });

    it("should convert rgb to hsl", () => {
        let hsl = conversions.rgbToHsl("rgb(255, 0, 255)");
        expect(hsl).toEqual("hsl(300, 100%, 50%)");

        hsl = conversions.rgbToHsl("rgba(128, 0, 128, 0)");
        expect(hsl).toEqual("hsla(300, 100%, 25%, 0)");

        hsl = conversions.convertTo("rgb(0, 0, 0)", "hsl");
        expect(hsl).toEqual("hsl(0, 0%, 0%)");
    });

    it("should fail for invalid rgb", () => {
        let func = () => conversions.objToRgb({ r: 0, g: 0 });
        expect(func).toThrow("does not include");

        func = () => conversions.objToRgb({ r: 0, g: 0, b: "asd" });
        expect(func).toThrow("non-numeric");
    });
});

describe("HSL conversions", () => {
    it("should convert hsl to obj", () => {
        let obj = conversions.hslToObj("hsl(240, 100%, 50%)");
        expect(obj).toEqual({
            r: 0,
            g: 0,
            b: 255
        });

        obj = conversions.hslToObj("hsl(105,58%,85%)");
        expect(obj).toEqual({
            r: 206,
            g: 239,
            b: 195
        });

        obj = conversions.hslToObj("hsla(300, 100%,25%, 0.2)");
        expect(obj).toEqual({
            r: 128,
            g: 0,
            b: 128,
            a: 0.2
        });

        obj = conversions.convertTo("hsl(240,50%,25%)", "object");
        expect(obj).toEqual({
            r: 32,
            g: 32,
            b: 96
        });
    });

    it("should convert obj to hsl", () => {
        let hsl = conversions.objToHsl({
            r: 32,
            g: 32,
            b: 96
        });
        expect(hsl).toEqual("hsl(240, 50%, 25%)");

        hsl = conversions.objToHsl({
            r: 0,
            g: 255,
            b: 255
        });
        expect(hsl).toEqual("hsl(180, 100%, 50%)");

        hsl = conversions.convertTo(
            {
                r: 0,
                g: 255,
                b: 0,
                a: 0.7
            },
            "hsl"
        );
        expect(hsl).toEqual("hsla(120, 100%, 50%, 0.7)");
    });

    it("should convert hsl to rgb", () => {
        let rgb = conversions.hslToRgb("hsl(180, 100%, 25%)");
        expect(rgb).toEqual("rgb(0, 128, 128)");

        rgb = conversions.hslToRgb("hsl(180, 100%, 25%, 0.2)");
        expect(rgb).toEqual("rgba(0, 128, 128, 0.2)");

        rgb = conversions.convertTo("hsl(100, 66%, 99%)", "rgb");
        expect(rgb).toEqual("rgb(252, 254, 251)");
    });

    it("should convert hsl to hex", () => {
        let hex = conversions.hslToHex("hsl(180, 100%, 25%)");
        expect(hex).toEqual("#008080");

        hex = conversions.hslToHex("hsl(0, 100%, 50%)", {
            shortForm: true
        });
        expect(hex).toEqual("#f00");

        hex = conversions.convertTo("hsl(240, 100%, 50%)", "hex", {
            shortForm: true
        });
        expect(hex).toEqual("#00f");
    });

    it("should fail for invalid hsl", () => {
        let func = () =>
            conversions.objToHsl({
                r: 255,
                g: 0,
                b: "asdf128"
            });
        expect(func).toThrow("non-numeric");

        func = () =>
            conversions.objToHsl({
                r: 255,
                g: 0
            });
        expect(func).toThrow("not include");

        func = () =>
            conversions.objToHsl({
                r: 255,
                g: 0,
                b: -5
            });
        expect(func).toThrow();

        func = () => conversions.hslToObj("hsl(400, 0%, 0%)");
        expect(func).toThrow("out-of-range");

        func = () => conversions.hslToObj("hsl(0, 120%, 0%)");
        expect(func).toThrow("out-of-range");

        func = () => conversions.hslToObj("hsl(0, 0%, 300%)");
        expect(func).toThrow("out-of-range");
    });
});
