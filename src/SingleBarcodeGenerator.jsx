// src/SingleBarcodeGenerator.jsx
import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { saveAs } from "file-saver";

const SingleBarcodeGenerator = () => {
  // We create a form state with fields corresponding to each value in the array:
  const [formData, setFormData] = useState({
    PONumber: "",
    ReceivingNo: "",
    Supplier: "",
    // Item fields:
    ItemNo: "",
    Description: "",
    Quantity: "",
    SerialNumber: "",
    InvoiceNo: "",
    Location: "",
    ReceivingDate: new Date().toISOString().split("T")[0],
    Amount: "",
  });
  const [qrData, setQrData] = useState("");
  const qrRef = useRef(null);

  // Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // On submit, map the form data to the desired structure.
  const generateQRCode = (e) => {
    e.preventDefault();
  
    const mappedData = [
      {
        PONumber: formData.PONumber || "",
        ReceivingNo: formData.ReceivingNo || "",
        Supplier: formData.Supplier || "Unknown Supplier",
        items: [
          {
            ItemNo: formData.ItemNo || "",
            Description: formData.Description || "",
            Quantity: Number(formData.Quantity) || 0,
            SerialNumber: formData.SerialNumber || "Default-SN",
            InvoiceNo: formData.InvoiceNo || "Default Invoice",
            Location: formData.Location || "Unknown",
            ReceivingDate:
              formData.ReceivingDate || new Date().toLocaleDateString(),
            Amount: formData.Amount || "Unknown",
          },
        ],
      },
    ];
  
    setQrData(JSON.stringify(mappedData)); // Ensure JSON Array format
  };
  
  

  // Download the QR code as PNG using the rendered canvas.
  const downloadQRCode = () => {
    if (qrRef.current) {
      // Get the original QR code canvas rendered by QRCodeCanvas
      const originalCanvas = qrRef.current.querySelector("canvas");
      if (originalCanvas) {
        // Set a margin around the QR code (in pixels)
        const margin = 20;
        // Calculate new canvas dimensions (original size plus margins)
        const newWidth = originalCanvas.width + margin * 2;
        const newHeight = originalCanvas.height + margin * 2;
        
        // Create an off-screen canvas
        const newCanvas = document.createElement("canvas");
        newCanvas.width = newWidth;
        newCanvas.height = newHeight;
        const ctx = newCanvas.getContext("2d");
        
        // Fill the entire canvas with a grey background
        ctx.fillStyle = "#cccccc"; // Change this to your preferred grey shade
        ctx.fillRect(0, 0, newWidth, newHeight);
        
        // Draw the original QR code canvas onto the new canvas, centered
        ctx.drawImage(originalCanvas, margin, margin);
        
        // Convert the new canvas to a blob and trigger the download
        newCanvas.toBlob((blob) => {
          saveAs(blob, "barcode.png");
        });
      }
    }
  };
  

  return (
    <div style={{ padding: "1em", border: "1px solid #ddd", marginBottom: "1em" }}>
      <h2>Single Barcode Generator</h2>
      <form onSubmit={generateQRCode} style={{ marginBottom: "1em" }}>
        <div style={{ marginBottom: "1em" }}>
          <label>
            PONumber:{" "}
            <input
              type="text"
              name="PONumber"
              value={formData.PONumber}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: "1em" }}>
          <label>
            ReceivingNo:{" "}
            <input
              type="text"
              name="ReceivingNo"
              value={formData.ReceivingNo}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: "1em" }}>
          <label>
            Supplier:{" "}
            <input
              type="text"
              name="Supplier"
              value={formData.Supplier}
              onChange={handleChange}
              placeholder="Unknown Supplier"
              required
            />
          </label>
        </div>
        <hr />
        <h3>Item Details</h3>
        <div style={{ marginBottom: "1em" }}>
          <label>
            ItemNo:{" "}
            <input
              type="text"
              name="ItemNo"
              value={formData.ItemNo}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: "1em" }}>
          <label>
            Description:{" "}
            <input
              type="text"
              name="Description"
              value={formData.Description}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: "1em" }}>
          <label>
            Quantity:{" "}
            <input
              type="number"
              name="Quantity"
              value={formData.Quantity}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: "1em" }}>
          <label>
            SerialNumber:{" "}
            <input
              type="text"
              name="SerialNumber"
              value={formData.SerialNumber}
              onChange={handleChange}
              placeholder="Default-SN"
            />
          </label>
        </div>
        <div style={{ marginBottom: "1em" }}>
          <label>
            InvoiceNo:{" "}
            <input
              type="text"
              name="InvoiceNo"
              value={formData.InvoiceNo}
              onChange={handleChange}
              placeholder="Default Invoice"
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: "1em" }}>
          <label>
            Location:{" "}
            <input
              type="text"
              name="Location"
              value={formData.Location}
              onChange={handleChange}
              placeholder="Unknown"
            />
          </label>
        </div>
        <div style={{ marginBottom: "1em" }}>
          <label>
            ReceivingDate:{" "}
            <input
              type="date"
              name="ReceivingDate"
              value={formData.ReceivingDate}
              onChange={handleChange}
            />
          </label>
        </div>
        <div style={{ marginBottom: "1em" }}>
          <label>
            Amount:{" "}
            <input
              type="number"
              name="Amount"
              value={formData.Amount}
              onChange={handleChange}
              placeholder="Unknown"
            />
          </label>
        </div>
        <button type="submit" style={{ marginTop: "0.5em" }}>
          Generate Barcode
        </button>
      </form>
      {qrData && (
        <div ref={qrRef} style={{ marginBottom: "1em" , backgroundColor: "#f9f9f9", padding: "1em" }}>
          <QRCodeCanvas value={qrData} size={256} />
        </div>
      )}
      {qrData && (
        <button onClick={downloadQRCode}>Download Barcode</button>
      )}
    </div>
  );
};

export default SingleBarcodeGenerator;