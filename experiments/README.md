# Ruchy Language Scientific Experiments

This directory contains reproducible scientific reports documenting Ruchy language behavior across versions.

## Purpose

Each experiment is a self-contained, reproducible test that documents:
1. What feature is being tested
2. Expected behavior
3. Actual behavior
4. Reproduction steps
5. Impact assessment

## Directory Structure

```
experiments/
├── README.md                 # This file
├── EXPERIMENT_TEMPLATE.md    # Template for new experiments
└── v{VERSION}/              # Version-specific experiments
    ├── experiment_001_test_functions.ruchy
    ├── experiment_002_dataframes.ruchy
    └── SUMMARY.md           # Version summary report
```

## Running Experiments

Each experiment can be run independently:

```bash
# Run a single experiment
ruchy experiments/v3.62.9/experiment_001_test_functions.ruchy

# Run all experiments for a version
for exp in experiments/v3.62.9/*.ruchy; do
    echo "Running: $exp"
    ruchy "$exp" 2>&1 | tee "${exp%.ruchy}.log"
done
```

## Experiment Naming Convention

`experiment_{NUMBER}_{FEATURE}.ruchy`

- NUMBER: 3-digit sequential number
- FEATURE: Short descriptive name (snake_case)

## Scientific Rigor

Each experiment MUST:
1. Be 100% reproducible
2. Document the exact Ruchy version
3. Include expected vs actual output
4. Be runnable with a single command
5. Document the failure mode clearly

## Reporting Issues

These experiments serve as bug reports for the Ruchy team. When filing issues:
1. Reference the experiment file
2. Include the version-specific directory
3. Attach the .log output file
4. Link to the GitHub commit containing the experiment