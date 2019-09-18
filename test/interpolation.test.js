import * as interpolation from "../src/colorinterpolator";

describe("Color Interpolation", () => {
    it("should interpolate between two colors", () => {
        const interpolator = new interpolation.ColorInterpolator("#000", "fff");
        let color = interpolator.getColor(0.5);
        expect(color).toEqual("#808080");
        color = interpolator.getColor(0);
        expect(color).toEqual("#000000");
        color = interpolator.getColor(1);
        expect(color).toEqual("#ffffff");
    });

    it("should interpolate between colormap", () => {
        const colorMap = {
            0: "#000",
            0.5: "rgb(0, 255, 0)",
            1: { r: 0, g: 0, b: 255 }
        };

        const interpolator = new interpolation.ColorInterpolator(colorMap);
        let color = interpolator.getColor(0, "rgb");
        expect(color).toEqual("rgb(0,0,0)");
        color = interpolator.getColor(0.5, "hex");
        expect(color).toEqual("#00ff00");
        color = interpolator.getColor(1, "object");
        expect(color).toEqual({
            r: 0,
            g: 0,
            b: 255
        });
        color = interpolator.getColor(0.75, "rgb");
        expect(color).toEqual("rgb(0,128,128)");
    });

    it("should interpolate alpha values", () => {
        let interpolator = new interpolation.ColorInterpolator(
            "rgba(0,0,0,0)",
            "rgba(255,255,255,1)"
        );
        let color = interpolator.getColor(0);
        expect(color).toBe("rgba(0,0,0,0)");
        color = interpolator.getColor(1);
        expect(color).toBe("rgba(255,255,255,1)");
        color = interpolator.getColor(0.5);
        expect(color).toBe("rgba(128,128,128,0.5)");
        color = interpolator.getColor(0.333);
        expect(color).toBe("rgba(85,85,85,0.33)");

        interpolator = new interpolation.ColorInterpolator(
            "#fff",
            "rgba(0,0,0,0.5)"
        );
        color = interpolator.getColor(0.5);
        expect(color).toBe("#808080");
        color = interpolator.getColor(0.5, "rgb");
        expect(color).toBe("rgba(128,128,128,0.75)");
    });

    it("should create list of colors", () => {
        const interpolator = new interpolation.ColorInterpolator({
            0: "000",
            1: "FFF"
        });
        let colors = interpolator.generateColors(100);
        expect(colors.length).toBe(100);
        expect(colors[0]).toEqual("#000000");
        expect(colors[colors.length - 1]).toEqual("#ffffff");

        colors = interpolation.ColorInterpolator.generateColors(
            10,
            "#000",
            "#fff"
        );
        expect(colors.length).toBe(10);
        expect(colors[0]).toEqual("#000000");
        expect(colors[colors.length - 1]).toEqual("#ffffff");

        colors = interpolation.ColorInterpolator.generateColors(30, {
            0: "0f0",
            0.5: "#f00",
            1: "rgb(255, 0, 255)"
        });
        expect(colors.length).toBe(30);
        expect(colors[0]).toEqual("#00ff00");
        expect(colors[colors.length - 1]).toEqual("#ff00ff");
    });
});
