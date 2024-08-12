import { useState } from "react";
import ImageConverter from "./components/ImageConverter ";
import JPGtoPNGConverter from "./components/JPGtoPNGConverter";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="flex flex-col gap-10 pt-24 bg-gray-900 h-screen">
      <ImageConverter />
      <JPGtoPNGConverter />
      <Footer />
    </div>
  );
}

export default App;
