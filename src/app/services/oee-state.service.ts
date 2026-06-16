import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OeeInput, OeeResult, OeeStatus } from '../model/oee-input';
import { OeeCalculationService } from './oee-calculation.service';

/**
 * OEE State Management Service
 * Manages the state of OEE calculations using reactive patterns
 */
@Injectable({
  providedIn: 'root',
})
export class OeeStateService {
  // Default input values
  private defaultInput: OeeInput = {
    plannedProductionTime: 0,
    downtime: 0,
    totalUnitsProduced: 0,
    goodUnitsProduced: 0,
    targetCycleTime: 60, // 1 unit per minute default
  };

  // State streams
  private inputSubject = new BehaviorSubject<OeeInput>({ ...this.defaultInput });
  private resultSubject = new BehaviorSubject<OeeResult>(
    OeeCalculationService.calculate(this.defaultInput)
  );

  // Public observables
  input$ = this.inputSubject.asObservable();
  result$ = this.resultSubject.asObservable();

  constructor() {}

  /**
   * Get current input (synchronous access)
   */
  getInput(): OeeInput {
    return this.inputSubject.getValue();
  }

  /**
   * Get current result (synchronous access)
   */
  getResult(): OeeResult {
    return this.resultSubject.getValue();
  }

  /**
   * Update a single input field and recalculate
   */
  updateInput(field: keyof OeeInput, value: number): void {
    const currentInput = this.inputSubject.getValue();
    const updatedInput = { ...currentInput, [field]: value };
    this.setInput(updatedInput);
  }

  /**
   * Set complete input and recalculate OEE
   */
  setInput(input: OeeInput): void {
    this.inputSubject.next(input);
    const result = OeeCalculationService.calculate(input);
    this.resultSubject.next(result);
  }

  /**
   * Reset to default values
   */
  reset(): void {
    this.setInput({ ...this.defaultInput });
  }

  /**
   * Get status interpretation for UI display
   */
  getStatusColor(status: OeeStatus): string {
    switch (status) {
      case OeeStatus.EXCELLENT:
        return '#14b8a6'; // Green
      case OeeStatus.GOOD:
        return '#06b6d4'; // Cyan
      case OeeStatus.ACCEPTABLE:
        return '#f59e0b'; // Amber
      case OeeStatus.POOR:
        return '#ef4444'; // Red
      case OeeStatus.AWAITING_INPUT:
      default:
        return '#9ca3af'; // Gray
    }
  }
}
