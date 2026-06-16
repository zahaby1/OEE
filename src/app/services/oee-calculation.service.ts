import {
  OeeInput,
  OeeResult,
  OeeStatus,
  OEE_THRESHOLDS,
} from '../model/oee-input';

/**
 * OEE Calculation Service
 * Implements industry-standard OEE formulas
 * 
 * OEE Formula: Availability × Performance × Quality
 * 
 * Where:
 * - Availability = Operating Time / Planned Time
 * - Performance = (Total Units × Target Cycle Time) / (Operating Time × 60)
 * - Quality = Good Units / Total Units Produced
 */
export class OeeCalculationService {
  /**
   * Calculate OEE metrics from production input data
   * @param input Raw production data
   * @returns Complete OEE calculation result
   */
  static calculate(input: OeeInput): OeeResult {
    // Validation
    if (!this.isValidInput(input)) {
      return this.createEmptyResult(input);
    }

    // Step 1: Calculate Operating Time
    const operatingTime = input.plannedProductionTime - input.downtime;
    if (operatingTime <= 0) {
      return this.createEmptyResult(input);
    }

    // Step 2: Calculate Availability
    // Availability = Operating Time / Planned Production Time
    const availability = operatingTime / input.plannedProductionTime;

    // Step 3: Calculate Performance
    // Performance = (Total Units × Target Cycle Time) / (Operating Time × 60)
    // This equals: (Actual Production Rate) / (Target Production Rate)
    const performance = (input.totalUnitsProduced * input.targetCycleTime) / (operatingTime * 60);
    const actualProductionRate = input.totalUnitsProduced / operatingTime;

    // Step 4: Calculate Quality
    // Quality = Good Units / Total Units Produced
    const quality = input.totalUnitsProduced > 0 
      ? input.goodUnitsProduced / input.totalUnitsProduced 
      : 0;

    // Step 5: Calculate OEE
    // OEE = Availability × Performance × Quality
    const oee = availability * performance * quality;

    // Build result
    const result: OeeResult = {
      availability: Math.min(1, Math.max(0, availability)),
      performance: Math.max(0, performance),
      quality: Math.min(1, Math.max(0, quality)),
      oee: Math.min(1, Math.max(0, oee)),
      operatingTime,
      plannedTime: input.plannedProductionTime,
      downtime: input.downtime,
      totalUnitsProduced: input.totalUnitsProduced,
      goodUnitsProduced: input.goodUnitsProduced,
      defectiveUnits: input.totalUnitsProduced - input.goodUnitsProduced,
      actualProductionRate,
      status: this.determineStatus(oee),
      interpretation: this.getInterpretation(oee, {
        availability,
        performance,
        quality,
      }),
    };

    return result;
  }

  /**
   * Calculate target production rate based on cycle time
   */
  private static calculateTargetRate(input: OeeInput): number {
    if (input.targetProductionRate) {
      return input.targetProductionRate;
    }
    // Convert cycle time (seconds) to production rate (units/minute)
    return input.targetCycleTime > 0 ? 60 / input.targetCycleTime : 1;
  }

  /**
   * Validate input data
   */
  private static isValidInput(input: OeeInput): boolean {
    const hasValidTime = input.targetCycleTime > 0 || (input.targetProductionRate ?? 0) > 0;
    return (
      input.plannedProductionTime > 0 &&
      input.downtime >= 0 &&
      input.totalUnitsProduced >= 0 &&
      input.goodUnitsProduced >= 0 &&
      input.goodUnitsProduced <= input.totalUnitsProduced &&
      hasValidTime
    );
  }

  /**
   * Determine OEE status based on value
   */
  private static determineStatus(oee: number): OeeStatus {
    if (oee === 0) return OeeStatus.AWAITING_INPUT;
    if (oee >= OEE_THRESHOLDS.EXCELLENT) return OeeStatus.EXCELLENT;
    if (oee >= OEE_THRESHOLDS.GOOD) return OeeStatus.GOOD;
    if (oee >= OEE_THRESHOLDS.ACCEPTABLE) return OeeStatus.ACCEPTABLE;
    return OeeStatus.POOR;
  }

  /**
   * Get human-readable interpretation of OEE result
   */
  private static getInterpretation(
    oee: number,
    metrics: {
      availability: number;
      performance: number;
      quality: number;
    }
  ): string {
    if (oee === 0) return 'Enter production data to see analysis';

    const bottleneck = this.identifyBottleneck(metrics);
    const status = this.determineStatus(oee);

    let message = `OEE: ${status} `;

    if (bottleneck !== 'balanced') {
      message += `- Focus on improving ${bottleneck}.`;
    } else {
      message += '- All metrics are performing well.';
    }

    return message;
  }

  /**
   * Identify which metric is the bottleneck (lowest performer)
   */
  private static identifyBottleneck(metrics: {
    availability: number;
    performance: number;
    quality: number;
  }): string {
    const values = [
      { name: 'availability', value: metrics.availability },
      { name: 'performance', value: metrics.performance },
      { name: 'quality', value: metrics.quality },
    ];

    const sorted = values.sort((a, b) => a.value - b.value);
    if (sorted[0].value < 0.85) {
      return sorted[0].name;
    }
    return 'balanced';
  }

  /**
   * Create empty result (when input is invalid)
   */
  private static createEmptyResult(input: OeeInput): OeeResult {
    return {
      availability: 0,
      performance: 0,
      quality: 0,
      oee: 0,
      operatingTime: 0,
      plannedTime: input.plannedProductionTime,
      downtime: input.downtime,
      totalUnitsProduced: input.totalUnitsProduced,
      goodUnitsProduced: input.goodUnitsProduced,
      defectiveUnits: input.totalUnitsProduced - input.goodUnitsProduced,
      actualProductionRate: 0,
      status: OeeStatus.AWAITING_INPUT,
      interpretation: 'Please enter valid production data',
    };
  }
}
