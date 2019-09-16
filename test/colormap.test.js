import { ColorMap } from "../src/colorinterpolator";

describe("ColorMap", () => {
    it("should create two-color colormaps", () => {
        const colorMap = new ColorMap({
            0: '#000',
            1: '#fff'
        });

        let [fraction, startColor, stopColor] = colorMap.getColorsAndFraction(0);
        expect(fraction).toBeCloseTo(0);
        expect([startColor.r, startColor.g, startColor.b]).toEqual([0, 0, 0]);
        expect([stopColor.r, stopColor.g, stopColor.b]).toEqual([255, 255, 255]);

        [fraction, startColor, stopColor] = colorMap.getColorsAndFraction(0.5);
        expect(fraction).toBeCloseTo(0.5);
        expect([startColor.r, startColor.g, startColor.b]).toEqual([0, 0, 0]);
        expect([stopColor.r, stopColor.g, stopColor.b]).toEqual([255, 255, 255]);

        [fraction, startColor, stopColor] = colorMap.getColorsAndFraction(1);
        expect(fraction).toBeCloseTo(1);
        expect([startColor.r, startColor.g, startColor.b]).toEqual([0, 0, 0]);
        expect([stopColor.r, stopColor.g, stopColor.b]).toEqual([255, 255, 255]);
    });

    it("should create multiple-color colormaps", () => {
        const colorMap = new ColorMap({
            0: "#000",
            0.2: "#ff0000",
            0.3: {
                r: 0,
                g: 255,
                b: 0
            },
            0.7: "rgb(0, 0, 255)",
            1: "rgba(255, 255, 255, 0.5)"
        });

        let [fraction, startColor, stopColor] = colorMap.getColorsAndFraction(.1);
        expect(fraction).toBeCloseTo(0.5);
        expect([startColor.r, startColor.g, startColor.b]).toEqual([0, 0, 0]);
        expect([stopColor.r, stopColor.g, stopColor.b]).toEqual([255, 0, 0]);

        [fraction, startColor, stopColor] = colorMap.getColorsAndFraction(.23);
        expect(fraction).toBeCloseTo(0.3);
        expect([startColor.r, startColor.g, startColor.b]).toEqual([255, 0, 0]);
        expect([stopColor.r, stopColor.g, stopColor.b]).toEqual([0, 255, 0]);

        [fraction, startColor, stopColor] = colorMap.getColorsAndFraction(.6);
        expect(fraction).toBeCloseTo(0.75);
        expect([startColor.r, startColor.g, startColor.b]).toEqual([0, 255, 0]);
        expect([stopColor.r, stopColor.g, stopColor.b]).toEqual([0, 0, 255]);

        [fraction, startColor, stopColor] = colorMap.getColorsAndFraction(.75);
        expect(fraction).toBeCloseTo(1 / 6);
        expect([startColor.r, startColor.g, startColor.b]).toEqual([0, 0, 255]);
        expect([stopColor.r, stopColor.g, stopColor.b, stopColor.a]).toEqual([255, 255, 255,.5]);
    })
});