import { useState } from "react";
import ImageConverter from "./components/ImageConverter ";
import JPGtoPNGConverter from "./components/JPGtoPNGConverter";
import Header from "./components/Footer";

function App() {
  return (
    <div className="flex flex-col gap-10  bg-gray-900 h-screen">
      <Header />
      <ImageConverter />
      <JPGtoPNGConverter />
    </div>
  );
}

export default App;
