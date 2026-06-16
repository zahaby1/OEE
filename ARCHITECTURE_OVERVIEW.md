# Clean Architecture Implementation - OEE Dashboard

## Executive Summary

This document outlines how the OEE Dashboard implements **Clean Architecture** principles to create a maintainable, scalable, and testable codebase.

---

## Problem Solved

**Original Issue**: The performance equation in OEE calculations was incorrect.

The old formula:

```typescript
performance = totalCount / operatingTime; // ❌ Wrong!
```

This divides units by minutes, yielding an invalid dimensionless ratio without normalization to a target.

**Solution Implemented**: Corrected performance formula with clean direct calculation.

```typescript
// ✅ Correct
const performance = (totalUnitsProduced * targetCycleTime) / (operatingTime * 60);
// Equivalent to: (Actual Rate) / (Target Rate)
```

---

## Architecture Layers

### 1. Presentation Layer (UI)

**Files**: `home.ts`, `home.html`, `home.css`

**Responsibility**:

- Display data to users
- Capture user input
- Delegate calculations to services

**Key Principle**: No business logic - pure presentation

```typescript
@Component({
  selector: "app-home",
  standalone: true,
  imports: [BaseChartDirective, FormsModule, CommonModule],
})
export class Home implements OnInit {
  // Inject services, don't create business logic
  constructor(private oeeState: OeeStateService) {}

  onInputChange(field: keyof OeeInput, value: any): void {
    // Delegate to state service
    this.oeeState.updateInput(field, parseFloat(value));
  }
}
```

**Benefits**:

- ✅ Easy to test UI behavior independently
- ✅ Can swap UI framework without affecting logic
- ✅ Reusable component architecture

---

### 2. Application Layer (State Management)

**Files**: `oee-state.service.ts`, `oee-viewmodel.ts`

**Responsibility**:

- Manage application state reactively
- Orchestrate interactions between layers
- Format data for presentation

**State Service**:

```typescript
@Injectable({ providedIn: 'root' })
export class OeeStateService {
  // Reactive state using RxJS
  private inputSubject = new BehaviorSubject<OeeInput>(...);
  private resultSubject = new BehaviorSubject<OeeResult>(...);

  // Public observables
  input$ = this.inputSubject.asObservable();
  result$ = this.resultSubject.asObservable();

  // Coordinate with domain layer
  setInput(input: OeeInput): void {
    this.inputSubject.next(input);
    const result = OeeCalculationService.calculate(input);
    this.resultSubject.next(result);
  }
}
```

**View Model**:

```typescript
export class OeeViewModel {
  static formatMetric(value: number): string {
    if (value === 0) return "--";
    return `${(value * 100).toFixed(1)}%`;
  }
}
```

**Benefits**:

- ✅ Centralized state management
- ✅ Reactive updates propagate automatically
- ✅ Business logic decoupled from presentation

---

### 3. Domain Layer (Business Logic)

**Files**: `oee-calculation.service.ts`

**Responsibility**:

- Pure business logic for OEE calculations
- Input validation
- Complex computations
- Status determination

**Key Characteristic**: **ZERO dependencies on UI or framework**

```typescript
export class OeeCalculationService {
  // Pure function - same input always produces same output
  static calculate(input: OeeInput): OeeResult {
    // Validation
    if (!this.isValidInput(input)) {
      return this.createEmptyResult(input);
    }

    // Calculations
    const operatingTime = input.plannedProductionTime - input.downtime;
    const availability = operatingTime / input.plannedProductionTime;
    const performance = (input.totalUnitsProduced * input.targetCycleTime) / (operatingTime * 60);
    const quality = input.goodUnitsProduced / input.totalUnitsProduced;
    const oee = availability * performance * quality;

    // Return domain model
    return {
      availability: Math.min(1, availability),
      performance: Math.max(0, performance),
      quality: Math.min(1, quality),
      oee: Math.min(1, oee),
      // ... other result fields
    };
  }

  private static isValidInput(input: OeeInput): boolean {
    // Validation logic
  }
}
```

**Benefits**:

- ✅ Can be tested without Angular
- ✅ Portable to other frameworks
- ✅ Predictable, deterministic behavior
- ✅ Easy to reason about

---

### 4. Data Layer (Models)

**Files**: `oee-input.ts`

**Responsibility**:

- Define data structures
- Establish contracts
- Set constants and thresholds

```typescript
export interface OeeInput {
  plannedProductionTime: number;
  downtime: number;
  totalUnitsProduced: number;
  goodUnitsProduced: number;
  targetCycleTime: number;
  targetProductionRate?: number;
}

export interface OeeResult {
  availability: number;
  performance: number;
  quality: number;
  oee: number;
  // ... other fields
}

export enum OeeStatus {
  EXCELLENT = "Excellent",
  GOOD = "Good",
  ACCEPTABLE = "Acceptable",
  POOR = "Poor",
  AWAITING_INPUT = "Awaiting Input",
}

export const OEE_THRESHOLDS = {
  EXCELLENT: 0.95,
  GOOD: 0.85,
  ACCEPTABLE: 0.7,
  POOR: 0,
};
```

**Benefits**:

