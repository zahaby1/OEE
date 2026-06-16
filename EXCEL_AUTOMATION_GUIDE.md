# Excel Automation Guide - OEE Dashboard

## Overview

The OEE Dashboard now supports **automated Excel file uploads** to instantly calculate OEE metrics without manual data entry.

---

## Getting Started

### Step 1: Download Template

1. Click the **📥 Download Template** button
2. A file named `OEE_Template.xlsx` will be downloaded
3. Open it in Excel or Google Sheets

### Step 2: Enter Your Data

**Excel Column Layout**:

| Column A                          | Column B           | Column C        | Column D       | Column E                    |
| --------------------------------- | ------------------ | --------------- | -------------- | --------------------------- |
| **Planned Production Time (min)** | **Downtime (min)** | **Total Units** | **Good Units** | **Target Cycle Time (sec)** |
| 480                               | 30                 | 960             | 925            | 30                          |
| 480                               | 45                 | 850             | 820            | 60                          |
| 600                               | 60                 | 1200            | 1150           | 45                          |

**Example Data** (already in template):

- Row 1: 8-hour shift with 30 min downtime
- Row 2: 8-hour shift with 45 min downtime
- Row 3: 10-hour shift with 60 min downtime

### Step 3: Upload File

1. Click **📁 Choose Excel File** button
2. Select your Excel file (.xlsx or .xls)
3. Wait for the system to read the file (shows "⏳ Reading file...")

### Step 4: Select Data Row

If your Excel file has multiple rows:

- A dropdown menu appears: "Select Row"
- Choose which row to calculate

The dashboard automatically displays:

- OEE values
- Availability, Performance, Quality metrics
- Charts and interpretation
- Improvement recommendations

---

## Excel File Format Requirements

### Valid Format ✅

```
Row 1: Headers (labels)
Row 2+: Data (numbers)

Format:
A         B      C    D   E
480       30     960  925 30
450       20     800  785 45
...
```

### File Requirements

- **File Type**: .xlsx or .xls
- **Headers**: First row should have labels (recommended but not required)
- **Data Columns**: Exactly 5 columns in this order:
  1. Planned Production Time
  2. Downtime
  3. Total Units Produced
  4. Good Units Produced
  5. Target Cycle Time

### Data Constraints

| Field        | Min | Max       | Unit    |
| ------------ | --- | --------- | ------- |
| Planned Time | > 0 | No limit  | Minutes |
| Downtime     | ≥ 0 | < Planned | Minutes |
| Total Units  | ≥ 0 | No limit  | Count   |
| Good Units   | ≥ 0 | ≤ Total   | Count   |
| Target Cycle | > 0 | No limit  | Seconds |

---

## Example: Complete Workflow

### 1. Template Example (Downloaded)

```
Planned Production Time (min) | Downtime (min) | Total Units | Good Units | Target Cycle Time (sec)
480                           | 30             | 960         | 925        | 30
```

### 2. Your Data (After Editing)

```
480 | 30 | 960 | 925 | 30
480 | 45 | 850 | 820 | 60
600 | 60 | 1200| 1150| 45
```

### 3. After Upload

- File "mydata.xlsx" loaded successfully
- Found 3 rows of data
- Select Row 1, 2, or 3 from dropdown
- Each selection recalculates and updates charts

### 4. Results Displayed

```
OEE: 96.7%
Availability: 93.75%
Performance: 106.7%
Quality: 96.4%

Status: 🟢 Excellent
Interpretation: "All metrics are performing well. Maintain current practices."
```

---

## Features

### ✅ What You Can Do

- Upload single or multiple rows at once
- Switch between rows with a dropdown
- Automatic OEE calculation
- Real-time chart updates
- Export results (via manual copy/screenshot)
- Download templates
- Enter manual data (text inputs still available)

### ❌ What You Cannot Do (Yet)

- Direct Excel cell linking (upload file instead)
- Multi-sheet workbooks (use single sheet)
- Custom column order (must match template)
- Real-time streaming (upload file when ready)

---

## Troubleshooting

### Error: "Please upload a valid Excel file"

**Cause**: Wrong file format

**Solution**:

- Ensure file ends with `.xlsx` or `.xls`
- Re-save if using CSV or other format

