# OEE Dashboard - System Design & Clean Architecture

## Project Overview

The OEE (Overall Equipment Effectiveness) Dashboard is a production monitoring system that calculates and visualizes three key manufacturing metrics to measure equipment performance.

---

## System Architecture

### Architecture Pattern: Clean Architecture + Hexagonal Architecture

The project follows **clean architecture principles** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────┐
│          PRESENTATION LAYER (UI Components)         │
│     home.component.ts | home.html | home.css        │
└────────────────────┬────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│       APPLICATION LAYER (State Management)          │
│  OeeStateService | View Models | Reactive State    │
└────────────────────┬────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│      DOMAIN LAYER (Business Logic)                  │
│  OeeCalculationService | OEE Formulas               │
└────────────────────┬────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│         DATA LAYER (Models & Interfaces)            │
│  OeeInput | OeeResult | OeeStatus | Thresholds      │
└─────────────────────────────────────────────────────┘
```

### Directory Structure

```
src/app/
├── components/
│   └── home/
│       ├── home.ts              (Presentation Component)
│       ├── home.html            (View Template)
│       └── home.css             (Styling)
│
├── services/
│   ├── oee-calculation.service.ts    (Domain Logic)
│   └── oee-state.service.ts          (State Management)
│
├── model/
│   ├── oee-input.ts             (Data Models & Interfaces)
│   └── oee-viewmodel.ts         (View Presentation Logic)
│
└── [other components...]
```

---

## Core Concepts & Formulas

### OEE Definition

**Overall Equipment Effectiveness (OEE) = Availability × Performance × Quality**

#### 1. **Availability**

- **Formula**: Operating Time / Planned Production Time
- **Range**: 0% - 100%
- **Measures**: Equipment uptime vs planned runtime
- **Input**: Planned time (min), Downtime (min)
- **Calculation**: `(Planned - Downtime) / Planned`

#### 2. **Performance**

- **Formula**: (Total Units × Target Cycle Time) / (Operating Time × 60)
- **Range**: 0% - ∞ (can exceed 100% if exceeding target)
- **Measures**: Actual output vs target capacity
- **Inputs**:
  - Total Units Produced
  - Target Cycle Time (seconds/unit)
  - Operating Time (minutes)
- **Calculation**: `(Total Units × Target Cycle Time) / (Operating Time × 60)`
- **Note**: Mathematically equivalent to Actual Rate / Target Rate but simplified for clarity

#### 3. **Quality**

- **Formula**: Good Units / Total Units Produced
- **Range**: 0% - 100%
- **Measures**: First-pass quality (defect rate)
- **Input**: Good units, Total units produced
- **Calculation**: `Good / Total`

---

## Input Parameters

| Input                   | Unit    | Description                                | Example |
| ----------------------- | ------- | ------------------------------------------ | ------- |
| Planned Production Time | Minutes | Total time allocated for production        | 480     |
| Downtime                | Minutes | Machine downtime (maintenance, breakdowns) | 45      |
| Total Units Produced    | Count   | All units produced (good + defective)      | 850     |
| Good Units Produced     | Count   | Units meeting quality standards            | 820     |
| Target Cycle Time       | Seconds | Ideal time per unit (1 / Target Rate)      | 60      |

---

## Output Results

### Calculated Metrics

| Output       | Type | Range | Status Threshold |
| ------------ | ---- | ----- | ---------------- |
| Availability | %    | 0-100 | ≥85% Good        |
| Performance  | %    | 0-∞   | ≥85% Good        |
| Quality      | %    | 0-100 | ≥85% Good        |
| OEE          | %    | 0-100 | ≥70% Acceptable  |

### Status Levels

| Status         | OEE Range | Color           | Action                     |
| -------------- | --------- | --------------- | -------------------------- |
| **Excellent**  | 95-100%   | Green (#14b8a6) | Maintain current practices |
| **Good**       | 85-94%    | Cyan (#06b6d4)  | Monitor trends             |
| **Acceptable** | 70-84%    | Amber (#f59e0b) | Plan improvements          |
| **Poor**       | < 70%     | Red (#ef4444)   | Urgent action needed       |

### Additional Outputs

- **Operating Time**: Planned Time - Downtime
- **Defective Units**: Total Units - Good Units
- **Actual Production Rate**: Total Units / Operating Time (units/min)
- **Interpretation**: AI-generated bottleneck analysis
- **Status**: Automatic categorization

---

## Layer Breakdown

### 1. **Presentation Layer** (`home.component.ts`)

**Responsibility**: Handle user interactions and display

**Key Methods**:

- `onInputChange()`: Delegate input to state service
- `resetMetrics()`: Reset to defaults
- `updateCharts()`: Update chart visualization

**Dependencies**:

- OeeStateService (injected)
- OeeViewModel (static helpers)
- Chart.js for visualization

---

### 2. **Application Layer** (`oee-state.service.ts`)

**Responsibility**: Manage application state reactively

**Key Features**:

- BehaviorSubject for reactive state management
- Observable streams for input/output
- Delegation to calculation service
- State persistence across component lifecycle

**Methods**:

- `getInput()` / `getResult()`: Synchronous access
- `updateInput()`: Update single field
- `setInput()`: Full state update
- `reset()`: Clear to defaults

---

### 3. **Domain Layer** (`oee-calculation.service.ts`)

**Responsibility**: Pure business logic - OEE calculations

**Key Features**:

- **Input Validation**: Ensures data integrity
- **Availability Calculation**: Operating time / planned time
- **Performance Calculation**: Actual rate vs target rate
- **Quality Calculation**: Good units / total units
- **Status Determination**: Maps OEE to status level
- **Bottleneck Analysis**: Identifies improvement priority

**Methods**:

- `calculate(input)`: Main calculation orchestrator
- `calculateTargetRate()`: Convert cycle time to rate
- `determineStatus()`: Map value to status
- `getInterpretation()`: Generate insights

---

### 4. **Data Layer** (`oee-input.ts` & `oee-viewmodel.ts`)

**Responsibility**: Data structures and view formatting

**Models**:

- `OeeInput`: Raw production data interface
- `OeeResult`: Calculated results interface
- `OeeStatus`: Enum for status levels
- `OEE_THRESHOLDS`: Configuration constants

**View Model** (`oee-viewmodel.ts`):

- `formatMetric()`: Format numbers as percentages
- `getStatusText()`: Human-readable status
- `prepareChartData()`: Format for charts
- `getMetricsBreakdown()`: Detailed reporting

---

## Data Flow

```
User Input (HTML)
    ↓
