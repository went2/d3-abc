import React, { PureComponent } from "react";
import "../App.css";
import { scaleLinear } from "d3-scale";
import { max, sum } from "d3-array";
import { select } from "d3-selection";

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
    const { data, size, colorScale } = this.props;
    const node = this.node;
    const dataMax = max(data.map((d) => sum(d.data)));
    const barWidth = size[0] / data.length;
    const yScale = scaleLinear().domain([0, dataMax]).range([0, size[1]]);
    select(node).selectAll("rect").data(this.props.data).join("rect");
    select(node).selectAll("rect").data(this.props.data).exit().remove();
    select(node)
      .selectAll("rect")
      .data(data)
      .style("fill", (d, i) => colorScale(d.launchday))
      .attr("x", (d, i) => i * barWidth)
      .attr("y", (d) => size[1] - yScale(sum(d.data)))
      .attr("height", (d) => yScale(sum(d.data)))
      .attr("width", barWidth)
      .style("stroke", "black")
      .style("stroke-opacity", 0.25);
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
