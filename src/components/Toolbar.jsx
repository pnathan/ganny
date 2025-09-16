import React, { useRef } from 'react';
import './Toolbar.css';

const Toolbar = ({ onJsonExport, onJsonImport, onDataCsvExport, onDataCsvImport, onVisualCsvExport }) => {
  const jsonFileInputRef = useRef(null);
  const csvFileInputRef = useRef(null);

  const handleJsonImportClick = () => {
    jsonFileInputRef.current.click();
  };

  const handleCsvImportClick = () => {
    csvFileInputRef.current.click();
  };

  return (
    <div className="toolbar">
      <button className="toolbar-btn">Add Task</button>

      <input
        type="file"
        ref={jsonFileInputRef}
        onChange={onJsonImport}
        style={{ display: 'none' }}
        accept=".json"
      />
      <button className="toolbar-btn" onClick={handleJsonImportClick}>Import JSON</button>

      <input
        type="file"
        ref={csvFileInputRef}
        onChange={onDataCsvImport}
        style={{ display: 'none' }}
        accept=".csv"
      />
      <button className="toolbar-btn" onClick={handleCsvImportClick}>Import CSV</button>

      <button className="toolbar-btn" onClick={onJsonExport}>Export JSON</button>
      <button className="toolbar-btn" onClick={onDataCsvExport}>Export CSV</button>
      <button className="toolbar-btn" onClick={onVisualCsvExport}>Export Visual CSV</button>
    </div>
  );
};

export default Toolbar;