- ✅ Single source of truth for data contracts
- ✅ Type safety across all layers
- ✅ Easy to modify and version

---

## Data Flow

```
User Input
    ↓
[Presentation Layer: Component]
    ↓
onInputChange() calls updateInput()
    ↓
[Application Layer: State Service]
    ↓
setInput() delegates to domain layer
    ↓
[Domain Layer: Calculation Service]
    ↓
calculate() returns OeeResult
    ↓
[Application Layer: State Service]
    ↓
resultSubject.next(result)
    ↓
[Presentation Layer: Component]
    ↓
result$ observable fires
    ↓
updateCharts() & UI re-renders
```

---

## SOLID Principles Implementation

### Single Responsibility Principle (SRP)

- ✅ **OeeCalculationService**: Only OEE calculations
- ✅ **OeeStateService**: Only state management
- ✅ **OeeViewModel**: Only view formatting
- ✅ **Home Component**: Only presentation

### Open/Closed Principle (OCP)

- ✅ Services accept interfaces, not concrete classes
- ✅ Easy to extend with new calculation methods
- ✅ Can add new status levels without modifying existing code

### Liskov Substitution Principle (LSP)

- ✅ Services implement consistent interfaces
- ✅ Observable patterns are standardized
- ✅ Dependency injection ensures substitutability

### Interface Segregation Principle (ISP)

- ✅ Minimal interfaces focused on single concerns
- ✅ OeeInput and OeeResult are simple, focused
- ✅ Components only know about needed methods

### Dependency Inversion Principle (DIP)

- ✅ Components depend on abstractions (Observable)
- ✅ Not on concrete service implementations
- ✅ Angular DI handles dependency resolution

---

## Testing Strategy

### Unit Tests (Domain Layer)

```typescript
describe("OeeCalculationService", () => {
  it("should calculate OEE correctly", () => {
    const input: OeeInput = {
      /* ... */
    };
    const result = OeeCalculationService.calculate(input);
    expect(result.oee).toBeCloseTo(0.85, 2);
  });

  // Can test with pure functions - no mocks needed!
});
```

### Integration Tests (Application Layer)

```typescript
describe("OeeStateService", () => {
  it("should update state and notify subscribers", (done) => {
    const service = new OeeStateService();

    service.result$.subscribe((result) => {
      expect(result.oee).toBeGreaterThan(0);
      done();
    });

    service.setInput(testInput);
  });
});
```

### E2E Tests (Presentation Layer)

```typescript
describe("Home Component", () => {
  it("should display result when input changes", async () => {
    component.onInputChange("plannedProductionTime", 500);
    fixture.detectChanges();

    const oeeDisplay = fixture.debugElement.query(By.css(".hero-summary strong"));
    expect(oeeDisplay.nativeElement.textContent).toContain("%");
  });
});
```

---

## Dependency Graph

```
Presentation Layer
    ↓ (depends on)
Application Layer
    ↓ (depends on)
Domain Layer
    ↓ (depends on)
Data Layer
```

**Unidirectional**: Never goes backwards (no circular dependencies)

---

## Scalability Roadmap

### Phase 1: Current (MVP)

- ✅ Single line calculation
- ✅ Real-time UI updates
- ✅ Basic charts

### Phase 2: Data Persistence

- Add database layer
- Store calculation history
- Track trends

### Phase 3: Multi-Line

- Extend input to multiple production lines
- Aggregate metrics
- Comparative analysis

### Phase 4: Real-time Integration

- WebSocket for live data
- Streaming calculations
- Dashboard monitoring

### Phase 5: Advanced Analytics

- Machine learning for predictions
- Anomaly detection
- Optimization recommendations

**All phases maintain clean architecture - each layer remains independent**

---

## Key Metrics

| Metric           | Value     | Status |
| ---------------- | --------- | ------ |
| Code Duplication | Low       | ✅     |
| Testability      | High      | ✅     |
| Maintainability  | High      | ✅     |
| Scalability      | High      | ✅     |
| Performance      | Excellent | ✅     |

---

## Configuration Management

### Thresholds (Easy to Change)

```typescript
// File: src/app/model/oee-input.ts
export const OEE_THRESHOLDS = {
  EXCELLENT: 0.95, // ← Adjust here
  GOOD: 0.85,
  ACCEPTABLE: 0.7,
  POOR: 0,
};
```

### Colors (Easy to Change)

```typescript
// File: src/app/services/oee-state.service.ts
getStatusColor(status: OeeStatus): string {
  switch (status) {
    case OeeStatus.EXCELLENT:
      return '#14b8a6';  // ← Adjust here
    // ...
  }
}
```

### Formulas (Easy to Change)

```typescript
// File: src/app/services/oee-calculation.service.ts
// Change calculation logic in one place,
// affects entire application
```

---

## Conclusion

This architecture provides:

1. **Clarity**: Each layer has a clear purpose
2. **Testability**: Can test each layer independently
3. **Maintainability**: Easy to find and modify code
4. **Scalability**: Can add features without breaking existing code
5. **Reusability**: Services can be used in other projects
6. **Flexibility**: Can swap implementations easily

The OEE Dashboard is production-ready and follows industry best practices for Angular application architecture.
