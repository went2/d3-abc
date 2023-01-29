import React, { useEffect, useState } from "react";
import "../App.css";
import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";
import { brushX } from "d3-brush";
import { axisBottom } from "d3-axis";

function Brush({ size, changeBrush }) {
  const [container, setContainer] = useState(null);

  function createBrush(node) {
    const scale = scaleLinear().domain([0, 30]).range([0, size[0]]);
    const dayBrush = brushX()
      .extent([[0, 0], size])
      .on("brush", brushed);
    const dayAxis = axisBottom().scale(scale);

    select(node)
      .selectAll("g.brushaxis")
      .data([0])
      .enter()
      .append("g")
      .attr("class", "brushaxis")
      .attr("transform", "translate(0,25)");
    select(node).select("g.brushaxis").call(dayAxis);
    select(node)
      .selectAll("g.brush")
      .data([0])
      .enter()
      .append("g")
      .attr("class", "brush");
    select(node).select("g.brush").call(dayBrush);
    const brushFn = changeBrush;
    function brushed(event) {
      // brushed code
      const selectedExtent = event.selection.map((d) => scale.invert(d));
      // brushFn(selectedExtent);
    }
  }

  useEffect(() => {
    createBrush(container);
    // console.log("Brush container", container);
  });
  return (
    <svg
      ref={(node) => setContainer(node)}
      width={size[0]}
      height={size[1]}
    ></svg>
  );
}

export default Brush;
