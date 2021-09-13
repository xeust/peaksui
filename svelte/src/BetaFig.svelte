<script>
  import * as d3 from "d3";
  import { generate, scaleData } from "./math/beta";

  export let width = 450,
    height = 356,
    margin = 40;

  export let interventions = [
    { intervention_name: "one", num_successes: 18, num_played: 46 },
    { intervention_name: "two", num_successes: 4, num_played: 16 },
  ];

  export let size = "m";

  let tooltip;
  let g;
  let { rawData, absMax } = generate(interventions);

  let color;
  let empty;

  $: xScale = d3
    .scaleLinear()
    .domain([0, 1])
    .range([0 + margin, width - margin]);
  $: yScale = d3
    .scaleLinear()
    .range([0 + margin, height - margin])
    .domain([absMax, 0]);
  $: data = scaleData(rawData, xScale, yScale);

  $: {
    color = d3
      .scaleOrdinal()
      .domain(
        data.map(function (d) {
          return d.key;
        })
      )
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
      console.log("empty", data);
      color = d3.scaleOrdinal().domain(["not enough data"]).range(["#999999"]);
      empty = true;
    }
  }
  $: {
    d3.select(g).selectAll("*").remove();
    d3.select(g)
      .attr("transform", "translate(0," + (height - margin) + ")")
      .call(d3.axisBottom(xScale))
      .append("text")
      .attr("fill", "black") //set the fill here
      .attr("transform", "translate(" + width / 2 + ", 30)")
      .text("probability")
      .style("font-weight", "bold");
  }

  const handleMouseOver = function (d) {
    d3.select(tooltip).style("opacity", 1);
  };
  const handleMouseMove = function (d) {
    d3.select(event.currentTarget).attr("fill-opacity", "0.2");
    d3.select(tooltip)
      .html(d.key)
      .style("color", color(d.key))
      .style("left", d3.pointer(event)[0] + 30 + "px")
      .style("top", d3.pointer(event)[1] + "px");
  };
  const handleMouseLeave = function (d) {
    d3.select(event.currentTarget).attr("fill-opacity", "0");
    d3.select(tooltip).style("opacity", 0);
  };
</script>

<div class={size} bind:clientWidth={width} bind:clientHeight={height}>
  <svg {width} {height}>
    {#if size !== "s"}
      <g class="axis" bind:this={g} />
    {/if}
    {#if size === "s" && empty}
      <text
        fill="#999999"
        transform={`translate(38, 165)`}
        style="font-size: 10px;"
      >
        not enough data
      </text>
    {/if}
    {#each data as dot}
      <!-- svelte-ignore a11y-mouse-events-have-key-events -->
      <path
        fill={color(dot.key)}
        fill-opacity="0"
        d={d3
          .area()
          .x(function (d) {
            return d[0];
          })
          .y0(yScale(0))
          .y1(function (d) {
            return d[1];
          })(dot.values)}
        on:mouseover={size !== "s" && handleMouseOver}
        on:mousemove={size !== "s" && (() => handleMouseMove(dot))}
        on:mouseleave={size !== "s" && handleMouseLeave}
      />

       <path
        fill="none"
        stroke={color(dot.key)}
        stroke-width="2"
        d={d3
          .line()
          .x(function (d) {
            return d[0];
          })
          .y(function (d) {
            return d[1];
          })(dot.values)}
      /> 
    {/each}
  </svg>
  <div bind:this={tooltip} class="tooltip" />
</div>

<style>
  .tooltip {
    opacity: 0;
    position: absolute;
    font-weight: bold;
    background-color: transparent;
  }
  .s {
    width: 150px;
    height: 170px;
  }
  .l {
    width: 992px;
    height: 700px;
  }
  @media only screen and (max-width: 992px) {
    .l {
      width: 98vw;
      height: 60vh;
    }
  }
  @media only screen and (max-width: 650px) {
    .l {
      width: 98vw;
      height: 60vh;
    }
  }
  .m {
    width: 450px;
    height: 356px;
  }
  @media only screen and (max-width: 708px) {
    .m {
      width: 390px;
      height: 356px;
    }
  }
  @media only screen and (min-width: 709px) {
    .m {
      width: 450px;
      height: 356px;
    }
  }
  @media only screen and (max-width: 400px) {
    .m {
      width: 85vw;
      height: 273px;
    }
  }
</style>
