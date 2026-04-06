# Methodology
## Methodological Framing
The methodology is designed as a transparent multi-criteria analytical workflow. Its purpose is not only to rank candidate locations, but also to make the logic of prioritization interpretable. The workflow therefore combines spatial preprocessing, score standardization, hard-constraint filtering, weighted aggregation, and scenario testing.

The project uses a grid as the main observation unit. This is methodologically important because it transforms heterogeneous spatial layers into a structured analytical base. Once all variables are translated into grid-level attributes, each observation becomes directly comparable, making it possible to generate an explainable composite score.

## Step 1 — Study Boundary Definition
The first stage establishes the administrative boundary of the study area. This defines the scope of exposure and ensures that all subsequent analysis is carried out within a consistent spatial extent. In analytical terms, this stage sets the boundary of analysis and prevents irrelevant spatial spillover.

## Step 2 — Grid-Based Observation Unit
A regular grid is created across the study area to serve as the main analytical unit. This step is essential because the original data layers differ in geometry, scale, and semantic meaning. By converting them into a common grid-based structure, the project creates a repeatable observation framework in which all spatial drivers can be evaluated consistently.

## Step 3 — Input Layer Preparation
Four input layers are prepared and aligned:
- flood risk,
- elevation,
- road accessibility,
- land-use suitability.

At this stage, data preprocessing may include clipping, overlay alignment, buffering, zonal summarization, reclassification, and attribute cleaning. The goal is not merely to display the layers, but to translate them into interpretable decision variables.

## Step 4 — Variable Interpretation and Scoring Logic
Each input layer is interpreted as a distinct analytical driver:
- **Flood risk** functions as the primary resilience and disruption indicator.
- **Elevation** functions as a supporting resilience proxy and topographic context variable.
- **Road accessibility** functions as an operational accessibility proxy.
- **Land-use suitability** functions as a feasibility and proxy cost-efficiency indicator.

The variables are then converted into score classes so that they become comparable. The exact breakpoints may vary depending on implementation, but the scoring logic follows a common principle: higher scores represent more favorable conditions for DRC prioritization.

## Step 5 — Hard Constraints
Before weighted scoring is applied, clearly unsuitable areas are removed through hard constraints. This is a critical methodological safeguard. It ensures that extreme-risk or clearly infeasible areas do not remain in competition simply because they perform well on other variables.

Typical hard constraints include:
- very high flood-risk classes,
- water bodies,
- clearly incompatible land-use categories,
- other areas that are logically unsuitable for critical facility development.

This stage prevents the model from making analytically misleading recommendations, such as ranking a cheap or accessible location that remains fundamentally unsafe.

## Step 6 — Analytical Base Table Construction
After scoring and filtering, each grid carries a structured set of attributes such as flood score, elevation score, road score, land-use score, and total score. This stage converts geospatial layers into an analytical base table. In practical terms, this is where the project moves from spatial preprocessing into true risk-style analysis.

## Step 7 — Weighted Composite Scoring
The model computes a composite score for each eligible grid using a weighted linear combination:

**Total Score = (w_flood × flood_score) + (w_elevation × elevation_score) + (w_road × road_score) + (w_landuse × landuse_score)**

The logic is deliberately rule-based and explainable. The model does not attempt to function as a black box. Instead, it makes the contribution of each driver visible and auditable.

## Step 8 — Scenario-Based Weighting
The same scored grids are evaluated under several weighting strategies. This is the core of the sensitivity analysis. Rather than asking only which grid ranks highest under one assumption, the project asks how rankings behave when the decision emphasis changes.

The scenarios are designed to reflect different decision priorities:
- a balanced benchmark,
- a resilience-first perspective,
- an accessibility-first perspective,
- a proxy-based cost-efficiency perspective.

Because the data inputs and score classes remain constant, the changing rankings reflect changes in decision priorities rather than changes in raw evidence.

## Step 9 — Recommendation Tiers and Shortlisting
Composite scores are translated into recommendation classes such as highly suitable, suitable, moderately suitable, and not suitable. For stronger analytical communication, these can also be interpreted as decision tiers:
- Tier 1 – Strategic Priority
- Tier 2 – Recommended
- Tier 3 – Review Needed
- Tier 4 – Not Recommended

The project then narrows the results into Top 5, Top 3, and Top 1 candidate layers for presentation and operational review.

## Step 10 — WebGIS Communication Layer
The final methodological layer is communication. Processed outputs are published through a lightweight WebGIS dashboard that allows users to inspect the final scored grid, the highly suitable subset, and the shortlist candidates. This stage does not replace the analytical model; it acts as a stakeholder-facing decision-support layer.