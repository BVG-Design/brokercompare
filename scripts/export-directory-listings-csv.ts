import fs from 'fs';
import path from 'path';

// Helper function to flatten nested objects/arrays for CSV
function flattenValue(value: any): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'string') return value.replace(/"/g, '""'); // Escape quotes for CSV
  if (Array.isArray(value)) {
    if (value.length === 0) return '';
    // Handle array of objects
    if (typeof value[0] === 'object' && value[0] !== null) {
      return value.map((item: any) => {
        if (item.listing && item.priority) {
          return `${item.listing} (Priority: ${item.priority})`;
        }
        if (item.feature && item.value !== undefined) {
          return `${item.feature}: ${item.value}${item.notes ? ` (${item.notes})` : ''}`;
        }
        return JSON.stringify(item);
      }).join('; ');
    }
    return value.join('; ');
  }
  if (typeof value === 'object') {
    return JSON.stringify(value).replace(/"/g, '""');
  }
  return String(value);
}

// Helper function to get all possible CSV headers from the data
function getAllHeaders(data: any[]): string[] {
  const headers = new Set<string>();
  
  data.forEach(item => {
    Object.keys(item).forEach(key => {
      headers.add(key);
    });
  });
  
  return Array.from(headers).sort();
}

// Convert data to CSV
function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';
  
  const headers = getAllHeaders(data);
  const rows: string[] = [];
  
  // Add header row
  rows.push(headers.map(h => `"${h}"`).join(','));
  
  // Add data rows
  data.forEach(item => {
    const row = headers.map(header => {
      const value = item[header];
      const flattened = flattenValue(value);
      return `"${flattened}"`;
    });
    rows.push(row.join(','));
  });
  
  return rows.join('\n');
}

async function main() {
  try {
    // Read the query result files
    const file1Path = path.join(process.cwd(), '..', '.cursor', 'projects', 'c-Users-maria-Downloads-brokercompare', 'agent-tools', 'b167434b-0ca5-4345-ad18-a78a79ac10a3.txt');
    const file2Path = path.join(process.cwd(), '..', '.cursor', 'projects', 'c-Users-maria-Downloads-brokercompare', 'agent-tools', '431a3ed7-0db2-4cdb-8d18-1c41955adf99.txt');
    
    // Try reading from the workspace directory instead
    const altFile1Path = path.join(process.cwd(), '..', '..', '..', '.cursor', 'projects', 'c-Users-maria-Downloads-brokercompare', 'agent-tools', 'b167434b-0ca5-4345-ad18-a78a79ac10a3.txt');
    const altFile2Path = path.join(process.cwd(), '..', '..', '..', '.cursor', 'projects', 'c-Users-maria-Downloads-brokercompare', 'agent-tools', '431a3ed7-0db2-4cdb-8d18-1c41955adf99.txt');
    
    let file1Content = '';
    let file2Content = '';
    
    // Try to read files
    try {
      file1Content = fs.readFileSync(file1Path, 'utf-8');
      file2Content = fs.readFileSync(file2Path, 'utf-8');
    } catch (e) {
      try {
        file1Content = fs.readFileSync(altFile1Path, 'utf-8');
        file2Content = fs.readFileSync(altFile2Path, 'utf-8');
      } catch (e2) {
        console.error('Could not read query result files. Please provide the file paths.');
        process.exit(1);
      }
    }
    
    // Extract JSON from the files (they contain query results with metadata)
    // The actual documents are between <documents> tags or in JSON format
    const extractDocuments = (content: string): any[] => {
      const documents: any[] = [];
      
      // Try to find JSON array pattern
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        } catch (e) {
          // Not valid JSON, continue with other methods
        }
      }
      
      // Try to extract documents from <documents> tags
      const docMatches = content.matchAll(/<documents>([\s\S]*?)<\/documents>/g);
      for (const match of docMatches) {
        try {
          const doc = JSON.parse(match[1]);
          documents.push(doc);
        } catch (e) {
          // Skip invalid JSON
        }
      }
      
      return documents;
    };
    
    const documents1 = extractDocuments(file1Content);
    const documents2 = extractDocuments(file2Content);
    
    const allDocuments = [...documents1, ...documents2];
    
    console.log(`Found ${allDocuments.length} directory listings`);
    
    // Convert to CSV
    const csv = convertToCSV(allDocuments);
    
    // Write to file
    const outputPath = path.join(process.cwd(), 'sanity', 'csv-export', 'directoryListing.csv');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, csv, 'utf-8');
    
    console.log(`CSV exported to: ${outputPath}`);
    console.log(`Total rows: ${allDocuments.length + 1} (including header)`);
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
