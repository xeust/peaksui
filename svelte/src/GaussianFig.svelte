<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";
  import {generate} from "./math/gaussian"
  let g;
  let tooltip;

  

  export let width = 450,
    height = 360,
    margin = 40;
  let color;
  export let size = "m"

  export let interventions = [
    { intervention_name: "one", mean: 1, std: 1 },
    { intervention_name: "two", mean: 0, std: 1 },
  ];

  let empty;
  


  $: data = generate(interventions, -3.0, 3.1, width, height, margin)
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
      color = d3.scaleOrdinal().domain(["not enough data"]).range(["#999999"]);
      empty = true;
    }
  }
  $: {
    d3.select(g).selectAll("*").remove();
    // d3.select(g)
    //   .attr("transform", "translate(0," + (height - margin) + ")")
    //   .call(d3.axisBottom(xScale))
    //   .append("text")
    //   .attr("fill", "black") //set the fill here
    //   .attr("transform", "translate(" + width / 2 + ", 30)")
    //   .style("font-weight", "bold");
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
        stroke={color(dot.key)}
        stroke-width="2"
        fill-opacity="0"
        d={d3
          .line()
          .x(function (d) {
            return d[0];
          })
          .y(function (d) {
            return d[1];
          })(dot.values)}
        on:mouseover={size !== "s" && handleMouseOver}
        on:mousemove={size !== "s" && (() => handleMouseMove(dot))}
        on:mouseleave={size !== "s" && handleMouseLeave}
      />
    {/each}
  </svg>
  <div bind:this={tooltip} class="tooltip" />
</div>

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
