import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { saveAs } from "file-saver";

function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

const BulkBarcodeGenerator = () => {
  const [dataRecords, setDataRecords] = useState([]);
  const [error, setError] = useState("");

  // Handle file upload and parse Excel/CSV file
  const handleFileUpload = (e) => {
    setError("");
    const file = e.target.files[0];
    if (!file) {
      setError("No file selected.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
        if (!jsonData.length) {
          setError("No data found in the file.");
          return;
        }
  
        const dataRows = jsonData.slice(1);
        const groupedRecords = {};
  
        // **Group data by PONumber**
        dataRows.forEach((values) => {
          const poNumber = values[0] || "Unknown-PO";
  
          if (!groupedRecords[poNumber]) {
            groupedRecords[poNumber] = {
              PONumber: poNumber,
              ReceivingNo: values[1] || "",
              Supplier: values[2] || "Unknown Supplier",
              items: [],
            };
          }
  
          // Add item details to the corresponding PO group
          groupedRecords[poNumber].items.push({
            ItemNo: values[3] || "",
            Description: values[4] || "",
            Quantity: Number(values[5]) || 0,
            SerialNumber: values[6] || "Default-SN",
            InvoiceNo: values[7] || "Default Invoice",
            Location: values[8] || "Unknown",
            ReceivingDate: values[9]
              ? XLSX.SSF.format("yyyy-mm-dd", values[9])
              : new Date().toLocaleDateString(),
            Amount: values[10] || "Unknown",
          });
        });
  
        setDataRecords(Object.values(groupedRecords));
      } catch (ex) {
        setError("Error parsing file. Please ensure it is a valid Excel or CSV file.");
      }
    };
    reader.readAsBinaryString(file);
  };
  
  

  // Download a single barcode image for a given record index
  const downloadSingleBarcode = (index) => {
    const canvas = document.getElementById(`qrcode-bulk-${index}`);
    if (canvas) {
      canvas.toBlob((blob) => {
        saveAs(blob, `barcode-${index + 1}.png`);
      });
    }
  };

  // Download all barcode images as a ZIP file
  const downloadAllBarcodes = () => {
    const zip = new JSZip();
    const promises = dataRecords.map((record, index) => {
      const canvas = document.getElementById(`qrcode-bulk-${index}`);
      return new Promise((resolve) => {
        if (canvas) {
          canvas.toBlob((blob) => {
            zip.file(`barcode-${index + 1}.png`, blob);
            resolve();
          });
        } else {
          resolve();
        }
      });
    });
    Promise.all(promises).then(() => {
      zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, "barcodes.zip");
      });
    });
  };

  return (
    <div style={{ padding: "1em", border: "1px solid #ddd" }}>
      <h2>Bulk Barcode Generator</h2>
      <div>
        <label>
          Upload Excel/CSV File:{" "}
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileUpload}
          />
        </label>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
      {dataRecords.length > 0 && (
        <div>
          <h3>Generated Barcodes</h3>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {dataRecords.map((record, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ccc",
                  margin: "0.5em",
                  padding: "0.5em",
                  textAlign: "center",
                }}
              >
                {/* Render QR code for each record */}
                <QRCodeCanvas
                  id={`qrcode-bulk-${index}`}
                  value={JSON.stringify([record])}
                  size={150}
                />
                <p>Record {index + 1}</p>
                <button onClick={() => downloadSingleBarcode(index)}>
                  Download
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={downloadAllBarcodes}
            style={{ marginTop: "1em", padding: "0.5em 1em" }}
          >
            Download All as ZIP
          </button>
        </div>
      )}
    </div>
  );
};

export default BulkBarcodeGenerator;
