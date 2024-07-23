import React, { useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import * as XLSX from 'xlsx';

// Define allowed file types
const fileTypes = ["XLSX"];

// Define the structure of our parsed data
interface ExcelData extends Record<string, unknown> {}

const DragDropExcel: React.FC = () => {
  const [fileData, setFileData] = useState<Record<string, ExcelData[]> | null>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      
      const allSheetData: Record<string, ExcelData[]> = {};

      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json<ExcelData>(worksheet);
        allSheetData[sheetName] = json;
      });

      setFileData(allSheetData);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <h1>Drag and Drop Excel File</h1>
      <FileUploader
        handleChange={handleFile}
        name="file"
        types={fileTypes}
      />
      {fileData && (
        <div>
          <h2>File Data</h2>
          {Object.keys(fileData).map(sheetName => (
            <div key={sheetName}>
              <h3>{sheetName}</h3>
              <pre>{JSON.stringify(fileData[sheetName], null, 2)}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DragDropExcel;