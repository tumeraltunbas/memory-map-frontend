import "./App.css";
import { Header } from "./components/Header";
import { Map } from "./components/Map";

function App() {
  return (
    <>
      <div className="relative h-screen w-screen">
        <div className="absolute top-0 left-0 z-10 bg-transparent w-screen">
          <Header />
        </div>
        <div className="absolute top-0 left-0 w-full h-full z-0">
          <Map />
        </div>
      </div>
    </>
  );
}

export default App;
