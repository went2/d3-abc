import React, { PureComponent } from "react";
import "../App.css";
import worldData from "../data/world";
import { geoMercator, geoPath } from "d3-geo";

class WorldMap extends PureComponent {
  render() {
    const { data, colorScale, size } = this.props;
    const projection = geoMercator().scale(120).translate([430, 250]);
    const pathGenerator = geoPath().projection(projection);
    const countries = data.map((d, i) => (
      <path
        key={"path" + i}
        d={pathGenerator(d)}
        className="countries"
        style={{
          fill: colorScale(d.launchday),
          stroke: "black",
          strokeOpacity: 0.5,
        }}
      />
    ));
    return (
      <svg width={size[0]} height={size[1]}>
        {countries}
      </svg>
    );
  }
}

export default WorldMap;
