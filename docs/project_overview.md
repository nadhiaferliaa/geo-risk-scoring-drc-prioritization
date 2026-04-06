# Project Overview
## Project Summary
This project develops a geospatial risk-scoring framework to prioritize Disaster Recovery Center (DRC) locations using a structured, grid-based analytical approach. The case study focuses on Kabupaten Bekasi and integrates four core spatial drivers: flood risk, elevation, road accessibility, and land-use suitability.

The project began with a practical question: how can a critical facility be located in a way that is not only spatially feasible, but also operationally resilient and analytically defensible? Instead of relying on a single map overlay or a purely visual interpretation, the workflow converts each input into comparable score classes, aggregates them through weighted scoring, and evaluates the stability of recommendations under different strategic priorities.

## Analytical Positioning
The main value of the project is not the map itself, nor the WebGIS interface alone. The strongest contribution lies in the analytical logic behind the output. The workflow translates heterogeneous data sources into structured risk indicators, constructs a transparent scoring model, and produces a prioritized shortlist that can be explained to non-technical stakeholders.

This matters because many geospatial projects stop at visualization. In contrast, this project pushes further into segmentation, prioritization, scenario testing, and recommendation logic. As a result, it is better understood as an explainable decision-support framework with a geospatial interface, rather than as a standalone mapping exercise.

## Core Question
The project addresses the following analytical question:

> Which areas remain the most credible candidates for DRC development when resilience, accessibility, and feasibility are evaluated together, and how does the recommendation change when decision priorities shift?

This framing is important because it moves the project beyond simple ranking. The goal is not only to identify a high-scoring grid, but also to understand whether the recommendation remains stable when the weighting logic changes.

## Main Components
The repository combines two connected components:

### 1. Scenario-Based Analytical Model
This component represents the analytical core of the project. It applies scoring, hard constraints, weighted aggregation, and multiple scenario configurations to identify a robust priority zone.

### 2. WebGIS Decision-Support Layer
This component packages processed outputs into a lightweight interactive interface. It allows the final scored grids, highly suitable subset, and Top 5 / Top 3 / Top 1 candidates to be explored visually and used for presentation.


## Main Outcome
The project produces two slightly different but analytically related outputs:
- the scenario-based model identifies one primary zone made up of three grids;
- the single-weight WebGIS implementation narrows the shortlist into two selected grids;
- one of the WebGIS-selected grids overlaps with the main scenario-based zone.


## What the Project Demonstrates
This project demonstrates the ability to:
- define a consistent observation unit through grid-based analysis;
- translate raw spatial layers into structured risk drivers;
- design a transparent rule-based scoring process;
- apply hard constraints before weighted ranking;
- test model behavior under alternative scenario priorities;
- communicate analytical outputs through recommendation tiers and a map-based dashboard.
---