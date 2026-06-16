# Quick Reference - OEE Dashboard

## 🚀 Get Started

```bash
# Install dependencies (if needed)
npm install

# Start the development server
npm start

# Open browser to http://localhost:4200
```

---

## 📖 Documentation Files

| File                                                       | Purpose                        | Audience         |
| ---------------------------------------------------------- | ------------------------------ | ---------------- |
| **[SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md)**                 | Architecture & design patterns | Developers       |
| **[INPUT_OUTPUT_GUIDE.md](./INPUT_OUTPUT_GUIDE.md)**       | User guide & examples          | End Users        |
| **[ARCHITECTURE_OVERVIEW.md](./ARCHITECTURE_OVERVIEW.md)** | Clean architecture principles  | Architects       |
| **[COMPLETION_SUMMARY.md](./COMPLETION_SUMMARY.md)**       | Project completion checklist   | Project Managers |
| **[README.md](./README.md)**                               | General project info           | Everyone         |

---

## 🎯 Key Features

✅ Real-time OEE calculation  
✅ Three pillars of OEE (Availability, Performance, Quality)  
✅ Interactive charts & visualizations  
✅ Smart status indicators (Excellent/Good/Acceptable/Poor)  
✅ Improvement recommendations  
✅ Responsive design

---

## 📊 OEE Formula

```
OEE = Availability × Performance × Quality

• Availability = (Planned Time - Downtime) / Planned Time
• Performance = (Total Units × Target Cycle Time) / (Operating Time × 60)
• Quality = Good Units / Total Units
```

---

## 💻 Technology Stack

- **Angular 20** - Modern web framework
- **TypeScript 5.8** - Type-safe language
- **RxJS 7.8** - Reactive programming
- **Chart.js 4.5** - Data visualization
- **Clean Architecture** - SOLID principles

---

## 📁 Project Structure

```
Services (Business Logic)
├── oee-calculation.service.ts     ← Core OEE math
└── oee-state.service.ts           ← Reactive state

Models (Data Contracts)
├── oee-input.ts                   ← Interfaces & enums
└── oee-viewmodel.ts               ← UI formatting

Components (Presentation)
└── home/
    ├── home.ts                    ← Component logic
    ├── home.html                  ← Template
    └── home.css                   ← Styling
```

---

## 🔧 Inputs Required

| Input                   | Example | Unit         |
| ----------------------- | ------- | ------------ |
| Planned Production Time | 480     | minutes      |
| Downtime                | 30      | minutes      |
| Total Units Produced    | 960     | count        |
| Good Units              | 925     | count        |
| Target Cycle Time       | 60      | seconds/unit |

---

## 📈 Outputs Provided

| Output       | Type | Range | Status      |
| ------------ | ---- | ----- | ----------- |
| Availability | %    | 0-100 | ≥85% = Good |
| Performance  | %    | 0-∞   | ≥85% = Good |
| Quality      | %    | 0-100 | ≥85% = Good |
| OEE          | %    | 0-100 | ≥70% = OK   |

---

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm run test -- --code-coverage

# Build for production
npm run build
```

---

## 🌐 Browser Support

✅ Chrome 90+  
✅ Firefox 88+  
✅ Safari 14+  
✅ Edge 90+

---

## 🛠️ Configuration

**Change OEE thresholds**: Edit `src/app/model/oee-input.ts`

```typescript
export const OEE_THRESHOLDS = {
  EXCELLENT: 0.95, // ← Adjust here (0-1)
  GOOD: 0.85,
  ACCEPTABLE: 0.7,
  POOR: 0,
};
```

**Change colors**: Edit `src/app/services/oee-state.service.ts`

```typescript
getStatusColor(status: OeeStatus): string {
  switch (status) {
    case OeeStatus.EXCELLENT:
      return '#14b8a6';  // ← Adjust here
    // ...
  }
}
```

---

## 🎓 Example Calculation

**Input Data**:

- Planned Time: 480 min
- Downtime: 30 min
- Total Units: 960
- Good Units: 925
- Target Cycle: 60 sec

**Calculations**:

```
Operating Time = 480 - 30 = 450 min
Availability = 450 / 480 = 93.75%
Actual Rate = 960 / 450 = 2.13 units/min
Target Rate = 60 / 60 = 1.0 units/min
Performance = 2.13 / 1.0 = 213%
Quality = 925 / 960 = 96.4%
OEE = 0.9375 × 2.13 × 0.964 = 194% (capped at 100%)
```

**Result**: 🟢 EXCELLENT - All metrics exceeding targets!

---

## 🚨 Troubleshooting

| Issue                 | Solution                                                 |
| --------------------- | -------------------------------------------------------- |
| Charts not displaying | Ensure ng2-charts is installed: `npm install ng2-charts` |
| Compilation errors    | Run `ng serve` to see detailed errors                    |
| Calculations wrong    | Check input units (min for time, sec for cycle)          |
| Port 4200 in use      | Change port: `ng serve --port 4201`                      |

---

## 📞 Support

**For Users**: See INPUT_OUTPUT_GUIDE.md  
**For Developers**: See SYSTEM_DESIGN.md  
**For Architects**: See ARCHITECTURE_OVERVIEW.md

---

## ✅ Status

**Compilation**: ✅ Zero Errors  
**Tests**: ✅ Ready to run  
**Documentation**: ✅ Complete  
**Production Ready**: ✅ Yes

---

**Start coding**: `npm start` → Open http://localhost:4200

**Happy Manufacturing! 🏭**
