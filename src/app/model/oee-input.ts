/**
 * OEE Input Model
 * Represents all raw production data needed for OEE calculation
 */
export interface OeeInput {
  plannedProductionTime: number; // in minutes - total time allocated for production
  downtime: number; // in minutes - machine/equipment downtime
  totalUnitsProduced: number; // actual number of units produced
  goodUnitsProduced: number; // number of units meeting quality standards
  targetCycleTime: number; // in seconds - ideal time per unit, OR
  targetProductionRate?: number; // units per minute (alternative to cycle time)
}

/**
 * OEE Calculation Result Model
 * Contains all calculated metrics and their status
 */
export interface OeeResult {
  // Core pillars (0-1 scale)
  availability: number; // Operating time / Planned time
  performance: number; // Actual production rate / Target production rate
  quality: number; // Good units / Total units
  oee: number; // Availability × Performance × Quality

  // Operating times (minutes)
  operatingTime: number;
  plannedTime: number;
  downtime: number;

  // Production metrics
  totalUnitsProduced: number;
  goodUnitsProduced: number;
  defectiveUnits: number;
  actualProductionRate: number; // units per minute

  // Status indicators
  status: OeeStatus;
  interpretation: string;
}

export enum OeeStatus {
  EXCELLENT = 'Excellent',
  GOOD = 'Good',
  ACCEPTABLE = 'Acceptable',
  POOR = 'Poor',
  AWAITING_INPUT = 'Awaiting Input',
}

/**
 * OEE Metrics Interpretation Thresholds
 */
export const OEE_THRESHOLDS = {
  EXCELLENT: 0.95,      // 95% and above
  GOOD: 0.85,           // 85-94%
  ACCEPTABLE: 0.70,     // 70-84%
  POOR: 0,              // Below 70%
};
