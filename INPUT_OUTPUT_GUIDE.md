# OEE Dashboard - Input/Output Guide

## Quick Start

The OEE Dashboard calculates **Overall Equipment Effectiveness** - how efficiently your production line is running.

---

## INPUTS (What You Enter)

### 1. Planned Production Time (minutes)

- **What it is**: Total time allocated for production in a shift
- **Example**: 8-hour shift = 480 minutes
- **Why**: Baseline for calculating availability
- **Range**: Any positive number

### 2. Downtime (minutes)

- **What it is**: Machine downtime due to breakdowns, maintenance, or changeovers
- **Example**: 45 minutes
- **Why**: Shows lost production time
- **Range**: 0 to Planned Time

### 3. Total Units Produced

- **What it is**: Complete count of ALL units produced (good AND defective)
- **Example**: 850 units
- **Why**: Base for calculating performance and quality
- **Range**: Any non-negative number

### 4. Good Units Produced

- **What it is**: Count of units that meet quality standards (zero defects)
- **Example**: 820 units
- **Why**: Measures quality/defect rate
- **Range**: 0 to Total Units

### 5. Target Cycle Time (seconds per unit)

- **What it is**: Ideal/standard time to produce ONE unit
- **Example**: 60 seconds = 1 unit per minute
- **Why**: Sets the performance target/benchmark
- **Range**: Any positive number
- **How to find**: Divide 3,600 by your target production rate
  - Target rate 100 units/hour → Cycle time = 36 seconds/unit

---

## OUTPUTS (What You Get)

### 1. Availability (%)

- **What it measures**: Equipment uptime percentage
- **Formula**: (Planned Time - Downtime) / Planned Time × 100
- **Example**: (480 - 45) / 480 = 90.6%
- **Interpretation**:
  - 95%+ = Excellent (well-maintained equipment)
  - 85-94% = Good (acceptable downtime)
  - 70-84% = Acceptable (needs monitoring)
  - <70% = Poor (urgent maintenance needed)

### 2. Performance (%)

- **What it measures**: How fast units are being produced vs target
- **Formula**: (Total Units × Target Cycle Time) / (Operating Time × 60)
- **Example**:
  - Operating Time: 450 minutes (480 - 30 downtime)
  - Total Units: 850
  - Target Cycle Time: 60 seconds
  - Performance = (850 × 60) / (450 × 60) = 51000 / 27000 = 1.89 (189%)
- **Interpretation**:
  - 100%+ = Excellent (meeting or exceeding target)
  - 85-99% = Good (slightly below target)
  - 70-84% = Acceptable (noticeable gap)
  - <70% = Poor (significant shortfall)

### 3. Quality (%)

- **What it measures**: First-pass yield / defect rate
- **Formula**: Good Units / Total Units × 100
- **Example**: 820 / 850 = 96.5%
- **Interpretation**:
  - 95%+ = Excellent (minimal defects)
  - 85-94% = Good (few defects)
  - 70-84% = Acceptable (quality issues emerging)
  - <70% = Poor (serious quality problems)

### 4. Overall OEE (%)

- **What it measures**: Overall equipment effectiveness
- **Formula**: Availability × Performance × Quality
- **Example**: 0.906 × 1.95 × 0.965 = 170% (or capped at 100%)
- **Industry Benchmarks**:
  - 95%+ = World-class manufacturing
  - 85-94% = Good operational excellence
  - 70-84% = Acceptable but needs improvement
  - <70% = Significant losses, investigate

### 5. Supporting Information

- **Operating Time**: Planned Time - Downtime
- **Defective Units**: Total Units - Good Units
- **Actual Production Rate**: Total Units ÷ Operating Time (units/min)
- **Interpretation**: AI-generated insight about what to improve

---

## Example Calculation Walkthrough

### Scenario: 8-Hour Shift Production

**INPUTS**:

- Planned Production Time: **480 minutes** (8 hours)
- Downtime: **30 minutes** (maintenance + breakdown)
- Total Units Produced: **960 units**
- Good Units Produced: **925 units**
- Target Cycle Time: **30 seconds** (2 units/minute target)

**CALCULATIONS**:

1. **Operating Time** = 480 - 30 = **450 minutes**

2. **Availability** = 450 / 480 = **93.75%** ✓ Good

3. **Performance** = (960 × 30) / (450 × 60) = 28800 / 27000 = **106.7%** ✓ Excellent

4. **Quality** = 925 / 960 = **96.4%** ✓ Excellent

5. **OEE** = 0.9375 × 1.067 × 0.964 = **0.967 = 96.7%** ✓ EXCELLENT

**INTERPRETATION**:
"Overall Equipment Effectiveness is Excellent at 96.7%! All metrics are performing well. Maintain current practices."

---

## Real-World Scenarios

### Scenario A: Quality Problem

```
Planned: 480 min
Downtime: 20 min
Total: 900
Good: 800 (88.9%)
Cycle: 60 sec

Availability: 95.8%
Performance: 100%
Quality: 88.9% ← BOTTLENECK
OEE: 85.2% → Action: Investigate product defects, improve quality control
```

### Scenario B: Performance Problem

```
Planned: 480 min
Downtime: 10 min
Total: 700
Good: 690 (98.6%)
Cycle: 60 sec

Availability: 97.9%
Performance: 76.1% ← BOTTLENECK
Quality: 98.6%
OEE: 73.8% → Action: Increase production speed, optimize process, check equipment
```

### Scenario C: Availability Problem

```
Planned: 480 min
Downtime: 120 min ← BOTTLENECK
Total: 600
Good: 580 (96.7%)
Cycle: 60 sec

Availability: 75%
Performance: 65.2%
Quality: 96.7%
OEE: 48.6% → Action: Reduce downtime, improve maintenance, prevent breakdowns
```

---

## Status Color Codes

| Status            | Color | OEE Range | Meaning                     |
| ----------------- | ----- | --------- | --------------------------- |
| 🟢 Excellent      | Green | 95-100%   | World-class, maintain       |
| 🔵 Good           | Cyan  | 85-94%    | Above average, monitor      |
| 🟡 Acceptable     | Amber | 70-84%    | Average, plan improvements  |
| 🔴 Poor           | Red   | <70%      | Below target, urgent action |
| ⚪ Awaiting Input | Gray  | N/A       | Enter data to see analysis  |

---

## Common Questions

### Q: Can Performance exceed 100%?

**A:** Yes! If you produce faster than the target cycle time, performance can be >100%. This is excellent - you're beating your target.

### Q: Why is my OEE capped at 100%?

**A:** The dashboard caps OEE at 100% for practical purposes, though mathematically it can go higher if exceeding targets significantly.

### Q: How do I improve each metric?

**Availability**:

- Reduce machine breakdowns
- Schedule maintenance during downtime
- Improve changeover times

**Performance**:

- Increase production speed (if quality maintained)
- Optimize material flow
- Reduce bottlenecks in process
- Upgrade equipment if needed

**Quality**:

- Better quality control procedures
- Operator training
- Equipment calibration
- Defect investigation & prevention

---

## Data Entry Tips

1. **Be Accurate**: Small input errors cause large OEE misrepresentations
2. **Consistent Units**: All time in minutes, all counts as whole units
3. **Include ALL downtime**: Planned stops, setup, breakdowns
4. **Count ALL production**: Good and defective both count toward total
5. **Check Cycle Time**: Ensure it matches your actual production target

---

## Export & Reporting

To save results:

1. Screenshot the dashboard
2. Take note of the metrics
3. Record the date/time
4. Track trends over days/weeks

(Full export features coming soon!)
