import React, { useState } from "react";
import FileReader from "react-file-reader";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import JSZip from "jszip";

const LoaderSpin = () => {
  return <span className="loading loading-spinner text-md"></span>;
};

const ImageConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

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

  const convertImage = async (format, mimeType, fileName) => {
    setLoading(true);
    try {
      const img = new Image();
      img.src = URL.createObjectURL(selectedFile);

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error("Failed to load the image."));
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `converted.${format}`);
        } else {
          throw new Error(`Failed to convert the image to ${format}.`);
        }
      }, mimeType);
    } catch (error) {
      console.error(`${format.toUpperCase()} conversion error:`, error);
      alert(
        `Failed to convert the image to ${format.toUpperCase()}: ${
          error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const convertToPDF = async () => {
    setLoading(true);
    try {
      const img = new Image();
      img.src = URL.createObjectURL(selectedFile);

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error("Failed to load the image."));
      });

      const pdf = new jsPDF();
      const imgWidth = img.width;
      const imgHeight = img.height;
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const aspectRatio = imgWidth / imgHeight;

      let scaledWidth = pdfWidth;
      let scaledHeight = pdfWidth / aspectRatio;

      if (scaledHeight > pdfHeight) {
        scaledHeight = pdfHeight;
        scaledWidth = pdfHeight * aspectRatio;
      }

      const x = (pdfWidth - scaledWidth) / 2;
      const y = (pdfHeight - scaledHeight) / 2;

      pdf.addImage(img, "PNG", x, y, scaledWidth, scaledHeight);
      pdf.save("converted.pdf");
    } catch (error) {
      console.error("PDF conversion error:", error);
      alert("Failed to convert the image to PDF.");
    } finally {
      setLoading(false);
    }
  };

  const downloadAllAsZIP = async () => {
    setLoading(true);
    try {
      const zip = new JSZip();
      const addFileToZip = (fileName, blob) => zip.file(fileName, blob);

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

      const convertToPDFForZip = async () => {
        try {
          // Create an image URL from the selected file
          const imgURL = URL.createObjectURL(selectedFile);
          const img = new Image();
          img.src = imgURL;

          // Wait for the image to load
          await new Promise((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = (error) =>
              reject(new Error(`Failed to load image: ${error.message}`));
          });

          // Create a canvas to draw the image
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          // Convert the canvas to PDF
          const pdf = new jsPDF();
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const aspectRatio = img.width / img.height;

          let scaledWidth = pdfWidth;
          let scaledHeight = pdfWidth / aspectRatio;

          if (scaledHeight > pdfHeight) {
            scaledHeight = pdfHeight;
            scaledWidth = pdfHeight * aspectRatio;
          }

          const x = (pdfWidth - scaledWidth) / 2;
          const y = (pdfHeight - scaledHeight) / 2;

          pdf.addImage(
            canvas.toDataURL("image/png"),
            "PNG",
            x,
            y,
            scaledWidth,
            scaledHeight
          );

          // Output the PDF as a blob
          const pdfBlob = pdf.output("blob");

          // Add the PDF blob to the ZIP file
          addFileToZip("converted.pdf", pdfBlob);
        } catch (error) {
          console.error("PDF conversion error:", error);
          alert(`Failed to convert the image to PDF: ${error.message}`);
        }
      };

      await Promise.all([
        convertAndAddToZip("jpg", "image/jpeg"),
        convertAndAddToZip("jpeg", "image/jpeg"),
        convertAndAddToZip("webp", "image/webp"),
        convertAndAddToZip("gif", "image/gif"),
        convertToPDFForZip(),
        convertAndAddToZip("avif", "image/avif"),
      ]);

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "converted_images.zip");
    } catch (error) {
      console.error("ZIP download error:", error);
      alert("Failed to download ZIP file.");
    } finally {
      setLoading(false);
    }
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
              disabled={loading}
              onClick={() => convertImage("jpg", "image/jpeg", "converted.jpg")}
              className="btn btn-outline btn-primary font-bold"
            >
              {loading ? <LoaderSpin /> : "JPG"}
            </button>
            <button
              disabled={loading}
              onClick={() =>
                convertImage("jpeg", "image/jpeg", "converted.jpeg")
              }
              className="btn btn-outline btn-secondary font-bold"
            >
              {loading ? <LoaderSpin /> : "JPEG"}
            </button>
            <button
              disabled={loading}
              onClick={() =>
                convertImage("webp", "image/webp", "converted.webp")
              }
              className="btn btn-outline btn-info font-bold"
            >
              {loading ? <LoaderSpin /> : "WEBP"}
            </button>
            <button
              disabled={loading}
              onClick={convertToPDF}
              className="btn btn-outline btn-error font-bold"
            >
              {loading ? <LoaderSpin /> : "PDF"}
            </button>
            <button
              disabled={loading}
              onClick={() => convertImage("gif", "image/gif", "converted.gif")}
              className="btn btn-outline btn-accent font-bold"
            >
              {loading ? <LoaderSpin /> : "GIF"}
            </button>
            <button
              disabled={loading}
              onClick={() =>
                convertImage("avif", "image/avif", "converted.avif")
              }
              className="btn btn-outline btn-success font-bold"
            >
              {loading ? <LoaderSpin /> : "AVIF"}
            </button>
            <button
              disabled={loading}
              onClick={downloadAllAsZIP}
              className="btn btn-outline btn-warning font-bold"
            >
              {loading ? <LoaderSpin /> : "Download All as ZIP"}
            </button>
          </div>
          {/* {loading && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="h-10  loading-spinner  loading-md loading text-success"></div>
            </div>
          )} */}
        </div>
      )}
    </div>
  );
};

export default ImageConverter;
