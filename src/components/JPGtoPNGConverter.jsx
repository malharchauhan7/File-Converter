import React, { useState } from "react";
import FileReader from "react-file-reader";
import { saveAs } from "file-saver";

const JPGtoPNGConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  const handleFiles = (files) => {
    const file = files[0];
    if (file.type === "image/jpeg" || file.type === "image/jpg") {
      setSelectedFile(file);
    } else {
      alert("Please upload a JPG or JPEG file.");
    }
  };

  const convertToPNG = async () => {
    setLoading(true); // Start loading
    try {
      const img = new Image();
      img.src = URL.createObjectURL(selectedFile);

      // Use a Promise to handle image loading
      await new Promise((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load the image."));
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set canvas dimensions to image dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0);

      // Convert canvas to Blob and save as PNG
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, "converted.png");
        } else {
          throw new Error("Failed to convert the image to PNG.");
        }
        setLoading(false); // End loading
      }, "image/png");
    } catch (error) {
      console.error("PNG conversion error:", error);
      alert(`Failed to convert the image to PNG: ${error.message}`);
      setLoading(false); // End loading on error
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-10 bg-gray-900 text-white gap-4 h-screen">
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
          <button className="btn btn-primary btn-md md:btn-md font-bold">
            Select JPG/JPEG File
          </button>
        </FileReader>
      </div>

      {selectedFile && (
        <div className="flex gap-4 justify-center items-center mt-4">
          <button
            onClick={convertToPNG}
            className="btn btn-secondary btn-outline font-bold"
            disabled={loading} // Disable button while loading
          >
            {loading ? "Converting..." : "Convert to PNG"}
          </button>
        </div>
      )}
    </div>
  );
};

export default JPGtoPNGConverter;
