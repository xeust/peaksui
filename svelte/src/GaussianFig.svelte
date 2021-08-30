<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";
  let el;
  let margin = 40;
  var interval = 0.05;
  var upper_bound = 3.1;
  var lower_bound = -3.0;
  let width = 450,
    height = 360;
  let color;
  export let interventions = [
    { intervention_name: "one", mean: 1, std: 1 },
    { intervention_name: "two", mean: 0, std: 1 },
  ];
  function createData(interval, upper_bound, lower_bound, mean, std) {
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

  function generateData(interventions) {
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

    // var xScale = d3
    //   .scaleLinear()
    //   .domain([
    //     d3.min(rawData, function (d) {
    //       return d.x;
    //     }),
    //     d3.max(rawData, function (d) {
    //       return d.x;
    //     }),
    //   ])
    //   .range([0, width]);

    // var yScale = d3
    //   .scaleLinear()
    //   .domain([
    //     d3.min(rawData, function (d) {
    //       return d.y;
    //     }),
    //     d3.max(rawData, function (d) {
    //       return d.y;
    //     }),
    //   ])
    //   .range([height, 0]);

    lower_bound = null;
    upper_bound = null;
    interventions.forEach((d) => {
      if (d.trials >= 5) {
        lower_bound = Math.min(d.mean - 4*(d.std), lower_bound)
        upper_bound = Math.max(d.mean + 4*(d.std), upper_bound)
      }
    });


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
    return { data, xScale, yScale };
  }
  function draw() {
    let { data, xScale, yScale } = generateData(interventions);
    var svg = d3
      .select(el)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    svg
      .append("g")
      .attr("transform", "translate(0," + (height - margin) + ")")
      .call(d3.axisBottom(xScale))
      .append("text")
      .attr("fill", "black") //set the fill here
      .attr("transform", "translate(" + width / 2 + ", 30)")
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
      d3.select(event.currentTarget).attr("fill-opacity", "0.2")
      Tooltip.html(d.key)
        .style("color", color(d.key))
        .style("left", d3.pointer(event)[0] + 30 + "px")
        .style("top", d3.pointer(event)[1] + "px");
    };
    var mouseleave = function (d) {
      d3.select(event.currentTarget).attr("fill-opacity", "0")
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
    draw();
  });
  $: draw();
</script>

<div bind:this={el} bind:clientHeight={height} bind:clientWidth={width} />

<style>
  div {
    width: 450px;
    height: 356px;
  }
  @media only screen and (max-width: 708px) {
    div {
      width: 390px;
      height: 356px;
    }
  }
  @media only screen and (min-width: 709px) {
    div {
      width: 450px;
      height: 356px;
    }
  }
  @media only screen and (max-width: 400px) {
    div {
      width: 85vw;
      height: 273px;
    }
  }
</style>
