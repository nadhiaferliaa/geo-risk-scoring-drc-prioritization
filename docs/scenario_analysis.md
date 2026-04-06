# Scenario Analysis
## Purpose of Scenario Analysis
The scenario analysis is designed to test whether the prioritization outcome is robust under changing strategic priorities. Instead of assuming that one weighting configuration is universally correct, the project evaluates how the same scored grids behave when the decision emphasis shifts.

This is methodologically important because a strong recommendation should not depend entirely on one arbitrary preference setting. If a candidate remains strong across multiple scenarios, its credibility increases. If it performs well only under one configuration, it should be interpreted as more sensitive and less robust.

## Common Analytical Base
All scenarios share the same analytical foundation:
- the same study area,
- the same grid-based observation unit,
- the same input variables,
- the same score classes,
- the same hard constraints.

The only element that changes is the weighting logic. This means that differences in ranking are interpreted as differences in strategic priorities, not differences in raw evidence.

## Scenario Set

### 1. Balanced Scenario
**Illustrative weights:**
- Flood risk = 35%
- Elevation = 15%
- Road accessibility = 25%
- Land-use suitability = 25%

This scenario acts as the analytical benchmark. Flood risk remains the dominant consideration, but accessibility and feasibility still retain substantial influence. Elevation is included as a supporting resilience variable without being allowed to dominate the model.

**Interpretation:**
This scenario is suitable when the decision aims to balance safety, accessibility, and practical development conditions without strongly favoring one dimension over the others.

### 2. Resilience-First Scenario
**Illustrative weights:**
- Flood risk = 45%
- Elevation = 20%
- Road accessibility = 15%
- Land-use suitability = 20%

This scenario prioritizes continuity, safety, and resilience. Flood risk receives the highest emphasis, while elevation is strengthened as a supporting resilience proxy. Accessibility still matters, but not enough to outweigh major safety concerns.

**Expected behavior:**
Locations with lower flood exposure and stronger topographic support rise in ranking, even if they are not the closest to major roads.

### 3. Accessibility-First Scenario
**Illustrative weights:**
- Flood risk = 25%
- Elevation = 10%
- Road accessibility = 40%
- Land-use suitability = 25%

This scenario prioritizes fast access, operational mobility, and response efficiency. It simulates a decision environment where connection to main roads is considered especially important.

**Expected behavior:**
Grids close to major roads, especially those in the strongest buffer class, rise in ranking. However, because hard constraints have already removed clearly unsafe areas, the model still avoids selecting locations that are operationally convenient but fundamentally inappropriate.

### 4. Cost-Efficiency-First Scenario
**Illustrative weights:**
- Flood risk = 25%
- Elevation = 10%
- Road accessibility = 25%
- Land-use suitability = 40%

This scenario should be interpreted carefully. The project does not yet include direct financial variables such as land price, construction cost, or utility cost. Therefore, this scenario is better understood as a **proxy-based feasibility and cost-efficiency perspective**, not as a literal cost model.

Land-use suitability receives the greatest emphasis because it acts as the strongest proxy for compatibility and ease of development. Road accessibility remains relevant because implementation efficiency is often associated with better access.

**Expected behavior:**
Compatible land-use classes with practical access tend to rise in ranking, as long as they do not violate the earlier hard constraints.

## Interpreting the Results
The most important analytical question is not simply which scenario produces the highest score, but which candidate remains stable across scenarios. In practical terms, the project asks:
- Which grids remain Tier 1 under multiple scenarios?
- Which grids rise only when accessibility is prioritized?
- Which candidates weaken when resilience becomes dominant?
- Which recommendations are robust, and which are assumption-sensitive?

This perspective makes the scenario analysis more than a visual comparison. It becomes a structured test of recommendation stability.

## Observed Result Pattern
In this project, the scenario-based analytical model identifies a primary priority zone consisting of three grids. By contrast, the simplified WebGIS implementation with single weighting narrows the shortlist into two selected grids. One of the WebGIS-selected grids overlaps with the main scenario-based zone.

This pattern suggests that the analysis captures both **robustness** and **granularity**:
- the scenario-based model highlights a broader robust zone,
- the WebGIS version presents a narrower operational shortlist,
- the overlapping grid functions as a stable core candidate.