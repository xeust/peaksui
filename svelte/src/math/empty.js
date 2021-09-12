import * as d3 from "d3";
export function gamma(x) {
    return (
        Math.sqrt((2 * Math.PI) / x) *
        Math.pow((x + 1 / (12 * x - 1 / (10 * x))) / Math.E, x)
    );
}

export function betaPDF(x, alpha, beta) {
    return (
        (Math.pow(x, alpha - 1) *
            Math.pow(1 - x, beta - 1) *
            gamma(alpha + beta)) /
        (gamma(alpha) * gamma(beta))
    );
}
export function createData(alpha, beta, key) {
    var x = [];
    var y = [];
    var maxY = null;
    for (var xi = 0; xi <= 1; xi = xi + 0.001) {
        var yi = betaPDF(xi, alpha, beta);
        if (isFinite(yi)) {
            x.push(xi);
            y.push(yi);
            if (yi > maxY) {
                maxY = yi;
            }
        }
    }
    return { key, x, y, maxY };
}
export function scaleData(rawData, xScale, yScale) {
    var data = [];
    for (const arm of rawData) {
        var armData = [];
        for (var i = 0; i < arm.x.length; i++) {
            armData.push([xScale(arm.x[i]), yScale(arm.y[i])]);
        }
        data.push({ values: armData, key: arm.key });
    }
    return data;
}

export const emptyData = (height, width, margin) => {
    let rawData = [];
    let { key, x, y, maxY } = createData(3, 3, "not enough data");

    rawData.push({ key, x, y });

   let xScale = d3
    .scaleLinear()
    .domain([0, 1])
    .range([0 + margin, width - margin]);
  let yScale = d3
    .scaleLinear()
    .range([0 + margin, height - margin])
    .domain([maxY, 0]);

 return scaleData(rawData, xScale, yScale);
} 