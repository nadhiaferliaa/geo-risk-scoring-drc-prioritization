# Insights
## Reading the Project Beyond the Map
The most important insight from this project is that the strongest output is not simply a final map or a single recommended location. The real analytical value lies in how the project tests recommendation stability under changing priorities.

A weak decision model can produce a ranked output, but a stronger analytical model asks a deeper question: does the recommendation remain credible when the weighting logic changes? This project addresses that question directly through scenario-based testing and comparison against a simplified operational WebGIS shortlist.

## Insight 1 — The Four Variables Behave as Risk Drivers
The four core inputs are not just map layers. They function as distinct analytical drivers:
- flood risk captures disruption exposure and continuity risk,
- elevation provides a supporting resilience context,
- road accessibility represents operational response capability,
- land-use suitability represents feasibility and proxy cost-efficiency.

This interpretation is important because it reframes the project from a GIS workflow into a risk-informed decision model.

## Insight 2 — Hard Constraints Improve Decision Discipline
Applying hard constraints before weighted scoring significantly strengthens the methodology. It prevents the model from recommending locations that may look attractive under certain dimensions but remain fundamentally unsuitable.

This is especially important in accessibility-first or proxy cost-efficiency scenarios. Without hard constraints, a convenient or feasible-looking location could rank too highly despite severe flood exposure or clear incompatibility.

## Insight 3 — Scenario Analysis Reveals Robustness, Not Just Ranking
The scenario analysis demonstrates that good prioritization is not only about producing a high score. It is also about understanding how stable that score remains when the decision emphasis changes.

This leads to a more mature interpretation of the output:
- some candidates are broadly robust,
- some are sensitive to accessibility priorities,
- some weaken when resilience receives stronger emphasis.

In other words, the project does not merely rank sites. It evaluates sensitivity and stability.

## Insight 4 — The Two Outputs Are Different but Consistent
At first glance, the scenario-based model and the WebGIS shortlist may appear to produce different answers. In reality, the difference is analytically meaningful rather than contradictory.

- The scenario-based model identifies a broader primary zone of three grids.
- The single-weight WebGIS implementation narrows the result into two selected grids.
- One selected WebGIS grid overlaps with the broader scenario-based zone.

This suggests that the model contains both a broader robust area and a narrower operational shortlist. The overlapping grid acts as a core candidate that remains relevant under both framings.

## Insight 5 — The Project Shows Explainability as a Strength
A major strength of the project is that the reasoning behind the output remains visible. The workflow is rule-based, transparent, and auditable. Each grid carries interpretable attributes, and the role of each variable is understandable.

That transparency matters because analytical outputs become more valuable when they can be defended in front of stakeholders. In that sense, the WebGIS layer is not just visual decoration. It becomes a communication layer for structured analysis.