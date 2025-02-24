import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { DataTable } from './components/DataTable';
import { TableData } from './types';
import { FileText } from 'lucide-react';

function App() {
  const [tableData, setTableData] = useState<TableData[]>([]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">File Parser</h1>
          </div>
          <p className="text-gray-600">
            Upload your CSV or TSV file to view and analyze the data
          </p>
        </div>

        <div className="space-y-8">
          <FileUpload onDataParsed={setTableData} />
          
          {tableData.length > 0 ? (
            <DataTable data={tableData} />
          ) : (
            <div className="text-center text-gray-500 mt-8">
              No data to display. Please upload a file.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;