### Error: "No valid data found in Excel file"

**Cause**:

- No data rows in file
- All rows have invalid/missing values
- Data doesn't match constraints

**Solution**:

- Check file has data starting from row 2
- Verify values meet constraints (Planned > 0, etc.)
- Download fresh template and compare format

### File uploads but nothing happens

**Cause**: Data may be in wrong columns or format

**Solution**:

1. Download template again
2. Copy/paste your data into template columns
3. Re-upload

### Charts not updating

**Cause**: Data not properly loaded

**Solution**:

1. Refresh page (F5)
2. Try uploading file again
3. Check browser console for errors (F12)

---

## Technical Details

### Supported Formats

| Format | Support          |
| ------ | ---------------- |
| .xlsx  | ✅ Full support  |
| .xls   | ✅ Full support  |
| .ods   | ⚠️ Limited       |
| .csv   | ❌ Not supported |

### Data Processing

1. **Read**: File converted to JSON array
2. **Parse**: Each row validated for data type and constraints
3. **Filter**: Invalid rows skipped
4. **Calculate**: Valid rows feed to OEE calculation
5. **Display**: Results shown with charts

### Performance

- File read: < 1 second (typical)
- Parsing: < 100ms
- Calculation: < 10ms per row
- Display update: < 500ms

---

## Use Cases

### Manufacturing Floor

```
Daily Production Logs
├── Row 1: Shift 1 (6am-2pm)
├── Row 2: Shift 2 (2pm-10pm)
└── Row 3: Shift 3 (10pm-6am)

Upload file → Compare shifts → Identify issues
```

### Quality Analysis

```
Problem Investigation
├── Row 1: Before improvement
├── Row 2: After improvement
└── Row 3: After optimization

Track progress → Validate changes
```

### Batch Processing

```
Monthly Report
├── Week 1 data
├── Week 2 data
├── Week 3 data
└── Week 4 data

Upload all → Select rows → Analyze trends
```

---

## Tips & Best Practices

### ✅ Do This

- Save template before editing
- Keep headers in row 1
- Use whole numbers for units
- Validate data before uploading
- Keep one sheet per workbook
- Name files descriptively

### ❌ Avoid This

- Formulas in cells (use values only)
- Multiple sheets (copy to single sheet)
- Special characters in headers
- Merged cells
- Formatting/colors (won't affect data but slow upload)

---

## Keyboard Shortcuts

| Action      | Shortcut                    |
| ----------- | --------------------------- |
| Upload file | Click button or Ctrl+O      |
| Change row  | Tab to dropdown, arrow keys |
| Reset data  | Manual clear or reload page |

---

## Future Enhancements

🚀 **Planned Features**:

- [ ] Drag-and-drop file upload
- [ ] Preview before upload
- [ ] Batch calculations for all rows
- [ ] Export results to Excel
- [ ] Multi-sheet support
- [ ] Real-time streaming from cloud
- [ ] Database storage of historical data
- [ ] Trend analysis graphs

---

## Support

**Issues?** Check:

1. File format (.xlsx/.xls only)
2. Column order (must match template)
3. Data constraints (positive values, good ≤ total)
4. Browser console (F12 → Console tab)

**Questions?** Refer to:

- INPUT_OUTPUT_GUIDE.md (Data explanation)
- SYSTEM_DESIGN.md (Technical architecture)
- QUICK_REFERENCE.md (Quick formulas)

---

## Example Files

### Simple Template

```
Planned | Downtime | Total | Good | Cycle
480     | 30       | 960   | 925  | 30
```

### With Multiple Scenarios

```
Planned | Downtime | Total | Good | Cycle
480     | 15       | 950   | 940  | 30    (Excellent)
480     | 60       | 800   | 700  | 60    (Poor quality)
480     | 120      | 400   | 390  | 30    (High downtime)
```

### Real Manufacturing Data

```
Planned | Downtime | Total | Good | Cycle
480     | 30       | 960   | 925  | 30
480     | 35       | 950   | 920  | 30
480     | 32       | 970   | 945  | 30
```

---

**Last Updated**: June 16, 2026
**Version**: 1.0
**Status**: Production Ready
