import "./App.css";
import BarChart from "./components/BarChart";
import WorldMap from "./components/WorldMap";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2>d3-in-action dashboard</h2>
      </header>
      <div>
        {/* <BarChart data={[5, 10, 1, 3]} size={[500, 500]} /> */}
        <WorldMap />
      </div>
    </div>
  );
}

export default App;
