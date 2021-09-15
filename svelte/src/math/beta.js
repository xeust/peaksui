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
export function generate(interventions) {
    let rawData = [];
    let absMax = null;
    for (const intervention of interventions) {
        const { num_successes, num_played, intervention_name } = intervention;
        if (num_played !== 0) {
            const [a, b] = [num_successes, (num_played - num_successes)];
            
            const { key, x, y, maxY } = createData(
                a + 1,
                b + 1,
                intervention_name
            );
            absMax = Math.max(absMax, maxY);
            rawData.push({ key, x, y });
        }
    }
    if (rawData.length === 0) {
        let { key, x, y, maxY } = createData(3, 3, "not enough data");
        absMax = maxY;
        rawData.push({ key, x, y });
    }

    return {rawData, absMax}
}

