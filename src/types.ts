export interface TableData {
  batchId: string;
  header: string;
  object: string;
  success: string;
  error: string;
  skipped: string;
}

export interface ParsedBlock {
  header: string;
  rows: {
    object: string;
    success: string;
    error: string;
    skipped: string;
  }[];
}