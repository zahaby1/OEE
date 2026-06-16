import { OeeResult, OeeStatus } from '../model/oee-input';

/**
 * OEE View Model
 * Prepares data for UI display - presentation layer
 */
export class OeeViewModel {
  /**
   * Format metric value for display as percentage
   */
  static formatMetric(value: number): string {
    if (value === 0) return '--';
    return `${(value * 100).toFixed(1)}%`;
  }

  /**
   * Get CSS class for metric status
   */
  static getMetricClass(value: number): string {
    if (value >= 0.9) return 'metric-excellent';
    if (value >= 0.75) return 'metric-good';
    if (value > 0) return 'metric-poor';
    return 'metric-empty';
  }

  /**
   * Get status text for metric
   */
  static getStatusText(value: number): string {
    if (value === 0) return 'Awaiting values';
    if (value >= 0.9) return 'Excellent';
    if (value >= 0.75) return 'Good';
    return 'Needs improvement';
  }

  /**
   * Prepare result for chart display
   */
  static prepareChartData(result: OeeResult) {
    return [
      Math.round(result.availability * 100),
      Math.round(result.performance * 100),
      Math.round(result.quality * 100),
    ];
  }

  /**
   * Get interpretation with color coding
   */
  static getInterpretationClass(status: OeeStatus): string {
    switch (status) {
      case OeeStatus.EXCELLENT:
        return 'interpretation-excellent';
      case OeeStatus.GOOD:
        return 'interpretation-good';
      case OeeStatus.ACCEPTABLE:
        return 'interpretation-acceptable';
      case OeeStatus.POOR:
        return 'interpretation-poor';
      case OeeStatus.AWAITING_INPUT:
      default:
        return 'interpretation-empty';
    }
  }

  /**
   * Get detailed metrics breakdown for reporting
   */
  static getMetricsBreakdown(result: OeeResult) {
    return {
      oee: {
        label: 'Overall Equipment Effectiveness',
        value: this.formatMetric(result.oee),
        status: this.getStatusText(result.oee),
      },
      availability: {
        label: 'Equipment Availability',
        value: this.formatMetric(result.availability),
        status: this.getStatusText(result.availability),
        description: `Operating ${result.operatingTime} minutes out of ${result.plannedTime} planned (${result.downtime} min downtime)`,
      },
      performance: {
        label: 'Production Performance',
        value: this.formatMetric(result.performance),
        status: this.getStatusText(result.performance),
        description: `Actual rate: ${result.actualProductionRate.toFixed(2)} units/min`,
      },
      quality: {
        label: 'Product Quality',
        value: this.formatMetric(result.quality),
        status: this.getStatusText(result.quality),
        description: `${result.goodUnitsProduced} good units of ${result.totalUnitsProduced} produced (${result.defectiveUnits} defective)`,
      },
    };
  }
}
