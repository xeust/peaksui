<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";
  export let width = 150,
    height = 170,
    margin = 20;
  export let interventions = [
    { intervention_name: "one", num_successes: 18, num_played: 46 },
    { intervention_name: "two", num_successes: 4, num_played: 16 },
  ];
  let color;
  let el;
  function gamma(x) {
    return (
      Math.sqrt((2 * Math.PI) / x) *
      Math.pow((x + 1 / (12 * x - 1 / (10 * x))) / Math.E, x)
    );
  }

  function betaPDF(x, alpha, beta) {
    return (
      (Math.pow(x, alpha - 1) *
        Math.pow(1 - x, beta - 1) *
        gamma(alpha + beta)) /
      (gamma(alpha) * gamma(beta))
    );
  }
  function createData(alpha, beta, key) {
    var x = [];
    var y = [];
    var maxY = null;
    for (var xi = 0; xi <= 1; xi = xi + 0.01) {
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
  function scaleData(rawData, xScale, yScale) {
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
  function generate(interventions) {
    let rawData = [];
    let absMax = null;
    for (const intervention of interventions) {
      const { num_successes, num_played, intervention_name } = intervention;
      if (num_successes !== 0 && num_played !== 0) {
        const [a, b] = [num_successes, (num_played - num_successes)];
        const { key, x, y, maxY } = createData(
          a,
          b,
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
    var xScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([0 + margin, width - margin]);
    var yScale = d3
      .scaleLinear()
      .range([0 + margin, height - margin])
      .domain([absMax, 0]);
    const data = scaleData(rawData, xScale, yScale);

    return { data, xScale, yScale };
  }

  function draw() {
    // append the svg object to the body of the page
    var svg = d3
      .select(el)
      .append("svg")
      .attr("width", width)
      .attr("height", height);
    var { data } = generate(interventions);

    var density = data;
    // color
    var res = density.map(function (d) {
      return d.key;
    }); // list of group names

    color = d3.scaleOrdinal().domain(res).range([
      "#e41a1c", // red
      "#377eb8", // gray blue
      "#4daf4a", // green
      "#984ea3", // purple
      "#ff7f00", // orange
      "#ffff33", // yellow
      "#a65628", // brown
      "#f781bf", // pink
      "#999999", // grey
      "#000000", // black
      "#0d3800", // dark green
      "#00ddff", // light blue
    ]);

    if (data.length === 1 && data[0].key === "not enough data") {
      color = d3.scaleOrdinal().domain(["not enough data"]).range(["#999999"]);
      svg
        .append("text")
        .attr("fill", "#999999") //set the fill here
        .attr("transform", "translate(" + 38 + "," + 165 + ")")
        .text("not enough data")
        .style("font-size", "10px");
    }
    // Plot the area
    svg
      .selectAll(".line")
      .data(density)
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", function (d) {
        return color(d.key);
      })
      .attr("stroke-width", 1.5)
      .attr("d", function (d) {
        return d3
          .line()
          .x(function (d) {
            return d[0];
          })
          .y(function (d) {
            return d[1];
          })(d.values);
      });
  }
  onMount(() => {
    draw();
  });
  $: draw();
</script>

<div bind:this={el} />

<style>
  div {
    width: 150px;
    height: 170px;
  }
</style>
