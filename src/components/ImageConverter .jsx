import React, { useState } from "react";
import FileReader from "react-file-reader";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import JSZip from "jszip";
// import tiffConverter from "tiff";
// Import other libraries for converting to different formats

const ImageConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleFiles = (files) => {
    const file = files[0];
    if (file.type === "image/png") {
      setSelectedFile(file);
      setFileName(file.name);
    } else {
      alert("Please upload a PNG file.");
      setSelectedFile(null);
      setFileName("");
    }
  };

  const convertToJPG = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = URL.createObjectURL(selectedFile);
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        saveAs(blob, "converted.jpg");
      }, "image/jpeg");
    };
  };

  const convertToJPEG = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = URL.createObjectURL(selectedFile);
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        saveAs(blob, "converted.jpeg");
      }, "image/jpeg");
    };
  };

  const convertToWEBP = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = URL.createObjectURL(selectedFile);
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        saveAs(blob, "converted.webp");
      }, "image/webp");
    };
  };

  const convertToPDF = () => {
    const pdf = new jsPDF();
    pdf.addImage(URL.createObjectURL(selectedFile), "PNG", 0, 0);
    pdf.save("converted.pdf");
  };

  const convertToGIF = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = URL.createObjectURL(selectedFile);
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        saveAs(blob, "converted.gif");
      }, "image/gif");
    };
  };

  const convertToAVIF = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = URL.createObjectURL(selectedFile);
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        saveAs(blob, "converted.avif");
      }, "image/avif");
    };
  };

  const downloadAllAsZIP = () => {
    const zip = new JSZip();

    const addFileToZip = (fileName, blob) => {
      zip.file(fileName, blob);
    };

    const convertAndAddToZip = (format, mimeType) => {
      return new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.src = URL.createObjectURL(selectedFile);
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            addFileToZip(`converted.${format}`, blob);
            resolve();
          }, mimeType);
        };
      });
    };

    const convertToPDFForZip = () => {
      return new Promise((resolve) => {
        const pdf = new jsPDF();
        pdf.addImage(URL.createObjectURL(selectedFile), "PNG", 0, 0);
        const pdfBlob = pdf.output("blob");
        addFileToZip("converted.pdf", pdfBlob);
        resolve();
      });
    };

    Promise.all([
      convertAndAddToZip("jpg", "image/jpeg"),
      convertAndAddToZip("jpeg", "image/jpeg"),
      convertAndAddToZip("webp", "image/webp"),
      convertAndAddToZip("gif", "image/gif"),
      convertToPDFForZip(),
      convertAndAddToZip("avif", "image/avif"),
    ]).then(() => {
      zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, "converted_images.zip");
      });
    });
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-900 text-white">
      <h1 className="text-2xl md:text-4xl font-bold mb-6 text-center">
        PNG to Multiple Formats Converter
      </h1>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex flex-col items-center font-medium text-sm md:text-base mb-4 md:mb-0">
          {selectedFile && <p>{fileName}</p>}
        </div>
        <FileReader handleFiles={handleFiles}>
          <button className="btn btn-primary font-bold btn-outline md:btn-lg">
            Select PNG File
          </button>
        </FileReader>
      </div>

      {selectedFile && (
        <div className="flex flex-col items-center mt-6">
          <h2 className="text-xl font-bold mb-4">Select Format</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={convertToJPG}
              className="btn btn-outline btn-primary font-bold"
            >
              JPG
            </button>
            <button
              onClick={convertToJPEG}
              className="btn btn-outline btn-secondary font-bold"
            >
              JPEG
            </button>
            <button
              onClick={convertToWEBP}
              className="btn btn-outline btn-info font-bold"
            >
              WEBP
            </button>
            <button
              onClick={convertToPDF}
              className="btn btn-outline btn-error font-bold"
            >
              PDF
            </button>
            <button
              onClick={convertToGIF}
              className="btn btn-outline btn-accent font-bold"
            >
              GIF
            </button>
            <button
              onClick={convertToAVIF}
              className="btn btn-outline btn-success font-bold"
            >
              AVIF
            </button>
            <button
              onClick={downloadAllAsZIP}
              className="btn btn-outline btn-warning font-bold"
            >
              Download All as ZIP
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageConverter;
