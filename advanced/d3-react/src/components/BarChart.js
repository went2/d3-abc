import React, { PureComponent } from "react";
import "../App.css";
import { scaleLinear } from "d3-scale";
import { max, sum } from "d3-array";
import { select } from "d3-selection";
import { legendColor } from "d3-svg-legend";
import { transition } from "d3-transition";

class BarChart extends PureComponent {
  constructor(props) {
    super(props);
    this.createBarChart = this.createBarChart.bind(this);
  }

  componentDidMount() {
    this.createBarChart();
  }
  componentDidUpdate() {
    this.createBarChart();
  }
  createBarChart() {
    const { data, size, colorScale, hoverEle, onHover } = this.props;
    const node = this.node;
    const dataMax = max(data.map((d) => sum(d.data)));
    const barWidth = size[0] / data.length;
    const yScale = scaleLinear().domain([0, dataMax]).range([0, size[1]]);

    const legend = legendColor()
      .scale(colorScale)
      .labels(["Wave 1", "Wave 2", "Wave 3", "Wave 4"]);

    select(node)
      .selectAll("g.legend")
      .data([0])
      .enter()
      .append("g")
      .attr("class", "legend")
      .call(legend);

    select(node)
      .select("g.legend")
      .attr("transform", `translate(${size[0] - 100},20)`);

    select(node)
      .selectAll("rect")
      .data(this.props.data)
      .join("rect")
      .attr("class", "bar")
      .on("mouseover", (evt, d) => {
        onHover(d.id);
      });
    select(node).selectAll("rect").data(this.props.data).exit().remove();
    select(node)
      .selectAll("rect")
      .data(data)
      .attr("x", (d, i) => i * barWidth)
      .attr("y", (d) => size[1] - yScale(sum(d.data)))
      .attr("height", (d) => yScale(sum(d.data)))
      .attr("width", barWidth)
      .style("stroke", "black")
      .style("stroke-opacity", 0.25)
      .style("fill", (d, i) => {
        // console.log("infill", hoverEle);
        return hoverEle === d.id ? "#fcbc34" : colorScale(d.launchday);
      });
  }

  render() {
    return (
      <svg
        ref={(node) => (this.node = node)}
        width={this.props.size[0]}
        height={this.props.size[1]}
      ></svg>
    );
  }
}

export default BarChart;
