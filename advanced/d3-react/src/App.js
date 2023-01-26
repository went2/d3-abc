import "./App.css";
import BarChart from "./components/BarChart";
import WorldMap from "./components/WorldMap";

import worldData from "./data/world";
import { range, sum } from "d3-array";
import { scaleThreshold } from "d3-scale";
import { geoCentroid } from "d3-geo";

const appData = worldData.features.filter((d) => geoCentroid(d)[0] < -20);

appData.forEach((d, i) => {
  const offset = Math.random();
  d.launchday = i;
  d.data = range(30).map((p, q) => (q < i ? 0 : Math.random() * 2 + offset));
});

function App() {
  const colorScale = scaleThreshold()
    .domain([5, 10, 20, 30, 50])
    .range(["#75739F", "#5EAFC6", "#41A368", "#93C464", "#FE9922"]);
  return (
    <div className="App">
      <header className="App-header">
        <h2>d3-in-action dashboard</h2>
      </header>
      <div>
        <BarChart colorScale={colorScale} data={appData} size={[500, 400]} />
        <WorldMap colorScale={colorScale} data={appData} size={[500, 400]} />
      </div>
    </div>
  );
}

export default App;
