import React, { useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import * as XLSX from 'xlsx';

// Define allowed file types
const fileTypes = ["XLSX"];

// Define the structure of our parsed data
//interface ExcelData {
  //[key: string]: any;
//}

interface ExcelData extends Record<string, unknown> {}

const DragDropExcel: React.FC = () => {
  const [fileData, setFileData] = useState<ExcelData[] | null>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      
      // Assume we're reading the first sheet
workbook.Sheets.foreach
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      const json = XLSX.utils.sheet_to_json(worksheet) as ExcelData[];
      setFileData(json);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <h1>Drag and Drop Excel File</h1>
      <FileUploader>
        handleChange={handleFile}
        name="file"
        types={fileTypes}
        <div style={{ width: '500px', height: '400px', border: '2px dashed #ccc' }}>
            <p>Drag and drop your Excel file here</p>
        </div>
      </FileUploader>

      {fileData && (
        <div>
          <h2>File Data</h2>
          <pre>{JSON.stringify(fileData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default DragDropExcel;