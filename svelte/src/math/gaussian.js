import * as d3 from "d3";

const interval = 0.05;

export function createData(interval, upper_bound, lower_bound, mean, std) {
  var n = Math.ceil((upper_bound - lower_bound) / interval);
  var data = [];

  var x_position = lower_bound;
  for (var i = 0; i < n; i++) {
    data.push({
      y: jStat.normal.pdf(x_position, mean, std),
      x: x_position,
    });
    x_position += interval;
  }
  return data;
}

export function generate(
  interventions,
  lower_bound,
  upper_bound,
  width,
  height,
  margin
) {
  lower_bound = null;
  upper_bound = null;
  interventions.forEach((d) => {
    if (d.trials >= 5) {
      lower_bound = Math.min(d.mean - 4 * d.std, lower_bound);
      upper_bound = Math.max(d.mean + 4 * d.std, upper_bound);
    }
  });

  let rawData = [];
  let data = [];
  for (const intervention of interventions) {
    if (intervention.trials >= 5) {
      let id = createData(
        interval,
        upper_bound,
        lower_bound,
        intervention.mean,
        intervention.std
      );
      rawData = rawData.concat(id);

      data.push({ key: intervention.intervention_name, values: id });
    }
  }

  var xScale = d3
    .scaleLinear()
    .domain([lower_bound, upper_bound])
    .range([0 + margin, width - margin]);
  var yScale = d3
    .scaleLinear()
    .range([0 + margin, height - margin])
    .domain([
      d3.max(rawData, function (d) {
        return d.y;
      }),
      0,
    ]);

  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data[i].values.length; j++) {
      data[i].values[j] = [
        xScale(data[i].values[j].x),
        yScale(data[i].values[j].y),
      ];
    }
  }

  return { data, xScale };
}
