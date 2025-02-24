import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { TableData } from '../types';

interface FileUploadProps {
  onDataParsed: (data: TableData[]) => void;
}

export function FileUpload({ onDataParsed }: FileUploadProps) {
  const extractBatchId = (fileName: string): string => {
    // Extract numbers from filename
    const numbers = fileName.match(/\d+/);
    return numbers ? numbers[0] : '0';
  };

  const detectDelimiter = (content: string): string => {
    const firstLine = content.split(/\r?\n/)[0];
    const tabCount = (firstLine.match(/\t/g) || []).length;
    const commaCount = (firstLine.match(/,/g) || []).length;
    return tabCount >= commaCount ? '\t' : ',';
  };

  const normalizeLineEndings = (content: string): string => {
    // Replace all \r\n with \n and handle any standalone \r
    return content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  };

  const parseFileContent = useCallback((content: string, fileName: string): TableData[] => {
    // Normalize line endings first
    const normalizedContent = normalizeLineEndings(content);
    const batchId = extractBatchId(fileName);
    const delimiter = detectDelimiter(normalizedContent);
    const blocks = normalizedContent.split('\n\n').filter(block => block.trim());
    const parsedData: TableData[] = [];

    if (blocks.length === 1 && delimiter === ',') {
      // Handle single CSV block
      const lines = normalizedContent.split('\n').filter(line => line.trim());
      if (lines.length < 2) return [];

      // Skip the first line as it contains column headers
      const dataRows = lines.slice(1);

      dataRows.forEach(row => {
        const values = row.split(delimiter).map(val => val.trim());
        if (values.length >= 4) {
          parsedData.push({
            batchId,
            header: values[0] || '', // Use first column as header
            object: values[1] || '',
            success: values[2] || '',
            error: values[3] || '',
            skipped: values[4] || ''
          });
        }
      });
    } else {
      // Handle TSV blocks or multi-block format
      blocks.forEach((block) => {
        const lines = block.split('\n').filter(line => line.trim());
        if (lines.length < 2) return;

        // First line is the actual header
        const header = lines[0];

        // Skip the "Object Success Error Skipped" line and process remaining rows
        const dataRows = lines.slice(2);

        dataRows.forEach(row => {
          const [object, success, error, skipped] = row.split(delimiter).map(val => val.trim());
          if (object || success || error || skipped) { // Only add row if it has data
            parsedData.push({
              batchId,
              header,
              object: object || '',
              success: success || '',
              error: error || '',
              skipped: skipped || ''
            });
          }
        });
      });
    }

    return parsedData;
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const parsedData = parseFileContent(content, file.name);
      onDataParsed(parsedData);
    };
    reader.readAsText(file);
  }, [onDataParsed, parseFileContent]);

  return (
      <div className="w-full max-w-md mx-auto">
        <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">CSV or TSV files (with numeric batch ID in filename)</p>
          </div>
          <input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".csv,.tsv,.txt"
              onChange={handleFileUpload}
          />
        </label>
      </div>
  );
}