import { Outlet } from "react-router";
import ChirpyPoster from "./components/ChirpyPoster";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar></Navbar>
      <div>
        <ChirpyPoster />
        <Outlet />
      </div>
    </>
  );
}

export default App;
