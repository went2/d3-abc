import React, { Component } from "react";
import "../App.css";
import {
  stack,
  area,
  curveBasis,
  stackOrderInsideOut,
  stackOffsetSilhouette,
} from "d3-shape";
import { range } from "d3-array";
import { scaleLinear } from "d3-scale";

function StreamGraph({ data, size, colorScale, hoverEle, onHover }) {
  const stackData = range(30).map(() => ({}));
  for (let x = 0; x < 30; x++) {
    data.forEach((country) => {
      stackData[x][country.id] = country.data[x];
    });
  }
  const xScale = scaleLinear().domain([0, 30]).range([0, size[0]]);
  const yScale = scaleLinear().domain([0, 60]).range([size[1], 0]);

  const stackLayout = stack()
    .offset(stackOffsetSilhouette)
    .order(stackOrderInsideOut)
    .keys(Object.keys(stackData[0]));
  const stackArea = area()
    .x((d, i) => xScale(i))
    .y0((d) => yScale(d[0]))
    .y1((d) => yScale(d[1]))
    .curve(curveBasis);

  const stacks = stackLayout(stackData).map((d, i) => (
    <path
      key={"stack" + i}
      d={stackArea(d)}
      onMouseEnter={() => onHover(data[i].id)}
      style={{
        fill:
          hoverEle === data[i]["id"]
            ? "#fcbc34"
            : colorScale(data[i].launchday),
        stroke: "black",
        strokeOpacity: 0.25,
      }}
    ></path>
  ));
  return (
    <svg width={size[0]} height={size[1]}>
      <g transform={`translate(0,${-size[1] / 2})`}>{stacks}</g>
    </svg>
  );
}

export default StreamGraph;
