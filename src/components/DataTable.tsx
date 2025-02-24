import React from 'react';
import { Download } from 'lucide-react';
import { TableData } from '../types';

interface DataTableProps {
  data: TableData[];
}

export function DataTable({ data }: DataTableProps) {
  const handleDownload = () => {
    const headers = ['BatchId', 'Header', 'Object', 'Success', 'Error', 'Skipped'];
    const csvContent = [
      headers.join(','),
      ...data.map(row => [
        row.batchId,
        row.header,
        row.object,
        row.success,
        row.error,
        row.skipped
      ].join(','))
    ].join('\n');

    // Get unique batch IDs
    const uniqueBatchIds = Array.from(new Set(data.map(row => row.batchId))).sort();
    const batchIdString = uniqueBatchIds.length > 3
        ? `batches-${uniqueBatchIds.length}`
        : `batch-${uniqueBatchIds.join('-')}`;

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${batchIdString}-${timestamp}.csv`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
      <div className="w-full overflow-hidden rounded-lg shadow-lg">
        <div className="flex justify-between items-center bg-white px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">Parsed Data</h2>
          {data.length > 0 && (
              <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download CSV
              </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full bg-white">
            <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Row #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Batch ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Header
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Object
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Success
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Error
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Skipped
              </th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
            {data.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.batchId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.header}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.object}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.success}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.error}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.skipped}
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
  );
}