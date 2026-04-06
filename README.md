## Overview
This repository presents a grid-based geo-risk scoring framework for prioritizing Disaster Recovery Center (DRC) locations in Kabupaten Bekasi. The project integrates flood risk, elevation, road accessibility, and land-use suitability into an explainable multi-criteria decision model. In addition to the analytical workflow, the repository includes a lightweight WebGIS prototype that translates the results into an interactive shortlist and map-based decision-support interface.

Rather than treating site selection as a purely cartographic exercise, this project positions spatial data as structured risk inputs. The main value of the work lies in converting heterogeneous geospatial variables into comparable scores, testing how recommendations shift under changing priorities, and producing an output that is interpretable for stakeholders.

## Why This Project Matters
A DRC is a critical operational facility. Choosing its location requires more than proximity-based reasoning or intuitive judgment. A suitable site should balance operational resilience, accessibility, and development feasibility. This project was designed to support that decision through a transparent scoring framework and a concise shortlist process.

## Objectives
- Build a grid-based geo-risk scoring framework for DRC site prioritization.
- Standardize heterogeneous spatial variables into a comparable analytical structure.
- Evaluate ranking stability under different scenario-based weighting strategies.
- Translate analytical outputs into recommendation tiers and interactive decision support.
- Demonstrate transferable risk-analytics thinking through a geospatial case study.

## Analytical Drivers
The model uses four main drivers:
- **Flood risk** as the primary disruption and resilience indicator.
- **Elevation** as a supporting topographic and resilience proxy.
- **Road accessibility** as an operational accessibility indicator.
- **Land-use suitability** as a feasibility and proxy cost-efficiency indicator.

## Workflow Summary
1. Define the administrative study boundary.
2. Generate a grid-based observation unit.
3. Prepare and align flood, elevation, road, and land-use layers.
4. Convert each variable into comparable score classes.
5. Apply hard constraints to exclude clearly unsuitable areas.
6. Calculate weighted composite scores for each grid.
7. Test alternative weighting scenarios.
8. Classify outputs into recommendation tiers.
9. Narrow the shortlist into Top 5, Top 3, and Top 1 candidates.
10. Publish the results through a lightweight WebGIS dashboard.

## Scenario Design
The analytical framework is tested through four weighting strategies:
- **Balanced**
- **Resilience-first**
- **Accessibility-first**
- **Cost-efficiency-first (proxy-based)**

The cost-efficiency scenario should not be interpreted as a literal financial cost model, because the project does not yet include direct variables such as land price, construction cost, utility cost, or relocation cost. Instead, it uses land-cover compatibility, access proximity, and topographic practicality as proxy indicators.

## Key Findings
A key insight from the project is that both analytical approaches point to the same primary area, but with different output structures.

- The **scenario-based analytical model** identifies one main priority zone composed of **three grids**.
- The **single-weight WebGIS implementation** narrows the shortlist into **two selected grids**.
- **One WebGIS-selected grid overlaps with the main scenario-based zone**, indicating the presence of a stable core candidate.

This means the result is not only about selecting one "best" location. More importantly, it shows which recommendation remains credible when decision priorities change. That robustness perspective is one of the strongest analytical contributions of the project.
