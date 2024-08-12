import React, { useState } from "react";
import FileReader from "react-file-reader";
import { saveAs } from "file-saver";

const JPGtoPNGConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFiles = (files) => {
    const file = files[0];
    if (file.type === "image/jpeg" || file.type === "image/jpg") {
      setSelectedFile(file);
    } else {
      alert("Please upload a JPG or JPEG file.");
    }
  };

  const convertToPNG = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = URL.createObjectURL(selectedFile);
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        saveAs(blob, "converted.png");
      }, "image/png");
    };
  };

  return (
    <div className="flex flex-col items-center justify-center p-10 bg-gray-900 text-white gap-4">
      <h1 className="text-2xl md:text-4xl font-bold mb-4 text-center">
        JPG / JPEG to PNG Converter
      </h1>

      <div className="flex gap-4 items-center">
        <div className="flex items-center font-medium text-sm md:text-base">
          {selectedFile && (
            <p className="text-lg md:text-xl">{selectedFile.name}</p>
          )}
        </div>
        <FileReader handleFiles={handleFiles}>
          <button className="btn btn-primary btn-sm md:btn-md font-bold">
            Select JPG/JPEG File
          </button>
        </FileReader>
      </div>

      {selectedFile && (
        <div className="flex gap-4 justify-center items-center mt-4">
          <button
            onClick={convertToPNG}
            className="btn btn-secondary btn-outline font-bold"
          >
            Convert to PNG
          </button>
        </div>
      )}
    </div>
  );
};

export default JPGtoPNGConverter;
