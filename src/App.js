import React, { useState } from "react";
import SingleBarcodeGenerator from "./SingleBarcodeGenerator";
import BulkBarcodeGenerator from "./BulkBarcodeGenerator";

function App() {
  const [mode, setMode] = useState("single"); // "single" or "bulk"

  return (
    <div
      className="App"
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "1em",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img src="/logo.png" alt="Company Logo" style={{ width: "100px", height: "auto" }} />
        <h1>WMS Barcode (QR Code) Generator</h1>
      </div>
      <div style={{ marginBottom: "1em" , marginTop: "1em"}}>
        <button
          onClick={() => setMode("single")}
          style={{
            marginRight: "1em",
            padding: "0.5em 1em",
            backgroundColor: mode === "single" ? "#007bff" : "#ccc",
            color: mode === "single" ? "#fff" : "#000",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Single Barcode
        </button>
        <button
          onClick={() => setMode("bulk")}
          style={{
            padding: "0.5em 1em",
            backgroundColor: mode === "bulk" ? "#007bff" : "#ccc",
            color: mode === "bulk" ? "#fff" : "#000",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Bulk Upload
        </button>
      </div>
      {mode === "single" && <SingleBarcodeGenerator />}
      {mode === "bulk" && <BulkBarcodeGenerator />}
    </div>
  );
}

export default App;