onInputChange() [Component]
    ↓
updateInput() [State Service]
    ↓
setInput() → calculate() [Calculation Service]
    ↓
OeeResult [Domain Model]
    ↓
State Subject emits result
    ↓
Component receives via Observable
    ↓
updateCharts() [Component]
    ↓
UI Re-renders with new data
```

---

## Clean Architecture Principles Applied

### 1. **Separation of Concerns**

- ✅ UI Logic separated from business logic
- ✅ Calculations isolated in dedicated service
- ✅ State management centralized

### 2. **Dependency Injection**

- ✅ Services injected via Angular DI
- ✅ No hard dependencies on implementations
- ✅ Easy to test with mocks

### 3. **Single Responsibility Principle**

- ✅ Each service has one reason to change
- ✅ OeeCalculationService: only calculations
- ✅ OeeStateService: only state management

### 4. **Reactive Programming**

- ✅ RxJS Observables for state
- ✅ Automatic UI updates on data changes
- ✅ Better performance with OnPush strategy

### 5. **Type Safety**

- ✅ Strong interfaces for all data
- ✅ TypeScript strict mode
- ✅ Compile-time error detection

### 6. **Immutability**

- ✅ State objects created fresh (spread operator)
- ✅ No mutations of shared state
- ✅ Predictable updates

---

## Testing Strategy

### Unit Tests

```typescript
// OeeCalculationService.spec.ts
describe('OeeCalculationService', () => {
  it('should calculate availability correctly', () => {
    const input = { plannedProductionTime: 480, downtime: 45, ... };
    const result = OeeCalculationService.calculate(input);
    expect(result.availability).toBe(0.90625); // (480-45)/480
  });
});
```

### Integration Tests

```typescript
// home.component.spec.ts
describe("Home Component", () => {
  it("should update charts when input changes", () => {
    component.onInputChange("plannedProductionTime", 500);
    // Assert chart data updated
  });
});
```

---

## Scalability & Future Enhancements

### Potential Improvements

1. **Database Integration**: Persist historical data
2. **Multi-Line Support**: Track multiple production lines
3. **Real-time Updates**: WebSocket integration
4. **Trend Analysis**: Historical OEE tracking
5. **Export Reports**: PDF/Excel generation
6. **User Roles**: Permission-based features
7. **Alerts**: Notifications when OEE drops below threshold

### Performance Considerations

- ✅ OnPush change detection (if implemented)
- ✅ Lazy loading of large datasets
- ✅ Memoization of expensive calculations
- ✅ Virtual scrolling for large lists

---

## Configuration & Thresholds

### OEE Status Thresholds

```typescript
export const OEE_THRESHOLDS = {
  EXCELLENT: 0.95, // ≥95%
  GOOD: 0.85, // 85-94%
  ACCEPTABLE: 0.7, // 70-84%
  POOR: 0, // <70%
};
```

### Target Cycle Time Formula

- **Default**: 60 seconds/unit = 1 unit/minute
- **Customizable**: Set via input field
- **Alternative**: Use Target Production Rate (units/min) directly

---

## Error Handling

### Validation Rules

1. Planned time must be > 0
2. Downtime cannot be negative
3. Good units ≤ Total units
4. Both cycle time and rate cannot be 0

### User Feedback

- Form validation with helpful messages
- Invalid input triggers reset
- Clear interpretation text for results

---

## Conclusion

This OEE Dashboard demonstrates:

- ✅ Clean architecture principles
- ✅ Proper separation of concerns
- ✅ Reactive state management
- ✅ Type-safe TypeScript development
- ✅ Scalable, maintainable codebase
