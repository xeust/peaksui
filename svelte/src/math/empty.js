import * as d3 from "d3";
import {createData, scaleData} from "./beta.js"

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