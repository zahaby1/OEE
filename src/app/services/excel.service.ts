import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { OeeInput } from '../model/oee-input';

/**
 * Excel Service
 * Handles reading Excel files and extracting OEE input data
 */
@Injectable({ providedIn: 'root' })
export class ExcelService {
  /**
   * Read Excel file and extract OEE input data
   * Expects Excel columns:
   * - Column A: Planned Production Time (minutes)
   * - Column B: Downtime (minutes)
   * - Column C: Total Units Produced
   * - Column D: Good Units Produced
   * - Column E: Target Cycle Time (seconds)
   * 
   * @param file Excel file
   * @returns Array of OeeInput objects extracted from the sheet
   */
  readExcelFile(file: File): Promise<OeeInput[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event: any) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get the first sheet
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];

          // Convert to JSON (starting from row 2 to skip headers)
          const rows: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

          // Skip header row (row 0) and parse data rows
          const results: OeeInput[] = [];
          
          for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            
            // Skip empty rows
            if (!row || row.length === 0) continue;

            // Extract values from columns
            const plannedProductionTime = this.toNumber(row[0]);
            const downtime = this.toNumber(row[1]);
            const totalUnitsProduced = this.toNumber(row[2]);
            const goodUnitsProduced = this.toNumber(row[3]);
            const targetCycleTime = this.toNumber(row[4]);

            // Only add if we have valid data
            if (
              plannedProductionTime > 0 &&
              downtime >= 0 &&
              totalUnitsProduced >= 0 &&
              goodUnitsProduced >= 0 &&
              targetCycleTime > 0
            ) {
              results.push({
                plannedProductionTime,
                downtime,
                totalUnitsProduced,
                goodUnitsProduced,
                targetCycleTime,
              });
            }
          }

          resolve(results);
        } catch (error) {
          reject(new Error(`Failed to parse Excel file: ${error}`));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Convert value to number, handle various formats
   */
  private toNumber(value: any): number {
    if (value === null || value === undefined || value === '') {
      return 0;
    }
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  }

  /**
   * Create a sample Excel template for users
   * Downloads a template file with proper headers
   */
  downloadTemplate(): void {
    const templateData = [
      ['Planned Production Time (min)', 'Downtime (min)', 'Total Units', 'Good Units', 'Target Cycle Time (sec)'],
      [480, 30, 960, 925, 30],
      [480, 45, 850, 820, 60],
      [600, 60, 1200, 1150, 45],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(templateData);
    
    // Set column widths
    worksheet['!cols'] = [
      { wch: 30 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 25 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'OEE Data');

    // Download
    XLSX.writeFile(workbook, 'OEE_Template.xlsx');
  }
}
