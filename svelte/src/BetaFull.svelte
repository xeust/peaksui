<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";
  let width = 992,
    height = 700,
    margin = 40;
  let color;
  let el;
  export let interventions = [
    { intervention_name: "one", num_successes: 18, num_played: 46 },
    { intervention_name: "two", num_successes: 4, num_played: 16 },
  ];
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

  function drawBeta() {
    // append the svg object to the body of the page
    var svg = d3
      .select(el)
      .append("svg")
      .attr("width", width)
      .attr("height", height);
    var { data, xScale } = generate(interventions);

    // add the x Axis
    svg
      .append("g")
      .attr("transform", "translate(0," + (height - margin) + ")")
      .call(d3.axisBottom(xScale))
      .append("text")
      .attr("fill", "black") //set the fill here
      .attr("transform", "translate(" + width / 2 + ", 30)")
      .text("probability")
      .style("font-weight", "bold");
    var density = data;
    // color
    var res = density.map(function (d) {
      return d.key;
    }); // list of group names
    color = d3
      .scaleOrdinal()
      .domain(res)
      .range([
        "#e41a1c",
        "#377eb8",
        "#4daf4a",
        "#984ea3",
        "#ff7f00",
        "#ffff33",
        "#a65628",
        "#f781bf",
        "#999999",
      ]);
    if (data.length === 1 && data[0].key === "not enough data") {
      color = d3.scaleOrdinal().domain(["not enough data"]).range(["#999999"]);
    }
    var Tooltip = d3
      .select(el)
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("font-weight", "bold")
      .style("background-color", "transparent");

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function (d) {
      Tooltip.style("opacity", 1);
    };
    var mousemove = function (event, d) {
      d3.select(event.currentTarget).attr("fill-opacity", "0.2");
      Tooltip.html(d.key)
        .style("color", color(d.key))
        .style("left", d3.pointer(event)[0] + 30 + "px")
        .style("top", d3.pointer(event)[1] + "px");
    };
    var mouseleave = function (d) {
      d3.select(event.currentTarget).attr("fill-opacity", "0");
      Tooltip.style("opacity", 0);
    };
    // Plot the area
    svg
      .selectAll(".line")
      .data(density)
      .enter()
      .append("path")
      .attr("fill", function (d) {
        return color(d.key);
      })
      .attr("fill-opacity", "0")
      .attr("stroke", function (d) {
        return color(d.key);
      })
      .attr("stroke-width", 2)
      .attr("d", function (d) {
        return d3
          .line()
          .x(function (d) {
            return d[0];
          })
          .y(function (d) {
            return d[1];
          })(d.values);
      })
      .on("mouseover", mouseover)
      .on("mousemove", (event, d) => mousemove(event, d))
      .on("mouseleave", mouseleave);
  }
  onMount(() => {
    drawBeta();
  });
  $: drawBeta();
</script>

<div bind:this={el} bind:clientHeight={height} bind:clientWidth={width} />

<style>
  div {
    width: 992px;
    height: 700px;
  }
  @media only screen and (max-width: 992px) {
    div {
      width: 98vw;
      height: 60vh;
    }
  }
  @media only screen and (max-width: 650px) {
      div {
          width: 98vw;
          height: 60vh
      }
  }
</style>
