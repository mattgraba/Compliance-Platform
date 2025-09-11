#!/usr/bin/env bash
set -euo pipefail

echo "🔎 Checking project documentation..."

missing=0

# Must-have top-level docs
TOP_LEVEL_DOCS=(
  "docs/Tour.md"
  "docs/Glossary.md"
)

# Every component must have a doc under docs/components/
COMPONENTS_DIR="docs/components"
RUNBOOKS_DIR="docs/runbooks"
DASHBOARDS_DIR="docs/dashboards"
API_DIR="docs/api"

# 1. Check top-level docs
for file in "${TOP_LEVEL_DOCS[@]}"; do
  if [ ! -s "$file" ]; then
    echo "❌ Missing or empty: $file"
    missing=1
  else
    echo "✅ Found: $file"
  fi
done

# 2. Check each component doc has a runbook, dashboard, and API reference
if [ -d "$COMPONENTS_DIR" ]; then
  for component_file in "$COMPONENTS_DIR"/*.md; do
    [ -e "$component_file" ] || continue # skip if no files
    component_name=$(basename "$component_file" .md)

    echo "📂 Checking component: $component_name"

    runbook="$RUNBOOKS_DIR/${component_name,,}.md"
    dashboard="$DASHBOARDS_DIR/${component_name}.md"
    api="$API_DIR/${component_name}.md"

    for file in "$runbook" "$dashboard" "$api"; do
      if [ ! -s "$file" ]; then
        echo "❌ Missing or empty: $file"
        missing=1
      else
        echo "✅ Found: $file"
      fi
    done
  done
else
  echo "⚠️ No components directory found: $COMPONENTS_DIR"
  missing=1
fi

if [ "$missing" -ne 0 ]; then
  echo "❌ Documentation check failed."
  exit 1
fi

echo "✅ All required docs present and non-empty."
